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
      redirectUri: settings.redirectUri,
      selectProfileData: settings.selectProfileData,
      findOrCreateProfile: settings.findOrCreateProfile
    });
  }
  async verifyToken(token) {
    // TODO verify the token with the ĵsonwebtoken package
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
          done(null, { token: tokenset.access_token, ...userinfo });
        }
      )
    );
  }
}

module.exports = OidcConnector;
