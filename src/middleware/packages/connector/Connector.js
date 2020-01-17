const jwt = require('jsonwebtoken');

class Connector {
  constructor(passportId, settings) {
    this.passportId = passportId;
    this.settings = settings;
  }
  generateToken(payload) {
    return jwt.sign(payload, this.settings.privateKey, { algorithm: 'RS256' });
  }
  async verifyToken(token) {
    try {
      return jwt.verify(token, this.settings.publicKey, { algorithms: ['RS256'] });
    } catch (err) {
      return false;
    }
  }
  getLoginMiddlewares() {
    return [
      (req, res, next) => {
        // Persist referer on the session to get it back after redirection
        req.session.redirectUrl = req.query.redirectUrl || req.headers.referer;
        next();
      },
      this.passport.authenticate(this.passportId, {
        session: false
      }),
      (req, res) => {
        // Redirect browser to the redirectUrl pushed in session
        // Add the token to the URL so that the client may use it
        const redirectUrl = req.session.redirectUrl;
        res.redirect(redirectUrl + '?token=' + res.req.user.token);
      }
    ];
  }
  async moleculerAuthenticate(ctx, route, req, res) {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (token) {
        const payload = await this.verifyToken(token);
        console.log('Token payload', payload);
        ctx.meta.tokenPayload = payload;
        return Promise.resolve(payload);
      } else {
        return Promise.resolve(null);
      }
    } catch (err) {
      console.log('Invalid token');
      return Promise.reject();
    }
  }
}

module.exports = Connector;
