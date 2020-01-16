const passport = require('passport');

function getLoginMiddlewares() {
  return [
    (req, res, next) => {
      // Push referer on the session to remind it after OIDC redirection
      req.session.referer = req.headers.referer;
      next();
    },
    passport.authenticate('oidc', {
      session: false
    }),
    (req, res) => {
      // Redirect browser to the referer pushed in session
      // Add the token to the URL so that the client may use it
      let referer = req.session.referer;
      let redirect_url = referer + '?token=' + res.req.user.accesstoken;
      res.redirect(redirect_url);
    }
  ];
}

module.exports = getLoginMiddlewares;
