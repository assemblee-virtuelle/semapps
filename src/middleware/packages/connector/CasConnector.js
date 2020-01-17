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
      publicKey
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
        function(username, profile, done) {
          const token = this.generateToken({
            id: parseInt(profile.uid[0], 10),
            name: username,
            email: profile.mail[0]
          });
          done(null, { token });
        }
      )
    );
  }
  getLoginMiddlewares() {
    return [
      (req, res, next) => {
        // Push referer on the session to remind it after redirection
        req.session.referer = req.headers.referer;
        next();
      },
      this.passport.authenticate(this.passportId),
      (req, res) => {
        // Successful authentication, redirect back to client
        let referer = req.session.referer;
        let redirect_url = referer + '?token=' + req.user.token;
        res.redirect(redirect_url);
      }
    ];
  }
}

module.exports = CasConnector;
