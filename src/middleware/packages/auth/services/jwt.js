const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = {
  name: 'auth.jwt',
  settings: {
    jwtPath: null
  },
  async created() {
    const privateKeyPath = path.resolve(this.settings.jwtPath, 'jwtRS256.key');
    const publicKeyPath = path.resolve(this.settings.jwtPath, 'jwtRS256.key.pub');

    if (!fs.existsSync(privateKeyPath) && !fs.existsSync(publicKeyPath)) {
      this.logger.info('JWT keypair not found, generating...');
      if (!fs.existsSync(this.settings.jwtPath)) {
        fs.mkdirSync(this.settings.jwtPath);
      }
      await this.actions.generateKeyPair({ privateKeyPath, publicKeyPath });
    }

    this.privateKey = fs.readFileSync(privateKeyPath);
    this.publicKey = fs.readFileSync(publicKeyPath);
  },
  actions: {
    generateKeyPair(ctx) {
      const { privateKeyPath, publicKeyPath } = ctx.params;

      return new Promise((resolve, reject) => {
        crypto.generateKeyPair(
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
            if (err) {
              reject(err);
            } else {
              fs.writeFile(privateKeyPath, privateKey, err => {
                if (err) {
                  reject(err);
                } else {
                  fs.writeFile(publicKeyPath, publicKey, err => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve({ privateKey, publicKey });
                    }
                  });
                }
              });
            }
          }
        );
      });
    },
    async generateToken(ctx) {
      const { payload } = ctx.params;
      return jwt.sign(payload, this.privateKey, { algorithm: 'RS256' });
    },
    async verifyToken(ctx) {
      const { token } = ctx.params;
      try {
        return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] });
      } catch (err) {
        return false;
      }
    },
    // Warning, this does NOT verify if signature is valid
    async decodeToken(ctx) {
      const { token } = ctx.params;
      try {
        return jwt.decode(token);
      } catch (err) {
        return false;
      }
    }
  }
};
