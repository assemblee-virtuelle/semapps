const AuthAccountService = require('../services/account');
const AuthJWTService = require('../services/jwt');
const { Errors: E } = require('moleculer-web');
const passport = require('passport');

const AuthMixin = {
  settings: {
    baseUrl: null,
    jwtPath: null,
    registrationAllowed: true,
    reservedUsernames: []
  },
  dependencies: ['api', 'webid'],
  async created() {
    const { jwtPath, reservedUsernames } = this.settings;

    await this.broker.createService(AuthJWTService, {
      settings: { jwtPath }
    });

    await this.broker.createService(AuthAccountService, {
      settings: { reservedUsernames }
    });
  },
  async started() {
    this.passport = passport;
    this.passport.use(this.passportId, this.getStrategy());

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
      // const userData = await ctx.call('ldp.resource.get', {
      //   resourceUri: webId,
      //   accept: MIME_TYPES.JSON,
      //   webId: 'system'
      // });
      return await ctx.call('auth.jwt.generateToken', {
        payload: {
          webId
          // email: userData['foaf:email'],
          // name: userData['foaf:name'],
          // familyName: userData['foaf:familyName']
        }
      });
    }
  },
  methods: {
    getStrategy() {
      throw new Error('getStrategy must be implemented');
    },
    getApiRoutes() {
      throw new Error('getApiRoutes must be implemented');
    }
  }
};

module.exports = AuthMixin;
