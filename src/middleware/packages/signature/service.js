const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { generateKeyPair, createSign, createHash } = require('crypto');
const { parseRequest, verifySignature } = require('http-signature');
const { createAuthzHeader, createSignatureString } = require('http-signature-header');
const { MIME_TYPES } = require('@semapps/mime-types');

const SignatureService = {
  name: 'signature',
  settings: {
    actorsKeyPairsDir: null
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
        console.log(`Key for ${actorUri} already exists, skipping...`);
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
      const { url, body, actorUri } = ctx.params;
      const { privateKeyPath } = await this.getKeyPaths(ctx, actorUri);
      const privateKey = await fsPromises.readFile(privateKeyPath);

      const headers = {
        Date: new Date().toUTCString(),
        Digest: this.buildDigest(body)
      };

      // Generate signature string
      const requestOptions = { url, method: 'POST', headers };
      const includeHeaders = ['(request-target)', 'host', 'date', 'digest'];
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
      const { url, headers } = ctx.params;

      const parsedSignature = parseRequest({
        url: url.replace(new URL(url).origin, ''), // URL without domain name
        method: 'POST',
        headers
      });

      const keyId = parsedSignature.params.keyId;
      if (!keyId) return false;
      const [actorUri] = keyId.split('#');

      const publicKey = await this.getRemoteActorPublicKey(actorUri);
      if (!publicKey) return false;

      const isValid = verifySignature(parsedSignature, publicKey);

      return { isValid, actorUri };
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

      if (actorData && actorData.preferredUsername) {
        const privateKeyPath = path.join(this.settings.actorsKeyPairsDir, actorData.preferredUsername + '.key');
        const publicKeyPath = path.join(this.settings.actorsKeyPairsDir, actorData.preferredUsername + '.key.pub');
        return { privateKeyPath, publicKeyPath };
      } else {
        throw new Error('No valid actor found with URI ' + actorUri);
      }
    }
  }
};

module.exports = SignatureService;
