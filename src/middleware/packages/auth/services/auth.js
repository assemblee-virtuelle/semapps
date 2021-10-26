const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const AuthAccountService = require('./account');
const AuthJWTService = require('./jwt');
const {Errors: E} = require("moleculer-web");
const session = require("express-session");
const {Strategy} = require("passport-local");
const passport = require("passport");
const getOidcStrategy = require("../getOidcStrategy");

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
    const { baseUrl, oidc, cas } = this.settings;

    this.passport = passport;

    if( oidc.issuer ) {
      const oidcStrategy = await getOidcStrategy({ ...oidc, redirectUri: urlJoin(baseUrl, 'auth/login') });

      this.passportId = 'oidc';
      this.passport.use('oidc', oidcStrategy);
    } else {
      const localStrategy = new Strategy(
        {
          usernameField: 'username',
          passwordField: 'password',
          passReqToCallback: true // We want to have access to req below
        },
        (req, username, password, done) => {
          req.$ctx.call('auth.login', { username, password })
            .then(returnedData => {
              done(null, returnedData);
            })
            .catch(e => {
              console.error(e);
              done(null, false);
            });
        }
      );

      this.passportId = 'local';
      this.passport.use(localStrategy);
    }

    const saveRedirectUrlMiddleware = (req, res, next) => {
      // Persist referer on the session to get it back after redirection
      // If the redirectUrl is already in the session, use it as default value
      req.session.redirectUrl =
        req.query.redirectUrl || (req.session && req.session.redirectUrl) || req.headers.referer || '/';
      console.log('saveRedirectUrlMiddleware', req.session.redirectUrl);
      next();
    };

    const sessionMiddleware = session({
      secret: this.settings.sessionSecret || 's€m@pps',
      maxAge: null
    });

    const redirectToFront = (req, res) => {
      console.log('redirecttofront', req.user);
      // Redirect browser to the redirect URL pushed in session
      let redirectUrl = new URL(req.session.redirectUrl);
      if (req.user) {
        // If a token was stored, add it to the URL so that the client may use it
        if (req.user.token) redirectUrl.searchParams.set('token', req.user.token);
        redirectUrl.searchParams.set('new', req.user.newUser ? 'true' : 'false');
      }
      // Redirect using NodeJS HTTP
      res.writeHead(302, { Location: redirectUrl.toString() });
      res.end();
    }

    await this.broker.call('api.addRoute', {
      route: {
        path: '/auth/login', // Force to use this path ?
        use: [
          sessionMiddleware,
          this.passport.initialize(),
          this.passport.session(),
        ],
        aliases: {
          'GET /': [saveRedirectUrlMiddleware, this.passport.authenticate(this.passportId, { session: false }), redirectToFront],
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
    async ssoLogin(ctx) {
      let { ssoData } = ctx.params;

      const profileData = this.settings.oidc.selectSsoData ? await this.settings.oidc.selectSsoData(ssoData) : ssoData

      // TODO use UUID to identify unique accounts with SSO
      const existingAccounts = await ctx.call('auth.account.find', { query: { email: profileData.email } });

      let accountData, webId, newUser;
      if( existingAccounts.length > 0 ) {
        accountData = existingAccounts[0];
        webId = accountData.webId;
        newUser = false;

        // TODO update account with recent informations
        // await this.broker.call('webid.edit', profileData, { meta: { webId } });

        await this.broker.emit('auth.connected', { webId, profileData });
      } else {
        accountData = await ctx.call('auth.account.create', { uuid: profileData.uuid, email: profileData.email });
        webId = await ctx.call('webid.create', { nick: accountData.username, ...profileData });
        newUser = true;

        // Link the webId with the account
        await ctx.call('auth.account.attachWebId', { accountUri: accountData['@id'], webId });

        ctx.emit('auth.registered', { webId, profileData, accountData });
      }

      const token = await ctx.call('auth.jwt.generateToken', { payload: { webId: accountData.webId } });

      return({ token, newUser });
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
