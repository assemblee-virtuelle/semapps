const { Strategy } = require('passport-cas2');
const fs = require('fs');
const Connector = require('./Connector');

class CasConnector extends Connector {
  constructor(settings) {
    const privateKey = fs.readFileSync(settings.privateKeyPath);
    const publicKey = fs.readFileSync(settings.publicKeyPath);
    super('cas', {
      casUrl: settings.casUrl,
      privateKey,
      publicKey,
      userDataSelector: settings.userDataSelector,
      webIdGenerator: settings.webIdGenerator
    });
  }
  async configurePassport(passport) {
    this.passport = passport;

    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });

    passport.use(
      new Strategy(
        {
          casURL: this.settings.casUrl
        },
        (username, profile, done) => {
          // Select the information we want to keep
          // These information will be stored in the JWT
          done(null, this.settings.userDataSelector(profile));
        }
      )
    );
  }
}

module.exports = CasConnector;
