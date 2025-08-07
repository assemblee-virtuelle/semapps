const redirectToFront = (req: any, res: any) => {
  // Redirect browser to the redirect URL pushed in session
  const redirectUrl = new URL(req.session.redirectUrl);
  if (req.user) {
    // If a token was stored, add it to the URL so that the client may use it
    if (req.user.token) redirectUrl.searchParams.set('token', req.user.token);
    redirectUrl.searchParams.set('new', req.user.newUser ? 'true' : 'false');
  }
  // Redirect using NodeJS HTTP
  res.writeHead(302, { Location: redirectUrl.toString() });
  res.end();
};

export default redirectToFront;
