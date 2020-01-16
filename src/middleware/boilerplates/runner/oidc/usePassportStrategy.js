const { Issuer, Strategy } = require('openid-client');
const CONFIG = require('../config');

async function usePassportStrategy(passport) {
  const issuer = await Issuer.discover(CONFIG.OIDC_ISSUER);
  const client = new issuer.Client({
    client_id: CONFIG.OIDC_CLIENT_ID,
    client_secret: CONFIG.OIDC_CLIENT_SECRET,
    redirect_uri: CONFIG.HOME_URL + 'auth'
  });
  const params = {
    // ... any authorization params overide client properties
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
        userinfo.accesstoken = tokenset.access_token;
        done(null, userinfo);
      }
    )
  );
}

module.exports = usePassportStrategy;
