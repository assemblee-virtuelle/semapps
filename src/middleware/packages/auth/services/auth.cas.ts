import { Strategy } from 'passport-cas2';
import { E as Errors } from 'moleculer-web';
import AuthSSOMixin from '../mixins/auth.sso.ts';
import { ServiceSchema } from 'moleculer';

const AuthCASService = {
  name: 'auth' as const,
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
} satisfies ServiceSchema;

export default AuthCASService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [AuthCASService.name]: typeof AuthCASService;
    }
  }
}
