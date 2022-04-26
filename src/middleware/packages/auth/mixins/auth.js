const passport = require('passport');
const { Errors: E } = require('moleculer-web');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const AuthAccountService = require('../services/account');
const AuthJWTService = require('../services/jwt');

const AuthMixin = {
  settings: {
    baseUrl: null,
    jwtPath: null,
    registrationAllowed: true,
    reservedUsernames: [],
    webIdSelection: [],
    accountSelection: [],
    accountsDataset: 'settings',
    mail: {
      from: null,
      transport: null
    }
  },
  dependencies: ['api', 'webid'],
  async created() {
    const { jwtPath, reservedUsernames, accountsDataset } = this.settings;

    await this.broker.createService(AuthJWTService, {
      settings: { jwtPath }
    });

    await this.broker.createService(AuthAccountService, {
      settings: { reservedUsernames },
      adapter: new TripleStoreAdapter({ type: 'AuthAccount', dataset: accountsDataset })
    });
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

    this.strategy = this.getStrategy();

    this.passport.use(this.passportId, this.strategy);

    for (let route of this.getApiRoutes()) {
      await this.broker.call('api.addRoute', { route });
    }
  },
  actions: {
    // See https://moleculer.services/docs/0.13/moleculer-web.html#Authentication
    async authenticate(ctx) {
      const { route, req, res } = ctx.params;
      // Extract token from authorization header (do not take the Bearer part)
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (token) {
        const payload = await ctx.call('auth.jwt.verifyToken', { token });
        if (payload) {
          ctx.meta.tokenPayload = payload;
          ctx.meta.webId = payload.webId;
          return Promise.resolve(payload);
        } else {
          // Invalid token
          // TODO make sure token is deleted client-side
          ctx.meta.webId = 'anon';
          return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
        }
      } else {
        // No token, anonymous error
        ctx.meta.webId = 'anon';
        return Promise.resolve(null);
      }
    },
    // See https://moleculer.services/docs/0.13/moleculer-web.html#Authorization
    async authorize(ctx) {
      const { route, req, res } = ctx.params;
      // Extract token from authorization header (do not take the Bearer part)
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (token) {
        const payload = await ctx.call('auth.jwt.verifyToken', { token });
        if (payload) {
          ctx.meta.tokenPayload = payload;
          ctx.meta.webId = payload.webId;
          return Promise.resolve(payload);
        } else {
          ctx.meta.webId = 'anon';
          return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
        }
      } else {
        ctx.meta.webId = 'anon';
        return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
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
        return data;
      }
    },
    pickAccountData(data) {
      if (this.settings.accountSelection.length > 0) {
        return Object.fromEntries(
          this.settings.accountSelection.filter(key => key in data).map(key => [key, data[key]])
        );
      } else {
        return data || {};
      }
    }
  }
};

module.exports = AuthMixin;
