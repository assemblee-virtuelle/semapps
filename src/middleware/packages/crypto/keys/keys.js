const fetch = require('node-fetch');
const { generateKeyPair } = require('crypto');
const { namedNode, triple } = require('@rdfjs/data-model');
const { MIME_TYPES } = require('@semapps/mime-types');
const { sec } = require('@semapps/ontologies');
const { arrayOf } = require('../utils');
const KEY_TYPES = require('./keyTypes');
const KeyContainerService = require('./key-container');
const PublicKeyContainerService = require('./public-key-container');
const MigrationService = require('./migration');
const { KeyPairService } = require('../signature');

/** @type {import('@digitalbazaar/ed25519-multikey')} */
let Ed25519Multikey;
(async () => {
  Ed25519Multikey = await import('@digitalbazaar/ed25519-multikey');
})();

/**
 * Service for managing keys (creating, storing, retrieving).
 *
 * Note:
 * Unfortunately, the [data integrity spec](https://www.w3.org/TR/vc-data-integrity/#multikey)
 * and digital bazaar library require their (ed25519) keys to be in MultiKey format.
 * We can't store the RSA key in that format, since it is (1) not specified and (2) required in
 * that format by ActivityPub. Therefore, we use two different key store formats here...
 *
 * If key access times become an issue some time, we can create custom queries.
 * @type {import('moleculer').ServiceSchema}
 */
