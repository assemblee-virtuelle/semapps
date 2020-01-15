const Issuer = require('openid-client').Issuer;
const Strategy = require('openid-client').Strategy;
const passport = require('passport');
const base64url = require('base64url');
const fs = require('fs');
const jose = require('node-jose');
const middlware_express_oidc = require('./middlware-express-oidc.js');
const request = require('request');

let addOidcLesCommunsPassportToApp = async function(app, options) {
  // let config = require("../../../configuration.js")
  console.log(options);

  let lesCommunsIssuer = await Issuer.discover(options.OIDC.issuer);
  // console.log('Les Communs Discovered issuer %s', JSON.stringify(lesCommunsIssuer));
  const client = new lesCommunsIssuer.Client({
    client_id: options.OIDC.client_id, // Data Food Consoritum in Hex
    client_secret: options.OIDC.client_secret,
    redirect_uri: options.OIDC.redirect_uri
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
        console.log('FIRST CALLBACH');
        userinfo.accesstoken = tokenset.access_token;
        done(null, userinfo);
      }
    )
  );

  //Push referer on the session to remind it after OIDC redirections
  app.get('/auth', async function(req, res, next) {
    req.session.referer = req.headers.referer;
    next();
  });

  //OIDC Strategy using -> call OIDC Server
  app.get(
    '/auth',
    passport.authenticate('oidc', {
      session: false
    })
  );

  //Url of redirect_uri. Server redirect browser to the referer pushed in session. token provide to browser by url.
  app.get(
    '/auth/cb',
    passport.authenticate('oidc', {
      failureRedirect: '/',
      session: false
    }),
    (req, res) => {
      let referer = req.session.referer || 'http://localhost:5000/';
      let redirect_url = referer + '?token=' + res.req.user.accesstoken;
      res.redirect(redirect_url);
    }
  );

  //API to obtain authentification and identification informations. Use middlware_express_oidc as all protected API which fill oidcPayload (authentification) and user (identification)
  console.log('options.OIDC.public_key', options.OIDC.public_key);
  app.get('/auth/me', middlware_express_oidc({ public_key: options.OIDC.public_key }), async function(req, res, next) {
    res.json({
      oidcPayload: req.oidcPayload,
      user: req.user
    });
  });
};
module.exports = addOidcLesCommunsPassportToApp;
