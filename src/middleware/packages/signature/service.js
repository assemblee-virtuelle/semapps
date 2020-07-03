const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { generateKeyPair, createSign, createHash } = require('crypto');
const { parseRequest, verifySignature } = require('http-signature');
const { createAuthzHeader, createSignatureString } = require('http-signature-header');

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
    },
    async generateSignatureHeaders(ctx) {
      const { url, body, actorUri } = ctx.params;
      const actorId = getSlugFromUri(actorUri);

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
      const privateKey = await fsPromises.readFile(path.join(this.settings.actorsKeyPairsDir, actorId + '.key'));
      const signatureHash = signer.sign(privateKey).toString('base64');

      headers.Signature = createAuthzHeader({
        includeHeaders,
        keyId: actorUri,
        signature: signatureHash
      }).substr('Signature '.length);

      return headers;
    },
    async verifyDigest(ctx) {
      const { body, headers } = ctx.params;
      return headers.digest ? this.buildDigest(body) !== headers.digest : true;
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
      const [actorUrl] = keyId.split('#');

      const publicKey = await this.getRemoteActorPublicKey(actorUrl);
      if (!publicKey) return false;

      return verifySignature(parsedSignature, publicKey);
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
    async getRemoteActorPublicKey(actorUrl) {
      const response = await fetch(actorUrl, { headers: { Accept: 'application/json' } });
      if (!response) return false;

      const actor = await response.json();
      if (!actor || !actor.publicKey) return false;

      return actor.publicKey.publicKeyPem;
    }
  }
};

module.exports = SignatureService;
