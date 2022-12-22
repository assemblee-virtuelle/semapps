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
        use: [this.passport.initialize()],
        aliases: {
          'POST /': [this.passport.authenticate(this.passportId, { session: false }), sendToken]
        }
      };

      const signupRoute = {
        path: '/auth/signup',
        aliases: {
          'POST /': 'auth.signup'
        }
      };

      const resetPasswordRoute = {
        path: '/auth/reset_password',
        aliases: {
          'POST /': 'auth.resetPassword'
        }
      };
      const setNewPasswordRoute = {
        path: '/auth/new_password',
        aliases: {
          'POST /': 'auth.setNewPassword'
        }
      };

      const accountSettingsRoute = {
        path: '/auth/account',
        aliases: {
          'GET /': 'auth.account.findSettingsByWebId',
          'POST /': 'auth.account.updateAccountSettings'
        },
        authorization: true
      };

      const routes = [loginRoute, resetPasswordRoute, setNewPasswordRoute, accountSettingsRoute];

      if (this.settings.registrationAllowed) {
        return [...routes, signupRoute];
      }

      return routes;
    }
  }
};

module.exports = AuthLocalService;
