const session = require('express-session');
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
    webIdSelection: [],
    // SSO-specific settings
    sessionSecret: 's€m@pps',
    selectSsoData: null
  },
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
        // await ctx.call('webid.edit', profileData, { meta: { webId } });

        ctx.emit('auth.connected', { webId, accountData, ssoData }, { meta: { webId: null, dataset: null } });
      } else {
        if (!this.settings.registrationAllowed) {
          throw new Error('registration.not-allowed');
        }

        accountData = await ctx.call('auth.account.create', {
          uuid: profileData.uuid,
          email: profileData.email,
          username: profileData.username
        });
        webId = await ctx.call('webid.create', this.pickWebIdData({ nick: accountData.username, ...profileData }));
        newUser = true;

        // Link the webId with the account
        await ctx.call('auth.account.attachWebId', { accountUri: accountData['@id'], webId });

        ctx.emit(
          'auth.registered',
          { webId, profileData, accountData, ssoData },
          { meta: { webId: null, dataset: null } }
        );
      }

      const token = await ctx.call('auth.jwt.generateToken', { payload: { webId } });

      return { token, newUser };
    }
  },
  methods: {
    getApiRoutes() {
      const sessionMiddleware = session({ secret: this.settings.sessionSecret, maxAge: null });
      return [
        {
          path: '/auth',
          name: 'auth',
          use: [sessionMiddleware, this.passport.initialize(), this.passport.session()],
          aliases: {
            'GET /': [saveRedirectUrl, this.passport.authenticate(this.passportId, { session: false }), redirectToFront]
          }
        },
        {
          path: '/auth/logout',
          name: 'auth-logout',
          use: [sessionMiddleware, this.passport.initialize(), this.passport.session()],
          aliases: {
            'GET /': [saveRedirectUrl, localLogout, redirectToFront]
          }
        }
      ];
    }
  }
};

module.exports = AuthSSOMixin;
