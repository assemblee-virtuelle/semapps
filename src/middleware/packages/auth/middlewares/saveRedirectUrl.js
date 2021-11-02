const saveRedirectUrl = (req, res, next) => {
  // Persist referer on the session to get it back after redirection
  // If the redirectUrl is already in the session, use it as default value
  req.session.redirectUrl =
    req.query.redirectUrl || (req.session && req.session.redirectUrl) || req.headers.referer || '/';
  next();
};

module.exports = saveRedirectUrl;
