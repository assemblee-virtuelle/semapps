const session = require('express-session');
const { Issuer, Strategy } = require('openid-client');
const AuthMixin = require('./auth');
const saveRedirectUrl = require('../middlewares/saveRedirectUrl');
const redirectToFront = require('../middlewares/redirectToFront');
const localLogout = require('../middlewares/localLogout');

const AuthSSOMixin = {
  mixins: [AuthMixin],
  settings: {
    baseUrl: null,
    jwtPath: null,
    registrationAllowed: true,
    reservedUsernames: [],
    // SSO-specific settings
    sessionSecret: 's€m@pps',
    selectSsoData: null
  },
  dependencies: ['api', 'webid'],
  actions: {
    async loginOrSignup(ctx) {
      let { ssoData } = ctx.params;

      const profileData = this.settings.selectSsoData ? await this.settings.selectSsoData(ssoData) : ssoData;

      // TODO use UUID to identify unique accounts with SSO
      const existingAccounts = await ctx.call('auth.account.find', { query: { email: profileData.email } });

      let accountData, webId, newUser;
      if (existingAccounts.length > 0) {
        accountData = existingAccounts[0];
        webId = accountData.webId;
        newUser = false;

        // TODO update account with recent information
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

      return { token, newUser };
    }
  },
  methods: {
    async getStrategy() {
      this.issuer = await Issuer.discover(this.settings.issuer);

      const client = new this.issuer.Client({
        client_id: this.settings.clientId,
        client_secret: this.settings.clientSecret,
        redirect_uri: this.settings.redirectUri,
        token_endpoint_auth_method: this.settings.clientSecret ? undefined : 'none'
      });

      const params = {
        // ... any authorization params override client properties
        // client_id defaults to client.client_id
        // redirect_uri defaults to client.redirect_uris[0]
        // response type defaults to client.response_types[0], then 'code'
        // scope defaults to 'openid'
      };

      return new Strategy(
        {
          client,
          params,
          passReqToCallback: true
        },
        (req, tokenset, userinfo, done) => {
          req.$ctx
            .call('auth.loginOrSignup', { ssoData: userinfo })
            .then(returnedData => {
              req.$params.tokenPayload = returnedData;
              done(null, returnedData);
            })
            .catch(e => {
              console.error(e);
              done(null, false);
            });
        }
      );
    },
    getApiRoutes() {
      const sessionMiddleware = session({ secret: this.settings.sessionSecret, maxAge: null });
      return [
        {
          path: '/auth/login', // Force to use this path ?
          use: [sessionMiddleware, this.passport.initialize(), this.passport.session()],
          aliases: {
            'GET /': [saveRedirectUrl, this.passport.authenticate(this.passportId, { session: false }), redirectToFront]
          }
        },
        {
          path: '/auth/logout',
          use: [sessionMiddleware, this.passport.initialize(), this.passport.session()],
          aliases: {
            // TODO handle global logout
            'GET /': [saveRedirectUrl, localLogout, redirectToFront]
          }
        }
      ];
    }
  }
};

module.exports = AuthSSOMixin;
