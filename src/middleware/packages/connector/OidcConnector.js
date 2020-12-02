const { Issuer, Strategy } = require('openid-client');
const Connector = require('./Connector');

class OidcConnector extends Connector {
  constructor(settings) {
    const { issuer, clientId, clientSecret, ...otherSettings } = settings;
    super('oidc', {
      issuer,
      clientId,
      clientSecret,
      ...otherSettings
    });
  }
  async initialize() {
    this.issuer = await Issuer.discover(this.settings.issuer);
    let config = {
      client_id: this.settings.clientId,
      client_secret: this.settings.clientSecret,
      redirect_uri: this.settings.redirectUri,
      token_endpoint_auth_method: 'none'
    };
    if (!config.client_secret) {
      config.token_endpoint_auth_method = 'none';
    }
    const client = new this.issuer.Client(config);
    const params = {
      // ... any authorization params override client properties
      // client_id defaults to client.client_id
      // redirect_uri defaults to client.redirect_uris[0]
      // response type defaults to client.response_types[0], then 'code'
      // scope defaults to 'openid'
    };

    this.passport.use(
      'oidc',
      new Strategy(
        {
          client,
          params
        },
        (tokenset, userinfo, done) => {
          console.log('XXXXXXXX OIDC login : ', tokenset, userinfo);
          done(null, userinfo);
        }
      )
    );
  }
  globalLogout(req, res, next) {
    // Redirect using NodeJS HTTP
    res.writeHead(302, {
      Location: `${this.issuer.end_session_endpoint}?post_logout_redirect_uri=${encodeURIComponent(
        req.session.redirectUrl
      )}`
    });
    res.end();
  }
}

module.exports = OidcConnector;
