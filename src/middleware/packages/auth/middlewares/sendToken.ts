const sendToken = (req: any, res: any) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ token: req.user.token, webId: req.user.webId, newUser: req.user.newUser }));
};

export default sendToken;
