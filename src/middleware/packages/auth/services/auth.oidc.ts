import urlJoin from 'url-join';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'open... Remove this comment to see the full error message
import { Issuer, Strategy, custom } from 'openid-client';

import { ServiceSchema } from 'moleculer';
import AuthSSOMixin from '../mixins/auth.sso.ts';

custom.setHttpOptionsDefaults({
  timeout: 10000
});

const AuthOIDCService = {
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
    // OIDC-specific settings
    issuer: null,
    clientId: null,
    clientSecret: null
  },
  async created() {
    this.passportId = 'oidc';
  },
  methods: {
    async getStrategy() {
      const issuer = await Issuer.discover(this.settings.issuer);

      const client = new issuer.Client({
        client_id: this.settings.clientId,
        client_secret: this.settings.clientSecret,
        redirect_uri: urlJoin(this.settings.baseUrl, 'auth'),
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
        (req: any, tokenset: any, userinfo: any, done: any) => {
          req.$ctx
            .call('auth.loginOrSignup', { ssoData: userinfo })
            .then((loginData: any) => {
              done(null, loginData);
            })
            .catch((e: any) => {
              console.error(e);
              done(null, false);
            });
        }
      );
    }
  }
} satisfies ServiceSchema;

export default AuthOIDCService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      // @ts-expect-error TS(2717): Subsequent property declarations must have the sam... Remove this comment to see the full error message
      [AuthOIDCService.name]: typeof AuthOIDCService;
    }
  }
}
