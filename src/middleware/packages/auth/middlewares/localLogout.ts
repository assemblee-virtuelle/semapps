const localLogout = (req, res, next) => {
  req.logout(); // Passport logout
  next();
};

export default localLogout;
