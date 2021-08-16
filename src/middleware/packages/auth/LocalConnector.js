const { Strategy } = require('passport-local');
const Connector = require('./Connector');
const { MIME_TYPES } = require('@semapps/mime-types');

class LocalConnector extends Connector {
  constructor(settings) {
    super('local', settings);
  }
  async initialize() {
    this.localStrategy = new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // We want to have access to req below
      },
      (req, email, password, done) => {
        req.$ctx.call('auth.account.get', { email, password })
          .then(({ webId }) =>
            req.$ctx.call('ldp.resource.get', {
              resourceUri: webId,
              accept: MIME_TYPES.JSON,
              webId: 'system'
            })
          )
          .then(userData => done(null, userData))
          .catch(() => done(null, false));
      }
    );

    this.passport.use(this.localStrategy);
  }
  login() {
    return async (req, res) => {
      const middlewares = [
        this.saveRedirectUrl.bind(this),
        this.passport.authenticate(this.passportId, {
          session: false
        }),
        this.generateToken.bind(this),
        this.redirectToFront.bind(this)
      ];

      await this.runMiddlewares(middlewares, req, res);
    };
  }
  signup() {
    return async (req, res) => {
      const middlewares = [
        this.saveRedirectUrl.bind(this),
        this.createAccount.bind(this),
        this.generateToken.bind(this),
        this.redirectToFront.bind(this)
      ];

      await this.runMiddlewares(middlewares, req, res);
    };
  }
  createAccount(req, res, next) {
    const { email, password, ...profileData } = req.$params;
    req.$ctx.call('auth.account.exist', { email })
      .then(emailExist => {
        if( !emailExist ) {
          return req.$ctx.call('webid.create', profileData);
        } else {
          throw new Error('email.already.exists')
        }
      })
      .then(webId => {
        req.user = profileData;
        req.user.webId = webId;
        req.user.newUser = true;
        return req.$ctx.call('auth.account.create', {
          email,
          password,
          webId
        });
      })
      .then(() => next())
      .catch(e => this.sendError(res, req, e));
  }
}

module.exports = LocalConnector;
