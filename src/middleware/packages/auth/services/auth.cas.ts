import { Strategy } from 'passport-cas2';
import { Errors as E } from 'moleculer-web';
import AuthSSOMixin from '../mixins/auth.sso.ts';

const AuthCASService = {
  name: 'auth',
  mixins: [AuthSSOMixin],
  settings: {
    baseUrl: null,
    jwtPath: null,
    registrationAllowed: true,
    reservedUsernames: [],
    webIdSelection: [],
    // SSO-specific settings
    sessionSecret: 's€m@pps',
    selectSsoData: null,
    // Cas-specific settings
    casUrl: null
  },
  async created() {
    this.passportId = 'cas';
  },
  methods: {
    getStrategy() {
      return new Strategy(
        {
          casURL: this.settings.casUrl,
          passReqToCallback: true
        },
        (req, username, profile, done) => {
          req.$ctx
            .call('auth.loginOrSignup', { ssoData: { username, ...profile } })
            .then(loginData => {
              done(null, loginData);
            })
            .catch(e => {
              done(new E.UnAuthorizedError(e.message), false);
            });
        }
      );
    }
  }
};

export default AuthCASService;
