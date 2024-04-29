const fetch = require('node-fetch');
const { generateKeyPair } = require('crypto');
const { namedNode, triple } = require('@rdfjs/data-model');
const { MIME_TYPES } = require('@semapps/mime-types');
const Ed25519Multikey = require('@digitalbazaar/ed25519-multikey');
const { getSlugFromUri } = require('@semapps/ldp');
const { sec } = require('@semapps/ontologies');
const { asArray } = require('../utils');
const KEY_TYPES = require('./keyTypes');
const KeyContainerService = require('./keys-container');
const PublicKeyContainerService = require('./public-keys-container');
const MigrationService = require('./migration-service');
const { KeyPairService } = require('../signature');

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
const KeyService = {
  name: 'keys',
  settings: {
    podProvider: false,
    settingsDataset: 'settings',
    actorsKeyPairsDir: null
  },
  dependencies: ['ontologies'],
  async created() {
    // Start keys-container and public-keys-container services.
    this.broker.createService(KeyContainerService, {
      settings: {
        podProvider: this.settings.podProvider
      }
    });
    this.broker.createService(PublicKeyContainerService, {
      settings: {
        podProvider: this.settings.podProvider
      }
    });
    this.broker.createService(MigrationService, {
      settings: {
        podProvider: this.settings.podProvider,
        actorsKeyPairsDir: this.settings.actorsKeyPairsDir
      }
    });

    this.broker.createService(KeyPairService, {
      settings: {
        actorsKeyPairsDir: this.settings.actorsKeyPairsDir
      }
    });

    this.remoteActorPublicKeyCache = {};

    await this.waitForServices('keys.migration');
    this.isMigrated = await this.broker.call('keys.migration.isMigrated');
  },
  async started() {
    this.broker.call('ontologies.register', {
      ...sec,
      overwrite: true
    });
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
          webId: 'system',
          accept: MIME_TYPES.JSON
        });

        // Check if key type is present.
        const matchedKeys = container['ldp:contains'].filter(
          keyResource =>
            asArray(keyResource.type || keyResource['@type']).includes(keyType) && keyResource.controller === webId
        );

        if (matchedKeys.length === 0) {
          // No key found.
          return [];
        }
        // We query the resources again, to ensure the user is authorized.
        const returnedKeys = await Promise.all(
          matchedKeys.map(key =>
            ctx.call('keys.container.get', {
              resourceUri: key.id || key['@id'],
              webId,
              accept: MIME_TYPES.JSON
            })
          )
        );
        return returnedKeys;
      }
    },
    /**
     * Get's the keys by type that are present in the actor's webId.
     * If none for the type is present, a new one is created and returned.
     * TODO: If this becomes a performance bottleneck, we can use SPARQL queries.
     * @returns An array of keys present in the webId.
     */
    getWebIdKeys: {
      params: {
        keyType: { type: 'string' },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { keyType } = ctx.params;
        const webId = ctx.params.webId || ctx.meta.webId;
        const webIdDoc = await ctx.call('webid.get', { resourceUri: webId, accept: MIME_TYPES.JSON, webId });

        let keys;
        if (keyType === KEY_TYPES.RSA) {
          keys = asArray(webIdDoc.publicKey);
        } else {
          keys = asArray(webIdDoc.assertionMethod).filter(key => (key.type || key['@type']) === keyType);
        }

        if (keys.length > 0) {
          // Fetch all private keys.
          return await Promise.all(
            keys.map(key => {
              const publicKeyId = key.id || key['@id'];
              return ctx.call('keys.container.get', {
                resourceUri: publicKeyId.replace('/public-key/', '/key/'),
                accept: MIME_TYPES.JSON,
                webId
              });
            })
          );
        }

        // No keys found, we create a new one.
        const newKey = await this.actions.createKeyForActor({ webId, attachToWebId: true, keyType });
        return [newKey];
      }
    },
    /**
     * Returns a signing key instance for a given key or key type. If no key is available, a new one is created.
     * Currently supports Ed25519Multikey only.
     * @returns {Ed25519Multikey} The signing key instance.
     */
    getSigningMultikeyInstance: {
      params: {
        keyId: { type: 'string', optional: true },
        keyType: { type: 'string', default: KEY_TYPES.ED25519 },
        keyObject: { type: 'object', optional: true },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { keyId, keyType } = ctx.params;
        const webId = ctx.params.webId || ctx.meta.webId;
        const keyObject =
          ctx.params.keyObject || keyId
            ? await ctx.call('keys.container.get', { resourceUri: keyId, webId, accept: MIME_TYPES.JSON })
            : (await ctx.call('keys.getWebIdKeys', { webId, keyType }))[0];

        if (!asArray(keyObject.type || keyObject['@type']).includes(KEY_TYPES.ED25519)) {
          throw new Error('Only ED25519 keys are supported by this action.');
        }
        // The library required the key to have type Multikey only.
        return await Ed25519Multikey.from({ keyObject, type: 'Multikey' });
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
          //  The field `rdfs:seeAlso` was added to the resource above. Instead of refetching, we manually update the object.
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

        throw new Error('Key type not implemented.');
      }
    },

    /**
     * Generate ed25519 key pair.
     * @returns {object} Key pair in [MultiKey format](https://www.w3.org/TR/vc-data-integrity/#multikey).
     */
    generateEd25519Key: {
      params: {},
      async handler() {
        const keyPair = await Ed25519Multikey.generate();
        const keyObject = await keyPair.export({ publicKey: true, secretKey: true });
        // The id field is set to `undefined` which can cause issues with the ld parser.
        delete keyObject.id;
        // The default context is more flexible in adding more fields to the object.
        delete keyObject['@context'];
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

        const isRsaKey = asArray(keyObject.type || keyObject['@type']).includes(KEY_TYPES.RSA);

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
          asArray(webIdDocument.publicKey)
            .concat(asArray(webIdDocument.assertionMethod))
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

        // Then, store it in the `/public-key` container (use same slug).
        const publicKeyUri = await ctx.call('keys.public-container.post', {
          resource: publicKeyObject,
          slug: getSlugFromUri(privateKeyUri),
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
        keyId: { type: 'string', optional: true },
        keyObject: { type: 'object', optional: true },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const keyId = ctx.params.keyId || ctx.params.keyObject?.id || ctx.params.keyObject?.['@id'];
        const webId = ctx.params.webId || ctx.meta.webId;
        const keyObject = await ctx.call('keys.container.get', { resourceUri: keyId, accept: MIME_TYPES.JSON, webId });

        await ctx.call('keys.container.delete', { resourceUri: keyId, webId });
        // Delete corresponding public key in the `public-key` container, if present.
        if (keyObject['rdfs:seeAlso']) {
          // Don't call `keys.public-container.delete`
          // because that will try to delete the private key reference (which we deleted all together).
          await ctx.call('ldp.resource.delete', { resourceUri: keyObject['rdfs:seeAlso'], webId });
        }
        const publicKeyId = keyObject['rdfs:seeAlso'];
        if (publicKeyId) {
          await this.actions.detachFromWebId({ webId, publicKeyId }, { parentCtx: ctx });
        }
      }
    },

    getRemotePublicKeys: {
      params: {
        webId: { type: 'string' },
        keyType: { type: 'string', optional: true, default: KEY_TYPES.RSA, nullable: true },
        forceRefetch: { type: 'boolean', default: false }
      },
      async handler(ctx) {
        const { actorUri, keyType, forceRefetch } = ctx.params;

        // TODO, disregard keys that are expired (Multibase key expires)

        /** @type {object[]} */
        let keyObjects = this.remoteActorPublicKeyCache[actorUri];
        if (!keyObjects || forceRefetch) {
          const response = await fetch(actorUri, { headers: { Accept: 'application/json' } });
          if (!response.ok) return false;

          const actor = await response.json();
          if (!actor || !actor.publicKey) return false;
          keyObjects = asArray(actor.publicKey).concat(asArray(actor.assertionMethod));
          this.remoteActorPublicKeyCache[actorUri] = keyObjects;
        }

        if (keyType) {
          if (keyType === KEY_TYPES.RSA) {
            // RSA keys might not have a type field, so we filter them manually.
            return keyObjects.filter(key => {
              const types = asArray(key.type || key['@type']);
              return types.length === 0 || types.includes(KEY_TYPES.RSA);
            });
          } else {
            return keyObjects.filter(key => asArray(key.type || key['@type']).includes(keyType));
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

        if (asArray(keyType).includes(KEY_TYPES.ED25519)) {
          return {
            '@type': [KEY_TYPES.ED25519, KEY_TYPES.MULTI_KEY, KEY_TYPES.VERIFICATION_METHOD],
            controller: keyObject.owner,
            expires: keyObject.expires,
            owner: keyObject.owner,
            publicKeyMultibase: keyObject.publicKeyMultibase,
            revoked: keyObject.revoked
          };
        }

        if (asArray(keyType).includes(KEY_TYPES.RSA)) {
          return {
            '@type': keyType,
            owner: keyObject.owner,
            controller: keyObject.owner,
            publicKeyPem: keyObject.publicKeyPem
          };
        }

        /** @type {never} Not implemented yet. */
        throw new Error('Key type not implemented yet.');
      }
    }
  },
  methods: {},
  hooks: {
    before: {
      '*': function checkMigration(ctx) {
        if (!this.isMigrated && !ctx.meta.skipMigrationCheck) {
          throw new Error(
            'The keys were not migrated to db storage yet. Please run `keys.migration.migrateKeysToDb` and use the deprecated `signature.keypair` service.'
          );
        }
      }
    }
  },
  events: {
    async 'keys.migration.migrated'(ctx) {
      this.isMigrated = true;
    },
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;

      if (!this.isMigrated) {
        return;
      }

      // Create, publish and attach keys to the webId.
      await Promise.all([
        this.actions.createKeyForActor({ webId, attachToWebId: true, keyType: KEY_TYPES.RSA }),
        this.actions.createKeyForActor({ webId, attachToWebId: true, keyType: KEY_TYPES.ED25519 })
      ]);
    }
  }
};

module.exports = KeyService;
