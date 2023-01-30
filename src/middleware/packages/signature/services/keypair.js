const fs = require('fs');
const path = require('path');
const { generateKeyPair } = require('crypto');
const { namedNode, blankNode, literal, triple } = require('@rdfjs/data-model');
const { MIME_TYPES } = require('@semapps/mime-types');
const { getSlugFromUri } = require('@semapps/ldp');

const SignatureService = {
  name: 'signature.keypair',
  settings: {
    actorsKeyPairsDir: null
  },
  created() {
    this.remoteActorPublicKeyCache = {};
    if (!this.settings.actorsKeyPairsDir) {
      throw new Error('You must set the actorsKeyPairsDir setting in the signature service');
    } else if (!fs.existsSync(this.settings.actorsKeyPairsDir)) {
      throw new Error(`The actorsKeyPairsDir (${this.settings.actorsKeyPairsDir}) does not exist! Please create it.`);
    }
  },
  actions: {
    async generate(ctx) {
      const { actorUri } = ctx.params;

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
      const { privateKeyPath, publicKeyPath } = await this.actions.getPaths({ actorUri }, { parentCtx: ctx });

      try {
        await fs.promises.unlink(privateKeyPath);
        await fs.promises.unlink(publicKeyPath);
      } catch (e) {
        console.log(`Could not delete key pair for actor ${actorUri}`);
      }
    },
    async attachPublicKey(ctx) {
      let { actorUri } = ctx.params;

      const actor = await ctx.call('ldp.resource.get', {
        resourceUri: actorUri,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      // Ensure a public key is not already attached
      if (!actor.publicKey) {
        const { publicKey } = await this.actions.get({ actorUri }, { parentCtx: ctx });

        await ctx.call('ldp.resource.patch', {
          resourceUri: actorUri,
          triplesToAdd: [
            triple(namedNode(actorUri), namedNode('https://w3id.org/security#publicKey'), blankNode('b0')),
            triple(blankNode('b0'), namedNode('https://w3id.org/security#owner'), namedNode(actorUri)),
            triple(blankNode('b0'), namedNode('https://w3id.org/security#publicKeyPem'), literal(publicKey)),
          ],
          webId: 'system'
        });
      }
    },
    async getPaths(ctx) {
      const { actorUri } = ctx.params;

      const actorData = await ctx.call('ldp.resource.get', {
        resourceUri: actorUri,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      if (actorData) {
        const username = actorData.preferredUsername || getSlugFromUri(actorUri);
        const privateKeyPath = path.join(this.settings.actorsKeyPairsDir, username + '.key');
        const publicKeyPath = path.join(this.settings.actorsKeyPairsDir, username + '.key.pub');
        return { privateKeyPath, publicKeyPath };
      } else {
        throw new Error('No valid actor found with URI ' + actorUri);
      }
    },
    async get(ctx) {
      const { actorUri } = ctx.params;
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

      if (this.remoteActorPublicKeyCache[actorUri]) {
        return this.remoteActorPublicKeyCache[actorUri];
      }

      const response = await fetch(actorUri, { headers: { Accept: 'application/json' } });
      if (!response) return false;

      const actor = await response.json();
      if (!actor || !actor.publicKey || !actor.publicKey.publicKeyPem) return false;

      this.remoteActorPublicKeyCache[actorUri] = actor.publicKey.publicKeyPem;
      return actor.publicKey.publicKeyPem;
    },
  },
  events: {
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;
      await this.actions.generate({ actorUri: webId }, { parentCtx: ctx });
      await this.actions.attachPublicKey({ actorUri: webId }, { parentCtx: ctx });
    }
  }
};

module.exports = SignatureService;
