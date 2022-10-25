const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { generateKeyPair, createSign, createHash } = require('crypto');
const { parseRequest, verifySignature } = require('http-signature');
const { createAuthzHeader, createSignatureString } = require('http-signature-header');
const { Errors: E } = require('moleculer-web');
const { MIME_TYPES } = require('@semapps/mime-types');
const { getSlugFromUri } = require('@semapps/ldp');

const SignatureService = {
  name: 'signature',
  settings: {
    actorsKeyPairsDir: null
  },
  created() {
    if (!this.settings.actorsKeyPairsDir) {
      throw new Error('You must set the actorsKeyPairsDir setting in the signature service');
    } else if (!fs.existsSync(this.settings.actorsKeyPairsDir)) {
      throw new Error(`The actorsKeyPairsDir (${this.settings.actorsKeyPairsDir}) does not exist! Please create it.`);
    }
  },
  actions: {
    async getActorPublicKey(ctx) {
      const { actorUri } = ctx.params;
      const { publicKeyPath } = await this.getKeyPaths(ctx, actorUri);

      try {
        return await fs.promises.readFile(publicKeyPath, { encoding: 'utf8' });
      } catch (e) {
        return null;
      }
    },
    async generateActorKeyPair(ctx) {
      const { actorUri } = ctx.params;

      const publicKey = await this.actions.getActorPublicKey({ actorUri }, { parentCtx: ctx });
      if (publicKey) {
        this.logger.info(`Key for ${actorUri} already exists, skipping...`);
        return publicKey;
      }

      const { privateKeyPath, publicKeyPath } = await this.getKeyPaths(ctx, actorUri);

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
    async deleteActorKeyPair(ctx) {
      const { actorUri } = ctx.params;
      const { privateKeyPath, publicKeyPath } = await this.getKeyPaths(ctx, actorUri);

      try {
        await fs.promises.unlink(privateKeyPath);
        await fs.promises.unlink(publicKeyPath);
      } catch (e) {
        console.log(`Could not delete key pair for actor ${actorUri}`);
      }
    },
    async generateSignatureHeaders(ctx) {
      const { url, method, body, actorUri } = ctx.params;
      const { privateKeyPath } = await this.getKeyPaths(ctx, actorUri);
      const privateKey = await fsPromises.readFile(privateKeyPath);

      const headers = { Date: new Date().toUTCString() };
      const includeHeaders = ['(request-target)', 'host', 'date'];
      if (body) {
        headers.Digest = this.buildDigest(body);
        includeHeaders.push('digest');
      }

      // Generate signature string
      const requestOptions = { url, method, headers };
      const signatureString = createSignatureString({ includeHeaders, requestOptions });

      // Hash signature string
      const signer = createSign('sha256');
      signer.update(signatureString);
      const signatureHash = signer.sign(privateKey).toString('base64');

      headers.Signature = createAuthzHeader({
        includeHeaders,
        keyId: actorUri,
        signature: signatureHash,
        algorithm: 'rsa-sha256'
      }).substr('Signature '.length);

      return headers;
    },
    async verifyDigest(ctx) {
      const { body, headers } = ctx.params;
      return headers.digest ? this.buildDigest(body) === headers.digest : true;
    },
    async verifyHttpSignature(ctx) {
      const { url, path, method, headers } = ctx.params;

      // If there is a x-forwarded-host header, set is as host
      // This is the default behavior for Express server but the ApiGateway doesn't use Express
      if (headers['x-forwarded-host']) {
        headers.host = headers['x-forwarded-host'];
      }

      const parsedSignature = parseRequest({
        url: path || url.replace(new URL(url).origin, ''), // URL without domain name
        method,
        headers
      });

      const keyId = parsedSignature.params.keyId;
      if (!keyId) return false;
      const [actorUri] = keyId.split('#');

      const publicKey = await this.getRemoteActorPublicKey(actorUri);
      if (!publicKey) return false;

      const isValid = verifySignature(parsedSignature, publicKey);
      return { isValid, actorUri };
    },
    // See https://moleculer.services/docs/0.13/moleculer-web.html#Authentication
    async authenticate(ctx) {
      const { route, req, res } = ctx.params;
      if (req.headers.signature) {
        const { isValid, actorUri } = await this.actions.verifyHttpSignature(
          { path: req.originalUrl, method: req.method, headers: req.headers },
          { parentCtx: ctx }
        );
        if (isValid) {
          ctx.meta.webId = actorUri;
          return Promise.resolve();
        } else {
          ctx.meta.webId = 'anon';
          return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
        }
      } else {
        ctx.meta.webId = 'anon';
        return Promise.resolve(null);
      }
    },
    // See https://moleculer.services/docs/0.13/moleculer-web.html#Authorization
    async authorize(ctx) {
      const { route, req, res } = ctx.params;
      if (req.headers.signature) {
        const { isValid, actorUri } = await this.actions.verifyHttpSignature(
          { path: req.originalUrl, method: req.method, headers: req.headers },
          { parentCtx: ctx }
        );
        if (isValid) {
          ctx.meta.webId = actorUri;
          return Promise.resolve(payload);
        } else {
          ctx.meta.webId = 'anon';
          return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
        }
      } else {
        ctx.meta.webId = 'anon';
        return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
      }
    }
  },
  methods: {
    buildDigest(body) {
      return (
        'SHA-256=' +
        createHash('sha256')
          .update(body)
          .digest('base64')
      );
    },
    // TODO use cache mechanisms
    async getRemoteActorPublicKey(actorUri) {
      // TODO use activitypub.actor.get
      const response = await fetch(actorUri, { headers: { Accept: 'application/json' } });
      if (!response) return false;

      const actor = await response.json();
      if (!actor || !actor.publicKey) return false;

      return actor.publicKey.publicKeyPem;
    },
    async getKeyPaths(ctx, actorUri) {
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
    }
  }
};

module.exports = SignatureService;
