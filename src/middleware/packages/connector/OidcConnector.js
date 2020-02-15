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

    this.issuer = await Issuer.discover(this.settings.issuer);
    const client = new this.issuer.Client({
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
  async getWebId(ctx) {
    return this.findUserByEmail(ctx, ctx.meta.tokenPayload.email);
  }
  async findUserByEmail(ctx, email) {
    const results = await ctx.call('triplestore.query', {
      query: `
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT ?webId
        WHERE {
          ?webId rdf:type foaf:Person ;
                 foaf:email "${email}" .
        }
      `,
      accept: 'ld+json'
    });

    return results.length > 0 ? results[0].webId.value : null;
  }
  globalLogout(req, res, next) {
    res.redirect(
      `${this.issuer.end_session_endpoint}?post_logout_redirect_uri=${encodeURIComponent(req.session.redirectUrl)}`
    );
    next();
  }
}

module.exports = OidcConnector;
