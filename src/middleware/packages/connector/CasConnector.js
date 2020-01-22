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
          done(null, {
            id: parseInt(profile.uid[0], 10),
            nick: profile.displayName,
            email: profile.mail[0],
            name: profile.field_first_name[0],
            familyName: profile.field_last_name[0]
          });
        }
      )
    );
  }
}

module.exports = CasConnector;
