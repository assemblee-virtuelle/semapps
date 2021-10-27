const urlJoin = require('url-join');
const { Issuer, Strategy } = require('openid-client');
const AuthSSOMixin = require('../mixins/auth.sso');

const AuthOIDCService = {
  name: 'auth',
  mixins: [AuthSSOMixin],
  settings: {
    baseUrl: null,
    jwtPath: null,
    registrationAllowed: true,
    reservedUsernames: [],
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
    this.issuer = await Issuer.discover(this.settings.issuer);
  },
  methods: {
    getStrategy() {
      const client = new this.issuer.Client({
        client_id: this.settings.clientId,
        client_secret: this.settings.clientSecret,
        redirect_uri: urlJoin(this.settings.baseUrl, 'auth/login'),
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
            .then(loginData => {
              done(null, loginData);
            })
            .catch(e => {
              console.error(e);
              done(null, false);
            });
        }
      );
    }
  }
};

module.exports = AuthOIDCService;
