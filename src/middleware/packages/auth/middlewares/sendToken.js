const sendToken = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ token: req.user.token, newUser: req.user.newUser }));
};

module.exports = sendToken;
