const fetch = require('node-fetch');
const { generateKeyPair } = require('crypto');
const { namedNode, triple } = require('@rdfjs/data-model');
const { MIME_TYPES } = require('@semapps/mime-types');
const Ed25519Multikey = require('@digitalbazaar/ed25519-multikey');
const { getSlugFromUri } = require('@semapps/ldp');
const { asArray } = require('../utils');
const KEY_TYPES = require('../keyTypes');
const KeyContainerService = require('./keys-container');
const PublicKeyContainerService = require('./public-keys-container');

/**
 * Service for managing keys (creating, storing, retrieving).
 *
 * Note:
 * Unfortunately, the [data integrity spec](https://www.w3.org/TR/vc-data-integrity/#multikey)
 * and digital bazaar library require their (ed25519) keys to be in MultiKey format.
 * We can't store the RSA key in that format, since it is (1) not specified and (2) required in
 * that format by ActivityPub. Therefore, we use two different key store formats here...
 * @type {import('moleculer').ServiceSchema}
 */
const KeyService = {
  name: 'keys',
  settings: {
    podProvider: true
  },
  created() {
    this.remoteActorPublicKeyCache = {};
    // Start keys-container and public-keys-container services.
    this.broker.createService(KeyContainerService, {
      podProvider: this.settings.podProvider
    });
    this.broker.createService(PublicKeyContainerService, {
      podProvider: this.settings.podProvider
    });
  },
  actions: {
    /**
     * If the keyId is given, returns the corresponding key object.
     * Otherwise, the first available key of the given `keyType` in the `/key` container.
     * If none is available in the `/key` container, it will be created first,
     * using `createKeyForWebId`, which attaches the key to the webId and `/public-key`
     * container.
     */
    getOrCreate: {
      params: {
        keyType: { type: 'string', optional: true },
        keyId: { type: 'string', optional: true },
        publishIfNotPresent: { type: 'boolean', default: true },
        attachToWebIdIfNotPresent: { type: 'boolean', default: true }
      },
      async handler(ctx) {
        const { keyType, keyId, publishIfNotPresent, attachToWebIdIfNotPresent } = ctx.params;

        if (keyId) {
          return await ctx.call('keys.container.get', { resourceUri: keyId, accept: MIME_TYPES.JSON });
        }

        // Key ID not given, search key by key type.
        const container = await ctx.call('keys.container.get');

        // Check if key type is present.
        const key = container['ldp:contains'].find(keyResource => {
          return asArray(keyResource['@type']).includes(keyType);
        });
        if (key) {
          return key;
        }

        // If key no key present for type, create it.
        const newKey = await this.actions.createKeyForWebId(
          {
            keyType,
            webId: ctx.webId || ctx.parentCtx.webId || ctx.meta.webId,
            publish: publishIfNotPresent,
            attachToWebId: attachToWebIdIfNotPresent
          },
          { parentCtx: ctx }
        );
        return newKey;
      }
    },

    /** Returns a signing key instance for a given key or key type. If no key is available, a new one is created. */
    async getSigningKey(ctx) {
      const { keyId, keyType } = ctx.params;
      const keyObject = await ctx.call('keys.getOrCreate', { keyType, keyId });

      if (!asArray(keyObject.type).includes(KEY_TYPES.ED25519)) {
        throw new Error('Only ED25519 keys are supported by this action.');
      }
      return Ed25519Multikey.from(keyObject);
    },

    /**
     * Generates key, stores it in the `/key` container.
     * If `attachToWebId` is true (default), it will also attach the key to the webId document.
     * If `publishKey` is true (default), it will also publish the key in the `/public-key` container.
     */
    createKeyForWebId: {
      params: {
        webId: { type: 'string' },
        keyType: { type: 'string' },
        attachToWebId: { type: 'boolean', default: true },
        publishKey: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { webId, keyType, attachToWebId, publishKey } = ctx.params;

        const key = await this.actions.generateKey({ keyType }, { parentCtx: ctx });

        const { newData: resource } = await ctx.call('keys.container.post', {
          resource: { ...key, 'https://w3id.org/security#owner': webId, 'https://w3id.org/security#controller': webId },
          contentType: MIME_TYPES.JSON
        });

        if (attachToWebId) {
          await this.actions.attachPublicKeyToWebId({ webId, keyObject: resource }, { parentCtx: ctx });
        }
        if (publishKey) {
          await this.actions.publishPublicKeyLocally({ keyObject: resource, keyId: resource.id }, { parentCtx: ctx });
        }

        return resource;
      }
    },

    /**
     * Generate a key of the type specified.
     * Type must be in the form of a {@link KEY_TYPES} URI.
     */
    async generateKey(ctx) {
      const { keyType } = ctx.params;
      const keyTypes = Object.values(KEY_TYPES);
      if (!keyTypes.includes(keyType)) {
        throw new Error(`Unsupported key type ${keyType}. Must either be of ${JSON.stringify(keyTypes)}.`);
      }
      if (keyType === KEY_TYPES.ED25519) {
        return await this.actions.generateEd25519Key();
      }
      if (keyType === KEY_TYPES.RSA) {
        return await this.actions.generateRsaKey();
      }
      /** @type {never} Not implemented yet. */
      throw new Error('Key type not implemented yet.');
    },

    /**
     * Creates ed25519 key pair.
     * @returns {object} Key pair in [MultiKey format](https://www.w3.org/TR/vc-data-integrity/#multikey).
     */
    async generateEd25519Key() {
      const keyPair = await Ed25519Multikey.generate();

      return keyPair.export({ publicKey: true, secretKey: true });
    },

    /**
     * Creates a rsa key pair and returns public and private key in spki pkcs8 PEM encodings, respectively.
     * @returns {object} in the format of:
     * ```js
     *  { 'https://w3id.org/security#publicKeyPem': publicKeySpkiPemString,
     *    'https://w3id.org/security#privateKeyPem': privateKeyPkcs8PemString }
     *  ```
     */
    async generateRsaKey(ctx) {
      return new Promise((resolve, reject) => {
        generateKeyPair(
          'rsa',
          {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem'
            }
          },
          (err, publicKey, privateKey) => {
            if (!err) {
              resolve({
                'https://w3id.org/security#publicKeyPem': publicKey,
                'https://w3id.org/security#privateKeyPem': privateKey
              });
            } else {
              reject(err);
            }
          }
        );
      });
    },

    /**
     * Attaches a given key to the webId document.
     * @param {*} ctx Context.
     * @param {string} ctx.webId The WebId.
     * @param {string} ctx.keyId The key id.
     */
    async attachPublicKeyToWebId(ctx) {
      const { webId } = ctx.params;
      const keyId = ctx.params.keyId || ctx.params.keyObject.id;
      const keyObject =
        ctx.keyObject || (await ctx.call('keys.container.get', { resourceUri: keyId, accept: MIME_TYPES.JSON }));

      // The rdfs:seeAlso points to the public key resource.
      let publicKeyId = keyObject['rdfs:seeAlso'];
      // Ensure the key is published.
      if (!publicKeyId) {
        const publicKeyObject = await this.actions.publishPublicKeyLocally({ keyObject }, { parentCtx: ctx });
        publicKeyId = publicKeyObject.id;
      }

      // Ensure the same public key is not attached, by detaching it first.
      this.actions.detachFromWebId({ webId, publicKeyId }, { parentCtx: ctx });

      // Add public key triples to webid document.
      await ctx.call('ldp.resource.patch', {
        resourceUri: webId,
        triplesToAdd: [
          triple(namedNode(webId), namedNode('https://w3id.org/security#publicKey'), namedNode(publicKeyId))
        ]
      });
    },

    /** Given a key object, remove the key from the webId document. */
    async detachFromWebId(ctx) {
      const webId = ctx.params.webId || ctx.meta.webId;
      const { publicKeyId } = ctx.params;

      await ctx.call('ldp.resource.patch', {
        resourceUri: webId,
        triplesToRemove: [
          triple(namedNode(webId), namedNode('https://w3id.org/security#publicKey'), namedNode(publicKeyId))
        ]
      });
    },

    /** Given a local key (stored in `/key`), add the public key part to the `/public-key` container. */
    async publishPublicKeyLocally(ctx) {
      const keyId = ctx.params.keyId || ctx.params.keyObject.id;
      const keyObject =
        ctx.keyObject || (await ctx.call('keys.container.get', { resourceUri: keyId, accept: MIME_TYPES.JSON }));

      // First, get the public key part.
      const publicKeyObject = await this.actions.getPublicKeyObject(keyObject, { parentCtx: ctx });

      // Then, store it in the `/public-key` container (use same slug).
      const { newData: publicKeyResource } = await ctx.call('keys.public-container.post', {
        resource: publicKeyObject,
        slug: getSlugFromUri(keyId),
        contentType: MIME_TYPES.JSON
      });

      // Then, add a `rdfs:seeAlso` reference in the `/key` container.
      await ctx.call('ldp.resource.patch', {
        resourceUri: keyId,
        triplesToAdd: [
          triple(
            namedNode(keyId),
            namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
            namedNode(publicKeyResource.id)
          )
        ]
      });
      return publicKeyResource;
    },

    /**
     * Removes key from `key` container and detaches it from webId document and `public-key` container.
     */
    async delete(ctx) {
      const keyId = ctx.params.keyId || ctx.params.keyObject.id;
      const keyObject =
        ctx.keyObject || (await ctx.call('keys.container.get', { resourceUri: keyId, accept: MIME_TYPES.JSON }));

      const webId = ctx.params.webId || ctx.meta.webId;
      await ctx.call('ldp.resource.delete', { resourceUri: keyId });
      // Delete corresponding public key in the `public-key` container, if present.
      if (keyObject.seeAlso) {
        await ctx.call('ldp.resource.delete', { resourceUri: keyObject['rdfs:seeAlso'] });
      }
      const publicKeyId = keyObject['rdfs:seeAlso'];
      if (publicKeyId) {
        await this.actions.detachFromWebId({ webId, publicKeyId }, { parentCtx: ctx });
      }
    },

    getRemotePublicKeys: {
      params: {
        actorUri: { type: 'string' },
        type: { type: 'string', optional: true, default: KEY_TYPES.RSA, nullable: true }
      },
      async handler(ctx) {
        const { actorUri, keyType } = ctx.params;

        /** @type {object[]} */
        let keyObjects = this.remoteActorPublicKeyCache[actorUri];
        if (!keyObjects) {
          const response = await fetch(actorUri, { headers: { Accept: 'application/json' } });
          if (!response.ok) return false;

          const actor = await response.json();
          keyObjects = asArray(actor.publicKey);
          if (!actor || !actor.publicKey) return false;
          this.remoteActorPublicKeyCache[actorUri] = keyObjects;
        }

        if (!keyType) {
          return keyObjects.filter(key => key.type === keyType);
        }
        return keyObjects;
      }
    },

    /**
     * Returns the public key of the `keyObject` param specified.
     */
    async getPublicKeyObject(ctx) {
      const keyId = ctx.params.keyId || ctx.params.keyObject.id;
      const keyObject =
        ctx.keyObject || (await ctx.call('keys.container.get', { resourceUri: keyId, accept: MIME_TYPES.JSON }));

      if (asArray(keyObject.type).includes(KEY_TYPES.ED25519)) {
        const keyPair = Ed25519Multikey.from(keyObject);
        return await keyPair.export({ publicKey: true, secretKey: false });
      }
      if (asArray(keyObject.type).includes(KEY_TYPES.RSA)) {
        // TODO: check, if the keyObject's keys are actually correct.
        return {
          'https://w3id.org/security#owner': keyObject.owner,
          'https://w3id.org/security#publicKeyPem': keyObject.publicKeyPem
        };
      }

      /** @type {never} Not implemented yet. */
      throw new Error('Key type not implemented yet.');
    }
  },
  methods: {},
  events: {
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;
      await this.actions.createKeyForWebId({ webId, keyType: KEY_TYPES.RSA }, { parentCtx: ctx });
      await this.actions.createKeyForWebId({ webId, keyType: KEY_TYPES.ED25519 }, { parentCtx: ctx });
    }
  }
};

module.exports = KeyService;
