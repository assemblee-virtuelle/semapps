// @ts-expect-error TS(7016): Could not find a declaration file for module 'pass... Remove this comment to see the full error message
import passport from 'passport';
// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { TripleStoreAdapter } from '@semapps/triplestore';
import { ServiceSchema } from 'moleculer';
import AuthAccountService from '../services/account.ts';
import AuthJWTService from '../services/jwt.ts';

/**
 * Auth Mixin that handles authentication and authorization for routes
 * that requested this.
 *
 * The authorization and authentication actions check for a valid `authorization` header.
 * If the bearer token is a server-signed JWT identifying the user, `ctx.meta.tokenPayload` and
 * `ctx.meta.webId` are set. Setting either `authorization` or `authentication` suffices.
 *
 * # Authentication
 * In the `authenticate` action, the webId is set to `anon`, if no `authorization` header is present.
 *
 * # Authorization
 * In contrast, the `authorize` action throws an unauthorized error,
 * if no `authorization` header is present.
 * @see https://moleculer.services/docs/0.13/moleculer-web.html#Authentication
 *
 * ## Capability Authorization
 * Additionally, the `authorize` action supports capability authorization based on
 * Verifiable Credentials (VCs), if `opts.authorizeWithCapability` is set to `true`.
 *
 * **WARNING**: This does not make any assertions about the validity of the capabilities'
 * content (`credentialSubject`). What *is* checked:
 * - the delegation chain was correct
 * - all signatures are valid
 * - the `controller`s of the keys (`verificationMethod`) used in the proofs to sign
 *   the VC capabilities and presentation are correct. I.e. the controller resolves to
 *   the WebId/controller identifier document (CID) which lists the key.\
 *   This means that *you know who signed the presentation and capabilities* on the way.
 *
 * NO BUSINESS LOGIC IS CHECKED.\
 * It is still necessary to verify if the request itself is valid.
 * There would be no error when the `credentialSubject` says: "A is allowed to read B"
 * while the statement is actually made by "C" and not by "B".\
 *
 * @see https://moleculer.services/docs/0.13/moleculer-web.html#Authorization
 *
 * @example Configuration for a new route
 * ```js
 * ctx.call('api.addRoute', {
 *   path: path.join(basePath, '/your/route'),
 *   name: 'your-route-name',
 *   aliases: {
 *     'GET /': 'your.action.here',
 *   },
 *   // Set to true, to run authorization action.
 *   authorization: true,
 *   // Set to true, to run authenticate action.
 *   authentication: false,
 * });
 * ```
 *
 * @type {import('moleculer').ServiceSchema}
 */
