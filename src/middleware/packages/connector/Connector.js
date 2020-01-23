const jwt = require('jsonwebtoken');
const E = require('moleculer-web').Errors;

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
        // If the redirectUrl is already in the session, keep it as is
        req.session.redirectUrl = req.session.redirectUrl || req.query.redirectUrl || req.headers.referer;
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
  // See https://moleculer.services/docs/0.13/moleculer-web.html#Authentication
  async authenticate(ctx, route, req, res) {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (token) {
        const payload = await this.verifyToken(token);
        ctx.meta.tokenPayload = payload;
        return Promise.resolve(payload);
      } else {
        return Promise.resolve(null);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  // See https://moleculer.services/docs/0.13/moleculer-web.html#Authorization
  async authorize(ctx, route, req, res) {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (token) {
        ctx.meta.tokenPayload = await this.verifyToken(token);
        return Promise.resolve(ctx);
      } else {
        return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
      }
    } catch (err) {
      return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
    }
  }
}

module.exports = Connector;
