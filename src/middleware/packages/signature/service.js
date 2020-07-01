const fs = require('fs');
const path = require('path');
const { generateKeyPair } = require('crypto');

const getSlugFromUri = str => str.replace(/\/$/, '').replace(/.*\//, '');

const SignatureService = {
  name: 'signature',
  settings: {
    actorsKeyPairsDir: null
  },
  actions: {
    async generateActorKeyPair(ctx) {
      return new Promise((resolve, reject) => {
        const { actorUri } = ctx.params;
        const actorId = getSlugFromUri(actorUri);

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
              fs.writeFile(path.join(this.settings.actorsKeyPairsDir, actorId + '.key'), privateKey, err =>
                reject(err)
              );
              fs.writeFile(path.join(this.settings.actorsKeyPairsDir, actorId + '.key.pub'), publicKey, err =>
                reject(err)
              );
              resolve(publicKey);
            } else {
              reject(err);
            }
          }
        );
      });
    }
  }
};

module.exports = SignatureService;
