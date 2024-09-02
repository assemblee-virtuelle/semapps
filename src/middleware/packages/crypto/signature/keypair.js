const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { generateKeyPair } = require('crypto');
const { namedNode, blankNode, literal, triple } = require('@rdfjs/data-model');
const { MIME_TYPES } = require('@semapps/mime-types');
const KEY_TYPES = require('../keys/keyTypes');

/**
 * Deprecated Service.
 * This service uses a file-system based key store, the new one stores keys in the graph db.
 * If the migration has taken place (by calling `keys.migration.migrateKeysToDb`), calls
 * will be redirected to the new service.
 * @type {import('moleculer').ServiceSchema}
 */
const SignatureService = {
  name: 'signature.keypair',
  settings: {
    actorsKeyPairsDir: null
  },
  async created() {
    if (!this.settings.actorsKeyPairsDir) {
      throw new Error('You must set the actorsKeyPairsDir setting in the signature service');
    } else if (!fs.existsSync(this.settings.actorsKeyPairsDir)) {
      throw new Error(`The actorsKeyPairsDir (${this.settings.actorsKeyPairsDir}) does not exist! Please create it.`);
    }
  },
  async started() {
    await this.waitForServices('keys.migration');
    this.isMigrated = await this.broker.call('keys.migration.isMigrated');
  },
  actions: {
    async generate(ctx) {
      const { actorUri } = ctx.params;

      if (this.isMigrated) {
        let [key] = await ctx.call('keys.getOrCreateWebIdKeys', {
          keyType: KEY_TYPES.RSA,
          webId: actorUri
        });
        return key.publicKeyPem;
      }

      const { publicKey } = await this.actions.get({ actorUri }, { parentCtx: ctx });
      if (publicKey) {
        this.logger.info(`Key for ${actorUri} already exists, skipping...`);
        return publicKey;
      }

      const { privateKeyPath, publicKeyPath } = await this.actions.getPaths({ actorUri }, { parentCtx: ctx });

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
              fs.writeFile(privateKeyPath, privateKey, err => reject(err));
              fs.writeFile(publicKeyPath, publicKey, err => reject(err));
              resolve(publicKey);
            } else {
              reject(err);
            }
          }
        );
      });
    },

    async delete(ctx) {
      const { actorUri } = ctx.params;

      if (this.isMigrated) {
        const [key] = await ctx.call('keys.getOrCreateWebIdKeys', { webId: actorUri, keyType: KEY_TYPES.RSA });
        await ctx.call('keys.delete', { resourceUri: key.id || key['@id'], webId: actorUri });
        return;
      }

      const { privateKeyPath, publicKeyPath } = await this.actions.getPaths({ actorUri }, { parentCtx: ctx });

      try {
        await fs.promises.unlink(privateKeyPath);
        await fs.promises.unlink(publicKeyPath);
      } catch (e) {
        console.log(`Could not delete key pair for actor ${actorUri}`);
      }
    },

    async attachPublicKey(ctx) {
      const { actorUri } = ctx.params;

      if (this.isMigrated) {
        this.logger.info(
          `The keys service has been migrated. Key setup is handled by the keys service. This function will not have an effect`
        );
        return;
      }

      const actor = await ctx.call('ldp.resource.get', {
        resourceUri: actorUri,
        accept: MIME_TYPES.JSON,
        webId: actorUri
      });

      // Ensure a public key is not already attached
      if (!actor.publicKey) {
        const { publicKey } = await this.actions.get({ actorUri }, { parentCtx: ctx });

        await ctx.call('ldp.resource.patch', {
          resourceUri: actorUri,
          triplesToAdd: [
            triple(namedNode(actorUri), namedNode('https://w3id.org/security#publicKey'), blankNode('b0')),
            triple(blankNode('b0'), namedNode('https://w3id.org/security#owner'), namedNode(actorUri)),
            triple(blankNode('b0'), namedNode('https://w3id.org/security#publicKeyPem'), literal(publicKey))
          ],
          webId: 'system'
        });
      }
    },

    async getPaths(ctx) {
      const { actorUri } = ctx.params;

      const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });

      if (account) {
        const privateKeyPath = path.join(this.settings.actorsKeyPairsDir, `${account.username}.key`);
        const publicKeyPath = path.join(this.settings.actorsKeyPairsDir, `${account.username}.key.pub`);
        return { privateKeyPath, publicKeyPath };
      }
      throw new Error(`No account found with URI ${actorUri}`);
    },

    async get(ctx) {
      const { actorUri } = ctx.params;

      // Call new method, if migrated.
      if (this.isMigrated) {
        const [key] = await ctx.call('keys.getOrCreateWebIdKeys', { keyType: KEY_TYPES.RSA, webId: actorUri });
        return {
          publicKey: key.publicKeyPem,
          privateKey: key.privateKeyPem
        };
      }

      const { publicKeyPath, privateKeyPath } = await this.actions.getPaths({ actorUri }, { parentCtx: ctx });
      try {
        const publicKey = await fs.promises.readFile(publicKeyPath, { encoding: 'utf8' });
        const privateKey = await fs.promises.readFile(privateKeyPath, { encoding: 'utf8' });
        return { publicKey, privateKey };
      } catch (e) {
        return {};
      }
    },

    async getRemotePublicKey(ctx) {
      const { actorUri } = ctx.params;

      // Call new method, if migrated.
      if (this.isMigrated) {
        return (await ctx.call('keys.getRemotePublicKeys', { webId: actorUri, keyType: KEY_TYPES.RSA }))?.[0]
          ?.publicKeyPem;
      }

      let response = await fetch(actorUri, { headers: { Accept: 'application/json' } });
      if (!response.ok) return false;

      const actor = await response.json();
      if (!actor || !actor.publicKey) return false;

      // If the public key is not dereferenced
      if (typeof actor.publicKey === 'string') {
        response = await fetch(actor.publicKey, { headers: { Accept: 'application/json' } });
        if (!response.ok) return false;
        const publicKey = await response.json();
        if (!publicKey) return false;
        return publicKey.publicKeyPem;
      } else {
        return actor.publicKey.publicKeyPem;
      }
    }
  },
  hooks: {
    before: {
      '*': function showDeprecationWarning() {
        // Only warn once
        if (this.hasWarnedMigration) return;

        if (this.isMigrated) {
          this.logger.info(
            'The keys service has been migrated. ' +
              'Key requests and setup are redirected to and handled in the new service. ' +
              'This service might be removed in a future version.'
          );
        } else {
          this.logger.warn(
            'The keys service has not been migrated yet. ' +
              'This service is still handling key requests and setup. ' +
              'Please migrate to the new keys service.'
          );
        }
        this.hasWarnedMigration = true;
      }
    }
  },
  events: {
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;
      if (this.isMigrated) {
        return;
      }

      await this.actions.generate({ actorUri: webId }, { parentCtx: ctx });
      await this.actions.attachPublicKey({ actorUri: webId }, { parentCtx: ctx });
    },
    async 'keys.migration.migrated'(ctx) {
      this.isMigrated = true;
    }
  }
};

module.exports = SignatureService;
