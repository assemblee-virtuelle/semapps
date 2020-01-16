const passport = require('passport');

function getLoginMiddlewares() {
  return [
    (req, res, next) => {
      // Push referer on the session to remind it after redirection
      req.session.referer = req.headers.referer;
      next();
    },
    passport.authenticate('cas'),
    (req, res) => {
      console.log('req.user', req.user);
      // TODO generate JWT token with user information
      // Successful authentication, redirect back to client
      let referer = req.session.referer;
      let redirect_url = referer + '?token=' + res.req.user.id;
      res.redirect(redirect_url);
    }
  ];
}

module.exports = getLoginMiddlewares;
