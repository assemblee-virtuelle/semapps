const { createSign, createHash } = require('crypto');
const { parseRequest, verifySignature } = require('http-signature');
const { createAuthzHeader, createSignatureString } = require('http-signature-header');
const { Errors: E } = require('moleculer-web');
const KeypairService = require('./services/keypair');

const SignatureService = {
  name: 'signature',
  settings: {
    actorsKeyPairsDir: null
  },
  created() {
    const { actorsKeyPairsDir } = this.settings;

    this.broker.createService(KeypairService, {
      settings: {
        actorsKeyPairsDir
      }
    });
  },
  actions: {
    async generateSignatureHeaders(ctx) {
      const { url, method, body, actorUri } = ctx.params;
      const { privateKey } = await ctx.call('signature.keypair.get', { actorUri });

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

      const { keyId } = parsedSignature.params;
      if (!keyId) return false;
      const [actorUri] = keyId.split('#');

      const publicKeys = await ctx.call('keys.getRemotePublicKeys', { actorUri });
      if (!publicKeys) return false;

      const isValid = verifySignature(parsedSignature, publicKeys);
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
        }
        ctx.meta.webId = 'anon';
        return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
      }
      ctx.meta.webId = 'anon';
      return Promise.resolve(null);
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
          return Promise.resolve();
        }
        ctx.meta.webId = 'anon';
        return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
      }
      ctx.meta.webId = 'anon';
      return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
    }
  },
  methods: {
    buildDigest(body) {
      return `SHA-256=${createHash('sha256').update(body).digest('base64')}`;
    }
  }
};

module.exports = SignatureService;
