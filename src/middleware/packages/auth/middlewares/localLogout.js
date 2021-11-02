const localLogout = (req, res, next) => {
  req.logout(); // Passport logout
  next();
};

module.exports = localLogout;
