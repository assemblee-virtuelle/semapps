const { Strategy } = require('passport-local');
const Connector = require('./Connector');
const { MIME_TYPES } = require('@semapps/mime-types');

class LocalConnector extends Connector {
  constructor(settings) {
    super('local', settings || {});
  }
  async initialize() {
    this.localStrategy = new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // We want to have access to req below
      },
      (req, email, password, done) => {
        req.$ctx
          .call('auth.account.verify', { email, password })
          .then(({ webId }) =>
            req.$ctx.call('ldp.resource.get', {
              resourceUri: webId,
              accept: MIME_TYPES.JSON,
              webId: 'system'
            })
          )
          .then(userData => {
            req.$ctx.emit('auth.connected', { webId: userData.id, profileData: userData });
            done(null, { ...userData, webId: userData.id });
          })
          .catch(e => {
            console.error(e);
            done(null, false);
          });
      }
    );

    this.passport.use(this.localStrategy);
  }
  login() {
    return async (req, res) => {
      const middlewares = [
        this.passport.authenticate(this.passportId, {
          session: false
        }),
        this.generateToken.bind(this),
        this.sendToken.bind(this)
      ];

      await this.runMiddlewares(middlewares, req, res);
    };
  }
  signup() {
    return async (req, res) => {
      const middlewares = [this.createAccount.bind(this), this.generateToken.bind(this), this.sendToken.bind(this)];

      await this.runMiddlewares(middlewares, req, res);
    };
  }
  createAccount(req, res, next) {
    const { email, password, ...profileData } = req.$params;
    req.$ctx
      .call('auth.account.findByEmail', { email })
      .then(webId => {
        if (!webId) {
          return req.$ctx.call('webid.create', profileData);
        } else {
          throw new Error('email.already.exists');
        }
      })
      .then(webId =>
        req.$ctx.call('ldp.resource.get', {
          resourceUri: webId,
          accept: MIME_TYPES.JSON,
          webId: 'system'
        })
      )
      .then(userData => {
        req.user = userData;
        req.user.webId = userData.id;
        req.user.newUser = true;
        return req.$ctx.call('auth.account.create', {
          email,
          password,
          webId: userData.id
        });
      })
      .then(accountData => {
        req.$ctx.emit('auth.registered', { webId: accountData['semapps:webId'], profileData, accountData });
        next();
      })
      .catch(e => this.sendError(res, e.message));
  }
  sendToken(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ token: req.user.token, newUser: req.user.newUser }));
    next();
  }
  sendError(res, message, statusCode = 400) {
    res.writeHead(statusCode, message);
    res.end();
  }
}

module.exports = LocalConnector;
