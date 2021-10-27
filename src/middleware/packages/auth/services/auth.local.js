const { Strategy } = require('passport-local');
const AuthMixin = require("../mixins/auth");
const sendToken = require("../middlewares/sendToken");

const AuthLocalService = {
  name: 'auth',
  mixins: [AuthMixin],
  settings: {
    baseUrl: null,
    jwtPath: null,
    registrationAllowed: true,
    reservedUsernames: []
  },
  dependencies: ['api', 'webid'],
  created() {
    this.passportId = 'local';
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
          req.$ctx.call('auth.login', {username, password})
            .then(returnedData => {
              done(null, returnedData);
            })
            .catch(e => {
              console.error(e);
              done(null, false);
            });
        }
      )
    },
    getApiRoutes() {
      return([
        {
          path: '/auth/login',
          use: [
            this.passport.initialize(),
          ],
          aliases: {
            'POST /': [this.passport.authenticate(this.passportId, { session: false }), sendToken],
          }
        },
        {
          path: '/auth/signup',
          aliases: {
            'POST /': 'auth.signup'
          }
        }
      ])
    }
  }
};

module.exports = AuthLocalService;