const KeysService = {
  name: 'keys',
  settings: {
    podProvider: false,
    actorsKeyPairsDir: null
  },
  dependencies: ['ontologies', 'keys.container', 'keys.public-container', 'signature.keypair', 'keys.migration'],
  async created() {
    // Start keys-container and public-keys-container services.
    this.broker.createService({
      mixins: [KeyContainerService],
      settings: {
        podProvider: this.settings.podProvider
      }
    });
    this.broker.createService({
      mixins: [PublicKeyContainerService],
      settings: {
        podProvider: this.settings.podProvider
      }
    });
    this.broker.createService({
      mixins: [MigrationService],
      settings: {
        podProvider: this.settings.podProvider,
        actorsKeyPairsDir: this.settings.actorsKeyPairsDir
      }
    });

    // Legacy service.
    this.broker.createService({
      mixins: [KeyPairService],
      settings: {
        actorsKeyPairsDir: this.settings.actorsKeyPairsDir
      }
    });
  },
  async started() {
    await this.waitForServices('ontologies');
    this.broker.call('ontologies.register', sec);

    await this.waitForServices('keys.migration');
    this.isMigrated = await this.broker.call('keys.migration.isMigrated');
  },
  actions: {
    /**
     * Returns all available keys of the given `keyType` in the `/key` container.
     * If none is available `[]` is returned.
     */
    getByType: {
      params: {
        keyType: { type: 'string' },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { keyType } = ctx.params;
        const webId = ctx.params.webId || ctx.meta.webId;

        // Get the key container, to search by type.
        const container = await ctx.call('keys.container.list', {
          webId,
          accept: MIME_TYPES.JSON
        });

        // Check if key type is present.
        const matchedKeys = container['ldp:contains'].filter(
          keyResource =>
            arrayOf(keyResource.type || keyResource['@type']).includes(keyType) && keyResource.controller === webId
        );

        return matchedKeys;
      }
    },
    /**
     * Gets the keys by type that are present in the actor's webId.
     * If none for the type is present, a new one is created and returned.
     * TODO: If this becomes a performance bottleneck, we can use SPARQL queries.
     * @returns An array of keys present in the webId.
     */
    getOrCreateWebIdKeys: {
      params: {
        keyType: { type: 'string' },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { keyType } = ctx.params;
        const webId = ctx.params.webId || ctx.meta.webId;
        const webIdDoc = await ctx.call('webid.get', { resourceUri: webId, accept: MIME_TYPES.JSON, webId });

        // RSA keys are stored in `publicKey` field, everything else in `assertionMethod`
        const publicKeys =
          keyType === KEY_TYPES.RSA
            ? arrayOf(webIdDoc.publicKey)
            : arrayOf(webIdDoc.assertionMethod).filter(key => (key.type || key['@type']) === keyType);

        if (publicKeys.length === 0) {
          // No keys found, we create a new one.
          const newKey = await this.actions.createKeyForActor(
            { webId, attachToWebId: true, keyType },
            { parentCtx: ctx }
          );
          return [newKey];
        }

        // Get all private keys for the public keys in the webId.
        return await Promise.all(
          publicKeys.map(async key => {
            const publicKeyId = key.id || key['@id'];
            return await ctx.call('keys.container.get', {
              resourceUri: await this.actions.findPrivateKeyUri({ publicKeyUri: publicKeyId }, { parentCtx: ctx }),
              accept: MIME_TYPES.JSON,
              webId
            });
          })
        );
      }
    },
    /**
     * Returns a signing key instance for a given key or key type. If no key is available, a new one is created.
     * Currently supports Ed25519Multikey only.
     * @returns {Ed25519Multikey} The signing key instance.
     */
    getSigningMultikeyInstance: {
      params: {
        keyObject: { type: 'object', optional: true },
        keyId: { type: 'string', optional: true },
        keyType: { type: 'string', default: KEY_TYPES.ED25519 },
        webId: { type: 'string', optional: true },
        /** Add the secret key to the key object, if not set (or the public key id is provided), it will be removed. */
        withPrivateKey: { type: 'boolean', default: false }
      },
      async handler(ctx) {
        const { keyId, keyType, withPrivateKey } = ctx.params;
        const webId = ctx.params.webId || ctx.meta.webId;

        // Get key from parameters, id (URI) or the one associated with the webId (in that priority).
        // Note: Key purposes are not regarded, as they are currently not used.
        const keyObject =
          ctx.params.keyObject || keyId
            ? await ctx.call('keys.container.get', { resourceUri: keyId, webId, accept: MIME_TYPES.JSON })
            : (await ctx.call('keys.getOrCreateWebIdKeys', { webId, keyType }))[0];

        // We support ed25519 only.
        if (!arrayOf(keyObject.type || keyObject['@type']).includes(KEY_TYPES.ED25519)) {
          throw new Error('Only ED25519 keys are supported by this action.');
        }

        // We need the key object to have the public key's id, so it is resolvable.
        // So if the key object is the secret key object, replace the id.
        if (keyObject.secretKeyMultibase) {
          keyObject.id = keyObject['rdfs:seeAlso'];
          delete keyObject['rdfs:seeAlso'];
        }

        // Remove secret key, unless explicitly wanted.
        if (!withPrivateKey) {
          delete keyObject.secretKeyMultibase;
        }

        // The library requires the key to have the type field set to `Multikey` only.
        return await Ed25519Multikey.from({ ...keyObject, type: 'Multikey' });
      }
    },

    /**
     * Generates key, stores it in the `/key` container.
     * If `publishKey` is true (default), it will publish the public key in the `/public-key` container.
     * If `attachToWebId` is true (not default), it will publish the key and attach the key to the webId document.
     * @returns {object} The key resource as located in the `/key` container.
     */
    createKeyForActor: {
      params: {
        webId: { type: 'string' },
        keyType: { type: 'string' },
        attachToWebId: { type: 'boolean', default: false },
        publishKey: { type: 'boolean', default: true }
      },
      async handler(ctx) {
        const { webId, keyType, attachToWebId, publishKey } = ctx.params;

        const generatedKey = await this.actions.generateKey({ keyType }, { parentCtx: ctx });

        const keyObject = {
          ...generatedKey,
          owner: webId,
          controller: webId
        };
        const keyUri = await ctx.call('keys.container.post', {
          webId,
          resource: keyObject,
          contentType: MIME_TYPES.JSON
        });
        keyObject.id = keyUri;

        if (publishKey || attachToWebId) {
          const publicKeyUri = await this.actions.publishPublicKeyLocally(
            { keyObject: keyObject, keyId: keyObject.id, webId },
            { parentCtx: ctx }
          );
          // `rdfs:seeAlso` is added to the private key above. Instead of refetching, we manually update the object.
          keyObject['rdfs:seeAlso'] = publicKeyUri;

          if (attachToWebId) {
            await this.actions.attachPublicKeyToWebId({ webId, keyObject: keyObject }, { parentCtx: ctx });
          }
        }

        return keyObject;
      }
    },

    /**
     * Generate a key of the type specified.
     * Type must be in the form of a {@link KEY_TYPES} URI.
     */
    generateKey: {
      params: {
        keyType: { type: 'string' }
      },
      async handler(ctx) {
        const { keyType } = ctx.params;

        if (keyType === KEY_TYPES.ED25519) {
          return await this.actions.generateEd25519Key();
        }
        if (keyType === KEY_TYPES.RSA) {
          return await this.actions.generateRsaKey();
        }

        throw new Error('Key type not supported.');
      }
    },

    /**
     * Generate ED25519 key pair.
     * @returns {object} Key pair in [MultiKey format](https://www.w3.org/TR/controller-document/#Multikey).
     */
    generateEd25519Key: {
      params: {},
      async handler() {
        const keyPair = await Ed25519Multikey.generate();
        const keyObject = await keyPair.export({ publicKey: true, secretKey: true });
        // The id field is set to `undefined` which can cause issues with the ld parser.
        delete keyObject.id;
        // We need the default context instead, for adding other fields.
        delete keyObject['@context'];
        // Set additional types which we require to find them easily by type in the db.
        delete keyObject.type;
        keyObject['@type'] = [KEY_TYPES.ED25519, KEY_TYPES.MULTI_KEY, KEY_TYPES.VERIFICATION_METHOD];
        return keyObject;
      }
    },

    /**
     * Generate a RSA key pair and returns public and private key in spki pkcs8 PEM encodings, respectively.
     * @returns {object} in the format of:
     * ```js
     *  { '@type': [KEY_TYPES.RSA, KEY_TYPES.VERIFICATION_METHOD],
     *    'publicKeyPem': publicKeySpkiPemString,
     *    'privateKeyPem': privateKeyPkcs8PemString }
     *  ```
     */
    generateRsaKey: {
      params: {},
      async handler() {
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
                  '@type': [KEY_TYPES.RSA, KEY_TYPES.VERIFICATION_METHOD],
                  publicKeyPem: publicKey,
                  privateKeyPem: privateKey
                });
              } else {
                reject(err);
              }
            }
          );
        });
      }
    },
    /**
     * Attaches a given key to the webId document.
     * If the key is not published yet, it will be published in the `/public-keys` container.
     * If the key is a RSA key and another RSA key is attached already, the old one will be replaced.
     * @param {*} ctx Context.
     * @param {string} ctx.webId The WebId.
     * @param {string} ctx.keyId The id of the public-private key pair resource.
     * @param {string} ctx.keyObject Alternatively, the public-private key pair resource itself.
     */
    attachPublicKeyToWebId: {
      params: {
        webId: { type: 'string' },
        keyId: { type: 'string', optional: true },
        keyObject: { type: 'object', optional: true }
      },
      async handler(ctx) {
        const { webId } = ctx.params;
        const keyId = ctx.params.keyId || ctx.params.keyObject?.id || ctx.params.keyObject?.['@id'];
        if (!keyId) throw new Error('Either keyId or keyObject with id must be given.');

        const keyObject =
          ctx.params.keyObject ||
          (await ctx.call('keys.container.get', { resourceUri: keyId, accept: MIME_TYPES.JSON, webId }));

        const isRsaKey = arrayOf(keyObject.type || keyObject['@type']).includes(KEY_TYPES.RSA);

        // The rdfs:seeAlso points to the public key resource. If it doesn't exist, publish it.
        const publicKeyId = keyObject['rdfs:seeAlso']
          ? keyObject['rdfs:seeAlso']
          : await this.actions.publishPublicKeyLocally({ keyObject, webId }, { parentCtx: ctx });

        const webIdDocument = await ctx.call('webid.get', {
          resourceUri: webId,
          accept: MIME_TYPES.JSON,
          webId: webId
        });
        // Ensure the same public key is not attached already.
        if (
          arrayOf(webIdDocument.publicKey)
            .concat(arrayOf(webIdDocument.assertionMethod))
            .find(key => (key.id || key['@id']) === publicKeyId)
        ) {
          // Key is already attached, nothing to do.
          return;
        }

        // For RSA keys, there must not be more than one key in the webId (this might break compatibility with APub implementations).
        // Therefore, remove the current key from the webId, if present.
        if (isRsaKey && webIdDocument.publicKey) {
          await this.actions.detachFromWebId(
            { webId, publicKeyId: webIdDocument.publicKey.id || webIdDocument.publicKey['@id'] },
            { parentCtx: ctx }
          );
        }

        // RSA keys are stored in the publicKey field, new / other keys are stored in the assertionMethod field.
        const keyPredicate = isRsaKey
          ? 'https://w3id.org/security#publicKey'
          : 'https://w3id.org/security#assertionMethod';

        // Add public key triples to webId document.
        await ctx.call('ldp.resource.patch', {
          resourceUri: webId,
          triplesToAdd: [triple(namedNode(webId), namedNode(keyPredicate), namedNode(publicKeyId))],
          webId
        });
      }
    },

    /** Given a key object, remove the key from the webId document. */
    detachFromWebId: {
      params: {
        webId: { type: 'string' },
        publicKeyId: { type: 'string' }
      },
      async handler(ctx) {
        const { publicKeyId, webId } = ctx.params;

        await ctx.call('ldp.resource.patch', {
          resourceUri: webId,
          triplesToRemove: [
            // The key may be stored in publicKey or assertionMethod field, depending on key type.
            triple(namedNode(webId), namedNode('https://w3id.org/security#publicKey'), namedNode(publicKeyId)),
            triple(namedNode(webId), namedNode('https://w3id.org/security#assertionMethod'), namedNode(publicKeyId))
          ],
          webId
        });
      }
    },

    /** Given a local key (stored in `/key`), add the public key part to the `/public-key` container. */
    publishPublicKeyLocally: {
      params: {
        keyId: { type: 'string', optional: true },
        keyObject: { type: 'object', optional: true },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        const privateKeyUri = ctx.params.keyId || ctx.params.keyObject?.id || ctx.params.keyObject?.['@id'];
        const keyObject =
          ctx.params.keyObject ||
          (await ctx.call('keys.container.get', { resourceUri: privateKeyUri, accept: MIME_TYPES.JSON }));

        // First, get the public key part.
        const publicKeyObject = await this.actions.getPublicKeyObject({ keyObject }, { parentCtx: ctx });

        // Then, store it in the `/public-key` container.
        const publicKeyUri = await ctx.call('keys.public-container.post', {
          resource: publicKeyObject,
          contentType: MIME_TYPES.JSON,
          webId: webId
        });

        // Then, add a `rdfs:seeAlso` reference in the `/key` container.
        await ctx.call('ldp.resource.patch', {
          resourceUri: privateKeyUri,
          triplesToAdd: [
            triple(
              namedNode(privateKeyUri),
              namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
              namedNode(publicKeyUri)
            )
          ],
          webId
        });
        return publicKeyUri;
      }
    },

    /**
     * Removes key from `key` container and detaches it from webId document and `public-key` container.
     */
    delete: {
      params: {
        resourceUri: { type: 'string', optional: true },
        keyObject: { type: 'object', optional: true },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const resourceUri = ctx.params.resourceUri || ctx.params.keyObject?.id || ctx.params.keyObject?.['@id'];
        const webId = ctx.params.webId || ctx.meta.webId;
        const keyObject =
          ctx.params.keyObject ||
          (await ctx.call('keys.container.get', { resourceUri, accept: MIME_TYPES.JSON, webId }));

        await ctx.call('keys.container.delete', { resourceUri, webId });
        // Delete corresponding public key in the `public-key` container, if present.
        if (keyObject['rdfs:seeAlso']) {
          // Don't call `keys.public-container.delete`
          // because that will try to delete the private key reference (which we deleted already).
          await ctx.call('ldp.resource.delete', { resourceUri: keyObject['rdfs:seeAlso'], webId });
        }
        const publicKeyId = keyObject['rdfs:seeAlso'];
        if (publicKeyId) {
          // Try to detach from webId. Will have no effect, if not attached.
          await this.actions.detachFromWebId({ webId, publicKeyId }, { parentCtx: ctx });
        }
      }
    },

    /**
     * Fetches remote keys from a webId (publicKey or assertionMethod field).
     * Returns all keys of the given `keyType` or all, if `keyType` is `null`.
     * Does not filter outdated keys.
     */
    getRemotePublicKeys: {
      params: {
        webId: { type: 'string' },
        keyType: { type: 'string', optional: true, default: KEY_TYPES.RSA, nullable: true }
      },
      async handler(ctx) {
        const { webId, keyType } = ctx.params;

        let response = await fetch(webId, { headers: { Accept: 'application/json' } });
        if (!response.ok) return false;
        const actor = await response.json();

        let keyObjects = arrayOf(actor?.publicKey).concat(arrayOf(actor?.assertionMethod));

        // Dereference keys if necessary
        keyObjects = await Promise.all(
          keyObjects.map(async k => {
            if (typeof k === 'string') {
              response = await fetch(k, { headers: { Accept: 'application/json' } });
              if (!response.ok) return false;
              const dereferencedKey = await response.json();
              if (!dereferencedKey) return false;
              return dereferencedKey;
            } else {
              return k;
            }
          })
        );

        // Remove keys which could not be dereferenced
        keyObjects = keyObjects.filter(k => k !== false);

        if (keyType) {
          if (keyType === KEY_TYPES.RSA) {
            // RSA keys might not have a type field, so we filter them manually.
            return keyObjects.filter(key => {
              const types = arrayOf(key.type || key['@type']);
              return types.length === 0 || types.includes(KEY_TYPES.RSA);
            });
          } else {
            return keyObjects.filter(key => arrayOf(key.type || key['@type']).includes(keyType));
          }
        }

        return keyObjects;
      }
    },

    /**
     * Returns the public key part of a given `keyObject`.
     */
    getPublicKeyObject: {
      params: {
        keyObject: { type: 'object', optional: true },
        keyId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const keyId = ctx.params.keyId || ctx.params.keyObject?.id || ctx.params.keyObject?.['@id'];
        const keyObject =
          ctx.params.keyObject ||
          (await ctx.call('keys.container.get', { resourceUri: keyId, accept: MIME_TYPES.JSON }));

        const keyType = keyObject['@type'] || keyObject.type;

        if (arrayOf(keyType).includes(KEY_TYPES.ED25519)) {
          return {
            '@type': [KEY_TYPES.ED25519, KEY_TYPES.MULTI_KEY, KEY_TYPES.VERIFICATION_METHOD],
            // Attach ID of public key
            id: keyObject.secretKeyMultibase ? keyObject['rdfs:seeAlso'] : keyId,
            controller: keyObject.controller,
            expires: keyObject.expires,
            owner: keyObject.owner,
            publicKeyMultibase: keyObject.publicKeyMultibase,
            revoked: keyObject.revoked
          };
        }

        if (arrayOf(keyType).includes(KEY_TYPES.RSA)) {
          return {
            '@type': keyType,
            // Attach ID of public key
            id: keyObject.privateKeyPem ? keyObject['rdfs:seeAlso'] : keyId,
            owner: keyObject.owner,
            controller: keyObject.owner,
            publicKeyPem: keyObject.publicKeyPem
          };
        }

        /** @type {never} Not implemented yet. */
        throw new Error(`Key type ${keyType} not supported.`);
      }
    },

    findPrivateKeyUri: {
      params: {
        publicKeyUri: { type: 'string' }
      },
      async handler(ctx) {
        const { publicKeyUri } = ctx.params;

        const queryResult = await ctx.call('triplestore.query', {
          query: `
          SELECT ?privateKey WHERE {
            ?privateKey <http://www.w3.org/2000/01/rdf-schema#seeAlso> <${publicKeyUri}> .
          }`,
          // dataset: undefined,
          webId: 'system'
        });

        return queryResult[0]?.privateKey?.value;
      }
    }
  },
  methods: {},
  hooks: {
    before: {
      '*': function checkMigration(ctx) {
        if (!this.isMigrated && !ctx.meta.skipMigrationCheck) {
          throw new Error(
            'The keys were not migrated to db storage yet. Please run `keys.migration.migrateKeysToDb` and use the deprecated `signature.keypair` service for now.'
          );
        }
      }
    }
  },
  events: {
    async 'keys.migration.migrated'() {
      this.isMigrated = true;
    },
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;

      if (!this.isMigrated) {
        // Key creation will be handled by legacy service.
        return;
      }

      // Wait for the key containers to be created.
      const keyContainerUri = await ctx.call('keys.container.getContainerUri', { webId }, { parentCtx: ctx });
      const publicKeyContainerUri = await ctx.call(
        'keys.public-container.getContainerUri',
        { webId },
        { parentCtx: ctx }
      );
      await ctx.call('keys.container.waitForContainerCreation', { containerUri: keyContainerUri }, { parentCtx: ctx });
      await ctx.call(
        'keys.container.waitForContainerCreation',
        { containerUri: publicKeyContainerUri },
        { parentCtx: ctx }
      );

      // Create, publish and attach keys to the webId.
      await Promise.all([
        this.actions.createKeyForActor({ webId, attachToWebId: true, keyType: KEY_TYPES.RSA }, { parentCtx: ctx }),
        this.actions.createKeyForActor({ webId, attachToWebId: true, keyType: KEY_TYPES.ED25519 }, { parentCtx: ctx })
      ]);
    }
  }
};

module.exports = KeysService;
