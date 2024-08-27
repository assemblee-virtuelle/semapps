const passport = require('passport');
const { Errors: E } = require('moleculer-web');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const { MIME_TYPES } = require('@semapps/mime-types');
const urlJoin = require('url-join');
const AuthAccountService = require('../services/account');
const AuthJWTService = require('../services/jwt');
const CapabilitiesService = require('../services/capabilities');

/** @type {import('moleculer').ServiceSchema} */
const AuthMixin = {
  settings: {
    baseUrl: null,
    jwtPath: null,
    capabilitiesPath: undefined,
    registrationAllowed: true,
    reservedUsernames: [],
    webIdSelection: [],
    accountSelection: [],
    accountsDataset: 'settings',
    podProvider: false
  },
  dependencies: ['api'],
  async created() {
    const { jwtPath, reservedUsernames, accountsDataset, podProvider } = this.settings;

    this.broker.createService({
      mixins: [AuthJWTService],
      settings: { jwtPath }
    });

    this.broker.createService({
      mixins: [AuthAccountService],
      settings: { reservedUsernames },
      adapter: new TripleStoreAdapter({ type: 'AuthAccount', dataset: accountsDataset })
    });

    if (podProvider) {
      this.broker.createService({ mixins: [CapabilitiesService], settings: { path: this.settings.capabilitiesPath } });
    }
  },
  async started() {
    if (!this.passportId) throw new Error('this.passportId must be set in the service creation.');

    this.passport = passport;
    this.passport.serializeUser((user, done) => {
      done(null, user);
    });
    this.passport.deserializeUser((user, done) => {
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
    // See https://moleculer.services/docs/0.13/moleculer-web.html#Authentication
    async authenticate(ctx) {
      const { route, req, res } = ctx.params;
      // Extract method and token from authorization header.
      const [method, token] = req.headers.authorization?.split(' ') || [];

      if (!token) {
        // No token
        ctx.meta.webId = 'anon';
        return Promise.resolve(null);
      }

      if (method === 'Bearer') {
        const payload = await ctx.call('auth.jwt.verifyToken', { token });
        if (payload) {
          ctx.meta.tokenPayload = payload;
          ctx.meta.webId = payload.webId;
          return Promise.resolve(payload);
        }
        // Invalid token
        // TODO make sure token is deleted client-side
        ctx.meta.webId = 'anon';
        return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
      } else if ((method === 'Capability' || req.$params.capability) && this.settings.podProvider) {
        const capabilityUri = token || req.$params.capability;
        const capability = await this.actions.getValidateCapability({
          capabilityUri,
          username: req.parsedUrl.match(/[^/]+/)[0]
        });

        ctx.meta.webId = 'anon';
        req.$ctx.meta.webId = 'anon';
        req.$ctx.meta.authorization = { capability };
        return Promise.resolve(null);
      }

      // No valid auth method given.
      ctx.meta.webId = 'anon';
      return Promise.resolve(null);
    },
    // See https://moleculer.services/docs/0.13/moleculer-web.html#Authorization
    async authorize(ctx) {
      const { route, req, res } = ctx.params;
      // Extract token from authorization header (do not take the Bearer part)
      /** @type {[string, string]} */
      const [method, token] = req.headers.authorization && req.headers.authorization.split(' ');

      if (!token) {
        ctx.meta.webId = 'anon';
        return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
      }

      if (method === 'Bearer') {
        const payload = await ctx.call('auth.jwt.verifyToken', { token });
        if (payload) {
          ctx.meta.tokenPayload = payload;
          ctx.meta.webId = payload.webId;
          return Promise.resolve(payload);
        }
      } else if ((method === 'Capability' || req.$params.capability) && this.settings.podProvider) {
        const capabilityUri = token || req.$params.capability;
        const capability = await this.actions.getValidateCapability({
          capabilityUri,
          username: req.parsedUrl.match(/[^/]+/)[0]
        });

        ctx.meta.webId = 'anon';

        req.$ctx.meta.webId = 'anon';
        req.$ctx.meta.authorization = { capability };
        if (capability) {
          return Promise.resolve(null);
        }
      }

      return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
    },
    getValidateCapability: {
      params: {
        capabilityUri: {
          type: 'string',
          required: true
        },
        webId: {
          type: 'string',
          optional: true
        },
        username: {
          type: 'string',
          optional: true
        }
      },
      /**
       * Checks, if the provided capabilityUri is a valid URI and within the resource owner's cap container.
       * @returns {Promise<object>} The stored capability object or undefined, if the capability is not valid.
       */
      async handler(ctx) {
        let { capabilityUri, webId, username } = ctx.params;
        /** @type {string} */
        const baseUrlTrailing = urlJoin(this.settings.baseUrl, '/');
        webId = webId || baseUrlTrailing + username;

        const podUrl = await ctx.call('pod.getUrl', { webId });

        // Check if capabilityUri is within the resource owner's pod
        if (!webId?.startsWith(baseUrlTrailing) || !capabilityUri?.startsWith(podUrl)) {
          return undefined;
        }

        // Check, if capUri is a valid URI.
        try {
          // eslint-disable-next-line no-new
          new URL(capabilityUri);
        } catch {
          return undefined;
        }

        // Check if capabilityUri is within the resource owner's cap container.
        const resourceCapContainerUri = await ctx.call('capabilities.getContainerUri', {
          webId
        });

        if (
          !(await ctx.call('ldp.container.includes', {
            containerUri: resourceCapContainerUri,
            resourceUri: capabilityUri,
            webId: 'system'
          }))
        ) {
          return undefined;
        }

        return await ctx.call('capabilities.get', { resourceUri: capabilityUri });
      }
    },

    async impersonate(ctx) {
      const { webId } = ctx.params;
      return await ctx.call('auth.jwt.generateToken', {
        payload: {
          webId
        }
      });
    }
  },
  methods: {
    getStrategy() {
      throw new Error('getStrategy must be implemented by the service');
    },
    getApiRoutes() {
      throw new Error('getApiRoutes must be implemented by the service');
    },
    pickWebIdData(data) {
      if (this.settings.webIdSelection.length > 0) {
        return Object.fromEntries(this.settings.webIdSelection.filter(key => key in data).map(key => [key, data[key]]));
      } else {
        // TODO do not return anything if webIdSelection is empty, to conform with pickAccountData
        return data || {};
      }
    },
    pickAccountData(data) {
      if (this.settings.accountSelection.length > 0) {
        return Object.fromEntries(
          this.settings.accountSelection.filter(key => key in data).map(key => [key, data[key]])
        );
      } else {
        return {};
      }
    }
  }
};

module.exports = AuthMixin;