const AuthMixin = {
  settings: {
    baseUrl: null,
    jwtPath: null,
    capabilitiesPath: undefined,
    registrationAllowed: true,
    reservedUsernames: [],
    minPasswordLength: 1,
    minUsernameLength: 1,
    webIdSelection: [],
    accountSelection: [],
    accountsDataset: 'settings',
    podProvider: false
  },
  dependencies: ['api'],
  async created() {
    const { jwtPath, reservedUsernames, minPasswordLength, minUsernameLength, accountsDataset, podProvider } =
      this.settings;

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth.jwt"; se... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [AuthJWTService],
      settings: { jwtPath }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth.account"... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [AuthAccountService],
      settings: { reservedUsernames, minPasswordLength, minUsernameLength },
      adapter: new TripleStoreAdapter({ type: 'AuthAccount', dataset: accountsDataset })
    });
  },
  async started() {
    if (!this.passportId) throw new Error('this.passportId must be set in the service creation.');

    this.passport = passport;
    this.passport.serializeUser((user: any, done: any) => {
      done(null, user);
    });
    this.passport.deserializeUser((user: any, done: any) => {
      done(null, user);
    });

    this.strategy = await this.getStrategy();

    this.passport.use(this.passportId, this.strategy);

    const { pathname: basePath } = new URL(this.settings.baseUrl);

    for (const route of this.getApiRoutes(basePath)) {
      await this.broker.call('api.addRoute', { route });
    }
  },
  actions: {
    authenticate: {
      // See https://moleculer.services/docs/0.13/moleculer-web.html#Authentication
      async handler(ctx) {
        const { route, req, res } = ctx.params;
        // Extract method and token from authorization header.
        const [method, token] = req.headers.authorization?.split(' ') || [];

        if (!token) {
          // No token
          // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
          ctx.meta.webId = 'anon';
          return Promise.resolve(null);
        }

        if (method === 'Bearer') {
          const payload = await ctx.call('auth.jwt.verifyServerSignedToken', { token });
          if (payload) {
            // @ts-expect-error TS(2339): Property 'tokenPayload' does not exist on type '{}... Remove this comment to see the full error message
            ctx.meta.tokenPayload = payload;
            // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
            ctx.meta.webId = payload.webId;
            return Promise.resolve(payload);
          }

          // Check if token is a capability.
          if (route.opts.authorizeWithCapability) {
            return this.validateCapability(ctx, token);
          }

          // Invalid token
          // TODO make sure token is deleted client-side
          return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
        }

        // No valid auth method given.
        // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
        ctx.meta.webId = 'anon';
        return Promise.resolve(null);
      }
    },

    authorize: {
      // See https://moleculer.services/docs/0.13/moleculer-web.html#Authorization
      async handler(ctx) {
        const { route, req, res } = ctx.params;
        // Extract token from authorization header (do not take the Bearer part)
        /** @type {[string, string]} */
        const [method, token] = req.headers.authorization && req.headers.authorization.split(' ');

        if (!token) {
          return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
        }
        if (method !== 'Bearer') {
          return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
        }

        // Validate if the token was signed by server (registered user).
        const serverSignedPayload = await ctx.call('auth.jwt.verifyServerSignedToken', { token });
        if (serverSignedPayload) {
          // @ts-expect-error TS(2339): Property 'tokenPayload' does not exist on type '{}... Remove this comment to see the full error message
          ctx.meta.tokenPayload = serverSignedPayload;
          // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
          ctx.meta.webId = serverSignedPayload.webId;
          return Promise.resolve(serverSignedPayload);
        }

        // Check if token is a capability.
        if (route.opts.authorizeWithCapability) {
          return this.validateCapability(ctx, token);
        }

        return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
      }
    },

    impersonate: {
      async handler(ctx) {
        const { webId } = ctx.params;
        return await ctx.call('auth.jwt.generateServerSignedToken', {
          payload: {
            webId
          }
        });
      }
    }
  },
  methods: {
    async validateCapability(ctx, token) {
      // We accept VC Presentations to invoke capabilities here. It must be encoded as JWT.
      // We do not use the VC-JOSE spec to sign and envelop presentations. Instead we go
      // with embedded signatures. This way, the signature persists within the resource.

      const hasCapabilityService = ctx.broker.registry.actions.isAvailable(
        'crypto.vc.verifier.verifyCapabilityPresentation'
      );
      if (!hasCapabilityService) return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));

      // Decode JTW to JSON.
      const decodedToken = await ctx.call('auth.jwt.decodeToken', { token });
      if (!decodedToken) return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));

      // Verify that decoded JSON token is a valid VC presentation.
      const {
        verified: isCapSignatureVerified,
        presentation: verifiedPresentation,
        presentationResult
      } = await ctx.call('crypto.vc.verifier.verifyCapabilityPresentation', {
        verifiablePresentation: decodedToken,
        options: {
          maxChainLength: ctx.params.route.opts.maxChainLength
        }
      });
      if (!isCapSignatureVerified) return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));

      // VC Capability is verified.
      ctx.meta.webId = presentationResult?.results?.[0]?.purposeResult?.holder || 'anon';
      ctx.meta.authorization = { capabilityPresentation: verifiedPresentation };

      return Promise.resolve(verifiedPresentation);
    },
    getStrategy() {
      throw new Error('getStrategy must be implemented by the service');
    },
    getApiRoutes() {
      throw new Error('getApiRoutes must be implemented by the service');
    },
    pickWebIdData(data) {
      if (this.settings.webIdSelection.length > 0) {
        return Object.fromEntries(
          this.settings.webIdSelection.filter((key: any) => key in data).map((key: any) => [key, data[key]])
        );
      } else {
        // TODO do not return anything if webIdSelection is empty, to conform with pickAccountData
        return data || {};
      }
    },
    pickAccountData(data) {
      if (this.settings.accountSelection.length > 0) {
        return Object.fromEntries(
          this.settings.accountSelection.filter((key: any) => key in data).map((key: any) => [key, data[key]])
        );
      } else {
        return {};
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default AuthMixin;
