const { Strategy } = require('passport-local');
const AuthMixin = require('../mixins/auth');
const sendToken = require('../middlewares/sendToken');
const { MoleculerError } = require('moleculer').Errors;
const AuthMailService = require('../services/mail');

const AuthLocalService = {
  name: 'auth',
  mixins: [AuthMixin],
  settings: {
    baseUrl: null,
    jwtPath: null,
    registrationAllowed: true,
    reservedUsernames: [],
    webIdSelection: [],
    accountSelection: [],
    formUrl: null,
    mail: {
      from: null,
      transport: {
        host: null,
        port: null
      },
      defaults: {
        locale: null,
        frontUrl: null
      }
    }
  },
  async created() {
    const { mail } = this.settings;

    this.passportId = 'local';

    await this.broker.createService(AuthMailService, {
      settings: {
        ...mail
      }
    });
  },
  actions: {
    async signup(ctx) {
      const { username, email, password, ...rest } = ctx.params;

      let accountData = await ctx.call('auth.account.create', {
        username,
        email,
        password,
        ...this.pickAccountData(rest)
      });

      const profileData = { nick: username, email, ...rest };
      const webId = await ctx.call('webid.create', this.pickWebIdData(profileData));

      // Link the webId with the account
      accountData = await ctx.call('auth.account.attachWebId', { accountUri: accountData['@id'], webId });

      ctx.emit('auth.registered', { webId, profileData, accountData }, { meta: { webId: null, dataset: null } });

      const token = await ctx.call('auth.jwt.generateToken', { payload: { webId } });

      return { token, webId, newUser: true };
    },
    async login(ctx) {
      const { username, password } = ctx.params;

      const accountData = await ctx.call('auth.account.verify', { username, password });

      ctx.emit('auth.connected', { webId: accountData.webId, accountData }, { meta: { webId: null, dataset: null } });

      const token = await ctx.call('auth.jwt.generateToken', { payload: { webId: accountData.webId } });

      return { token, webId: accountData.webId, newUser: false };
    },
    async logout(ctx) {
      ctx.meta.$statusCode = 302;
      ctx.meta.$location = ctx.params.redirectUrl || this.settings.formUrl;
    },
    async redirectToForm(ctx) {
      if (this.settings.formUrl) {
        const formUrl = new URL(this.settings.formUrl);
        if (ctx.params) {
          for (let [key, value] of Object.entries(ctx.params)) {
            formUrl.searchParams.set(key, value);
          }
        }
        ctx.meta.$statusCode = 302;
        ctx.meta.$location = formUrl.toString();
      } else {
        throw new Error('No formUrl defined in auth.local settings')
      }
    },
    async resetPassword(ctx) {
      const { email } = ctx.params;

      const account = await ctx.call('auth.account.findByEmail', { email });

      if (!account) {
        throw new Error('email.not.exists');
      }

      const token = await ctx.call('auth.account.generateResetPasswordToken', { webId: account.webId });

      await ctx.call('auth.mail.sendResetPasswordEmail', {
        account,
        token
      });
    },
    async setNewPassword(ctx) {
      const { email, token, password } = ctx.params;

      const account = await ctx.call('auth.account.findByEmail', { email });

      if (!account) {
        throw new Error('email.not.exists');
      }

      await ctx.call('auth.account.setNewPassword', { webId: account.webId, token, password });
    }
  },
  methods: {
    getStrategy() {
      return new Strategy(
        {
          usernameField: 'username',
          passwordField: 'password',
          passReqToCallback: true // We want to have access to req below
        },
        (req, username, password, done) => {
          req.$ctx
            .call('auth.login', { username, password })
            .then(returnedData => {
              done(null, returnedData);
            })
            .catch(e => {
              console.error(e);
              done(new MoleculerError(e.message, 401), false);
            });
        }
      );
    },
    getApiRoutes() {
      const loginRoute = {
        path: '/auth/login',
        name: 'auth-login',
        use: [this.passport.initialize()],
        aliases: {
          'POST /': [this.passport.authenticate(this.passportId, { session: false }), sendToken]
        }
      };

      const logoutRoute = {
        path: '/auth/logout',
        name: 'auth-logout',
        aliases: {
          'GET /': 'auth.logout'
        }
      };

      const signupRoute = {
        path: '/auth/signup',
        name: 'auth-signup',
        aliases: {
          'POST /': 'auth.signup'
        }
      };

      const formRoute = {
        path: '/auth',
        name: 'auth',
        aliases: {
          'GET /': 'auth.redirectToForm'
        }
      };

      const resetPasswordRoute = {
        path: '/auth/reset_password',
        name: 'auth-reset-password',
        aliases: {
          'POST /': 'auth.resetPassword'
        }
      };
      const setNewPasswordRoute = {
        path: '/auth/new_password',
        name: 'auth-new-password',
        aliases: {
          'POST /': 'auth.setNewPassword'
        }
      };

      const accountSettingsRoute = {
        path: '/auth/account',
        name: 'auth-account',
        aliases: {
          'GET /': 'auth.account.findSettingsByWebId',
          'POST /': 'auth.account.updateAccountSettings'
        },
        authorization: true
      };

      const routes = [loginRoute, logoutRoute, formRoute, resetPasswordRoute, setNewPasswordRoute, accountSettingsRoute];

      if (this.settings.registrationAllowed) {
        return [...routes, signupRoute];
      }

      return routes;
    }
  }
};

module.exports = AuthLocalService;
