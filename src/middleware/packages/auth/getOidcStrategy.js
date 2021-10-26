const { Issuer, Strategy } = require('openid-client');

const getOidcStrategy = async (settings) => {
  this.issuer = await Issuer.discover(settings.issuer);

  const client = new this.issuer.Client({
    client_id: settings.clientId,
    client_secret: settings.clientSecret,
    redirect_uri: settings.redirectUri,
    token_endpoint_auth_method: settings.clientSecret ? undefined : 'none'
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
      req.$ctx.call('auth.ssoLogin', { ssoData: userinfo })
        .then(returnedData => done(null, returnedData))
        .catch(e => {
          console.error(e);
          done(null, false);
        });
    }
  );
};

  // globalLogout(req, res, next) {
  //   // Redirect using NodeJS HTTP
  //   res.writeHead(302, {
  //     Location: `${this.issuer.end_session_endpoint}?post_logout_redirect_uri=${encodeURIComponent(
  //       req.session.redirectUrl
  //     )}`
  //   });
  //   res.end();
  // }

module.exports = getOidcStrategy;
