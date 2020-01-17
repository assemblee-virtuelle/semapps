const { Issuer, Strategy } = require('openid-client');
const jose = require('node-jose');
const base64url = require('base64url');
const Connector = require('./Connector');

class OidcConnector extends Connector {
  constructor(settings) {
    super('oidc', {
      issuer: settings.issuer,
      clientId: settings.clientId,
      clientSecret: settings.clientSecret,
      publicKey: settings.publicKey,
      redirectUri: settings.redirectUri
    });
  }
  async verifyToken(token) {
    const key = await jose.JWK.asKey(this.settings.publicKey, 'pem');
    const verifier = jose.JWS.createVerify(key);
    await verifier.verify(token);

    const components = token.split('.');
    return JSON.parse(base64url.decode(components[1]));
  }
  async configurePassport(passport) {
    this.passport = passport;

    const issuer = await Issuer.discover(this.settings.issuer);
    const client = new issuer.Client({
      client_id: this.settings.clientId,
      client_secret: this.settings.clientSecret,
      redirect_uri: this.settings.redirectUri
    });
    const params = {
      // ... any authorization params override client properties
      // client_id defaults to client.client_id
      // redirect_uri defaults to client.redirect_uris[0]
      // response type defaults to client.response_types[0], then 'code'
      // scope defaults to 'openid'
    };

    passport.use(
      'oidc',
      new Strategy(
        {
          client,
          params
        },
        (tokenset, userinfo, done) => {
          userinfo.token = tokenset.access_token;
          done(null, userinfo);
        }
      )
    );
  }
  getLoginMiddlewares() {
    return [
      (req, res, next) => {
        // Push referer on the session to remind it after redirection
        req.session.referer = req.headers.referer;
        next();
      },
      this.passport.authenticate(this.passportId, {
        session: false
      }),
      (req, res) => {
        // Redirect browser to the referer pushed in session
        // Add the token to the URL so that the client may use it
        let referer = req.session.referer;
        let redirect_url = referer + '?token=' + res.req.user.token;
        res.redirect(redirect_url);
      }
    ];
  }
}

module.exports = OidcConnector;
