const path = require('path');
const session = require('express-session');
const { MIME_TYPES } = require('@semapps/mime-types');
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
      const { ssoData } = ctx.params;

      const selectedSsoData = this.settings.selectSsoData ? await this.settings.selectSsoData(ssoData) : ssoData;

      // TODO use UUID to identify unique accounts with SSO
      const existingAccounts = await ctx.call('auth.account.find', { query: { email: selectedSsoData.email } });

      let webId;
      let newUser;

      if (existingAccounts.length > 0) {
        const [accountData] = existingAccounts;

        webId = accountData.webId;
        newUser = false;

        const webIdData = await ctx.call('webid.get', { resourceUri: webId, accept: MIME_TYPES.JSON });

        ctx.emit(
          'auth.connected',
          { webId, webIdData, accountData, ssoData },
          { meta: { webId: null, dataset: null } }
        );
      } else {
        if (!this.settings.registrationAllowed) throw new Error('registration.not-allowed');

        const accountData = await ctx.call('auth.account.create', {
          uuid: selectedSsoData.uuid,
          email: selectedSsoData.email,
          username: selectedSsoData.username
        });

        webId = await ctx.call(
          'webid.createWebId',
          this.pickWebIdData({ nick: accountData.username, ...selectedSsoData })
        );

        const webIdData = await ctx.call('webid.get', { resourceUri: webId, accept: MIME_TYPES.JSON });

        newUser = true;

        // Link the webId with the account
        await ctx.call('auth.account.attachWebId', { accountUri: accountData['@id'], webId });

        ctx.emit(
          'auth.registered',
          { webId, webIdData, accountData, ssoData },
          { meta: { webId: null, dataset: null } }
        );
      }

      const token = await ctx.call('auth.jwt.generateToken', { payload: { webId } });

      return { token, newUser };
    }
  },
  methods: {
    getApiRoutes(basePath) {
      const sessionMiddleware = session({ secret: this.settings.sessionSecret, maxAge: null });
      return [
        {
          path: path.join(basePath, '/auth'),
          name: 'auth',
          use: [sessionMiddleware, this.passport.initialize(), this.passport.session()],
          aliases: {
            'GET /': [saveRedirectUrl, this.passport.authenticate(this.passportId, { session: false }), redirectToFront]
          }
        },
        {
          path: path.join(basePath, '/auth/logout'),
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
