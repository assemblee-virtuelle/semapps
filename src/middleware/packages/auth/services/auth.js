const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const AuthAccountService = require('./account');
const AuthJWTService = require('./jwt');
// const OidcConnector = require('../OidcConnector');
// const CasConnector = require('../CasConnector');
// const LocalConnector = require('../LocalConnector');
const {Errors: E} = require("moleculer-web");
const session = require("express-session");
const {Strategy} = require("passport-local");
const passport = require("passport");

module.exports = {
  name: 'auth',
  settings: {
    baseUrl: null,
    jwtPath: null,
    type: 'oidc',
    oidc: {
      issuer: null,
      clientId: null,
      clientSecret: null,
      selectSsoData: null,
    },
    cas: {
      url: null,
      selectSsoData: null,
    },
    registrationAllowed: true,
    reservedUsernames: ['sparql', 'auth', 'common', 'data']
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
    const { baseUrl, selectProfileData, oidc, cas } = this.settings;

    // if (oidc.issuer) {
    //   this.connector = new OidcConnector({
    //     issuer: oidc.issuer,
    //     clientId: oidc.clientId,
    //     clientSecret: oidc.clientSecret,
    //     redirectUri: urlJoin(baseUrl, 'auth'),
    //     selectProfileData,
    //     findOrCreateProfile: this.findOrCreateProfile
    //   });
    // } else if (cas.url) {
    //   this.connector = new CasConnector({
    //     casUrl: cas.url,
    //     selectProfileData,
    //     findOrCreateProfile: this.findOrCreateProfile
    //   });
    // } else {
    //   this.connector = new LocalConnector({
    //     createProfile: this.createProfile
    //   });
    // }
    //
    // await this.connector.initialize();

    this.passport = passport;
    this.passportId = 'local';

    this.passport.use(new Strategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // We want to have access to req below
      },
      (req, username, password, done) => {
        req.$ctx.call('auth.login', { username, password }).then(returnedData => {
          done(null, returnedData);
        }).catch(e => {
          console.error(e);
          done(null, false);
        });
      }
    ));

    const saveRedirectUrlMiddleware = (req, res, next) => {
      // Persist referer on the session to get it back after redirection
      // If the redirectUrl is already in the session, use it as default value
      req.session.redirectUrl =
        req.query.redirectUrl || (req.session && req.session.redirectUrl) || req.headers.referer || '/';
      next();
    };

    const sessionMiddleware = session({
      secret: this.settings.sessionSecret || 's€m@pps',
      maxAge: null
    });

    await this.broker.call('api.addRoute', {
      route: {
        path: '/auth/login',
        use: [
          sessionMiddleware,
          this.passport.initialize(),
          this.passport.session(),
          saveRedirectUrlMiddleware,
        ],
        aliases: {
          'GET /': [this.passport.authenticate(this.passportId, { session: false }), 'auth.login'],
          'POST /': [this.passport.authenticate(this.passportId, { session: false }), 'auth.login'],
          // 'GET /login': 'auth.login',
          // 'POST /login': 'auth.login'
        }
      },
    });
    //
    // await this.broker.call('api.addRoute', {
    //   route: {
    //     path: '/auth/logout',
    //     use: [sessionMiddleware, this.passport.initialize(), this.passport.session(), saveRedirectUrlMiddleware],
    //     aliases: {
    //       'GET /': this.connector.logout(),
    //     }
    //   },
    // });

    await this.broker.call('api.addRoute', {
      route: {
        path: '/auth/signup',
        aliases: {
          'POST /': 'auth.signup'
        }
      }
    });
  },
  methods: {
    // TODO refactor this to use Account
    // async findOrCreateProfile(profileData, authData) {
    //   let webId = await this.broker.call(
    //     'webid.findByEmail',
    //     { email: profileData.email },
    //     { meta: { webId: 'system' } }
    //   );
    //
    //   const newUser = !webId;
    //
    //   if (newUser) {
    //     if (!this.settings.registrationAllowed) {
    //       throw new Error('registration.not-allowed');
    //     }
    //     webId = await this.broker.call('webid.create', profileData);
    //     await this.broker.emit('auth.registered', { webId, profileData, authData });
    //   } else {
    //     await this.broker.call('webid.edit', profileData, { meta: { webId } });
    //     await this.broker.emit('auth.connected', { webId, profileData, authData });
    //   }
    //
    //   return { webId, newUser };
    // },
    // async createWebId(profileData, accountData) {
    //   // Create the webId with the profile information we have
    //   const webId = await this.broker.call('webid.create', { nick: username, email, ...profileData });
    //
    //   // Link the webId with the account
    //   await this.broker.call('auth.account.attachWebId', { accountUri: accountData['@id'], webId });
    //
    //   this.broker.emit('auth.registered', { webId, profileData, accountData });
    //
    //   return webId;
    // }
  },
  actions: {
    async signup(ctx) {
      const { username, email, password, ...profileData } = ctx.params;

      const accountData = await ctx.call('auth.account.create', { username, email, password });

      const webId = await ctx.call('webid.create', { nick: username, email, ...profileData });

      // Link the webId with the account
      await ctx.call('auth.account.attachWebId', { accountUri: accountData['@id'], webId });

      ctx.emit('auth.registered', { webId, profileData, accountData });

      // await ctx.call('ldp.resource.get', {
      //   resourceUri: webId,
      //   accept: MIME_TYPES.JSON,
      //   webId: 'system'
      // });

      const token = await ctx.call('auth.jwt.generateToken', { payload: { webId } });

      return({ token, newUser: true });
    },
    async login(ctx) {
      const { username, password } = ctx.params;

      const accountData = await ctx.call('auth.account.verify', { username, password });

      ctx.emit('auth.connected', { webId: accountData.webId });

      const token = await ctx.call('auth.jwt.generateToken', { payload: { webId: accountData.webId } });

      return({ token, newUser: true });
    },
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
      const userData = await ctx.call('ldp.resource.get', {
        resourceUri: webId,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });
      return await ctx.call('auth.jwt.generateToken', {
        payload: {
          webId,
          email: userData['foaf:email'],
          name: userData['foaf:name'],
          familyName: userData['foaf:familyName']
        }
      });
    }
  }
};
