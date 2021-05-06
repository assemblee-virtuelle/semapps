const { Strategy } = require('passport-cas2');
const Connector = require('./Connector');

class CasConnector extends Connector {
  constructor(settings) {
    const { casUrl, ...otherSettings } = settings;
    super('cas', {
      casUrl,
      ...otherSettings
    });
  }
  async initialize() {
    this.passport.serializeUser(function(user, done) {
      done(null, user);
    });

    this.passport.deserializeUser(function(user, done) {
      done(null, user);
    });

    this.casStrategy = new Strategy(
      {
        casURL: this.settings.casUrl
      },
      (username, profile, done) => {
        done(null, profile);
      }
    );

    this.passport.use(this.casStrategy);
  }
  globalLogout(req, res, next) {
    // We access directly the `cas` object in order to set the doRedirect parameter as false
    // and redirect to /cas/logout?url={redirectUrl} instead of/cas/logout?service={redirectUrl}
    // https://github.com/appdevdesigns/passport-cas/blob/master/lib/passport-cas.js#L264
    this.casStrategy.cas.logout(req, res, req.session.redirectUrl, false);
  }
}

module.exports = CasConnector;
