import { createSign, createHash } from 'crypto';
import { parseRequest, verifySignature } from 'http-signature';
import { createAuthzHeader, createSignatureString } from 'http-signature-header';
import { E as Errors } from 'moleculer-web';
import { KEY_TYPES } from '../constants.ts';
import { arrayOf } from '../utils/utils.ts';
import { ServiceSchema, defineAction } from 'moleculer';

const HttpSignatureService = {
  // TODO: Rename to signature.http-signatures in a major release.
  name: 'signature' as const,
  actions: {
    generateSignatureHeaders: defineAction({
      async handler(ctx) {
        const { url, method, body, actorUri } = ctx.params;
        // TODO: Use new service.
        const [{ privateKeyPem }] = await ctx.call('keys.getOrCreateWebIdKeys', {
          keyType: KEY_TYPES.RSA,
          webId: actorUri
        });

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
        const signatureHash = signer.sign(privateKeyPem).toString('base64');

        headers.Signature = createAuthzHeader({
          includeHeaders,
          keyId: actorUri,
          signature: signatureHash,
          algorithm: 'rsa-sha256'
        }).substr('Signature '.length);

        return headers;
      }
    }),

    verifyDigest: defineAction({
      async handler(ctx) {
        const { body, headers } = ctx.params;
        return headers.digest ? this.buildDigest(body) === headers.digest : true;
      }
    }),

    verifyHttpSignature: defineAction({
      /**
       * Given url, path, method, headers, validates a given http signature.
       * If the signature is valid, it returns the actorUri and the publicKeyPem used to verify the signature.
       * Else, it returns `{isValid: false}`.
       * @param {object} ctx Context
       * @param {object} ctx.params Params
       * @param {string} ctx.params.url The URL of the request
       * @param {string} ctx.params.path The path of the request
       * @param {string} ctx.params.method The method of the request
       * @param {object} ctx.params.headers The headers of the request
       * @returns {Promise<{isValid: boolean, actorUri: string, publicKeyPem: string}>}
       */
      async handler(ctx) {
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
        if (!keyId) return { isValid: false };
        const [actorUri] = keyId.split('#');

        // TODO: Check if keys are outdated

        const publicKeys = await ctx.call('keys.getRemotePublicKeys', { webId: actorUri, keyType: KEY_TYPES.RSA });

        if (!publicKeys) return { isValid: false };

        // Check, if one of the keys is able to verify the signature.
        const { isValid: keyValid, publicKey: publicKeyPem } = publicKeys
          .flatMap(key => key.publicKeyPem || [])
          .map(pubKeyPem => {
            try {
              return { isValid: verifySignature(parsedSignature, pubKeyPem), publicKey: pubKeyPem };
            } catch (e) {
              return { isValid: false };
            }
          })
          .find(({ isValid }) => isValid) || { isValid: false, publicKey: null };

        return { isValid: keyValid, actorUri, publicKeyPem };
      }
    }),

    authenticate: defineAction({
      // See https://moleculer.services/docs/0.13/moleculer-web.html#Authentication
      async handler(ctx) {
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
      }
    }),

    authorize: defineAction({
      // See https://moleculer.services/docs/0.13/moleculer-web.html#Authorization
      async handler(ctx) {
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
    })
  },
  methods: {
    buildDigest(body) {
      return `SHA-256=${createHash('sha256').update(body).digest('base64')}`;
    }
  }
} satisfies ServiceSchema;

export default HttpSignatureService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [HttpSignatureService.name]: typeof HttpSignatureService;
    }
  }
}
