import fs from 'fs';
import path from 'path';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'json... Remove this comment to see the full error message
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ServiceSchema } from 'moleculer';

/**
 * Service that creates and validates JSON web tokens(JWT).
 * Tokens are signed against this server's keys.
 * This is useful for generating/validating authentication tokens.
 *
 * TODO: Tokens do not expire.
 */
const AuthJwtSchema = {
  name: 'auth.jwt' as const,
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
    generateKeyPair: {
      handler(ctx) {
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
      }
    },

    generateServerSignedToken: {
      async handler(ctx) {
        const { payload } = ctx.params;
        return jwt.sign(payload, this.privateKey, { algorithm: 'RS256' });
      }
    },

    verifyServerSignedToken: {
      /** Verifies that the token was signed by this server. */
      async handler(ctx) {
        const { token } = ctx.params;
        try {
          return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] });
        } catch (err) {
          return false;
        }
      }
    },

    generateUnsignedToken: {
      async handler(ctx) {
        const { payload } = ctx.params;
        const token = jwt.sign(payload, null, { algorithm: 'none' });
        return token;
      }
    },

    decodeToken: {
      // Warning, this does NOT verify if signature is valid
      async handler(ctx) {
        const { token } = ctx.params;
        try {
          return jwt.decode(token);
        } catch (err) {
          return false;
        }
      }
    }
  }
} satisfies ServiceSchema;

export default AuthJwtSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [AuthJwtSchema.name]: typeof AuthJwtSchema;
    }
  }
}
