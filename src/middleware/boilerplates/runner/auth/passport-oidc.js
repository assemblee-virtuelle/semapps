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
    // ... any authorization params
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
        // console.log('OIDC CallBack success');
        userinfo.accesstoken = tokenset.access_token;
        done(null, userinfo);
      }
    )
  );

  // start authentication request
  // options [optional], extra authentication parameters

  app.get('/auth?app_referer=:app_referer', async function(req, res, next) {
    console.log('APP REFERER');
    next();
  });
  app.get('/auth', async function(req, res, next) {
    let referer = req.headers.referer;
    req.session.referer = referer;
    if (req.query.app_referer != undefined && req.query.app_referer != '' && req.query.app_referer != null) {
      // console.log('req.query.app_referer',req.query.app_referer);
      // referer=referer+'#'+req.query.app_referer;
      req.session.app_referer = req.query.app_referer;
    }

    // console.log('auth headers', req.session.referer, req.session.app_referer);
    next();
  });

  app.get(
    '/auth',
    passport.authenticate('oidc', {
      session: false
    })
  );

  app.get(
    '/auth/cb',
    passport.authenticate('oidc', {
      failureRedirect: '/',
      session: false
    }),
    (req, res) => {
      // console.log('ALLO');
      // console.log('/auth/cb',res,req);
      // console.log('req.session.referer',req.session.referer);
      let referer = req.session.referer || 'http://localhost:5000/';
      let redirect_url = referer + '?token=' + res.req.user.accesstoken;
      if (req.session.app_referer != undefined) {
        redirect_url = redirect_url + '#' + req.session.app_referer;
      }
      // console.log('callback referer', req.session.referer, req.session.app_referer)
      res.redirect(redirect_url);
    }
  );

  app.get('/auth/me', middlware_express_oidc, async function(req, res, next) {
    res.json({
      oidcPayload: req.oidcPayload,
      user: req.user
    });
  });
};
module.exports = addOidcLesCommunsPassportToApp;
