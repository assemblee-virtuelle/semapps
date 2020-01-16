const { Strategy } = require('passport-cas2');
const CONFIG = require('../config');

async function configurePassport(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(
    new Strategy(
      {
        casURL: CONFIG.CAS_URL
      },
      function(username, profile, done) {
        // Keep in session the user information we will need
        done(null, {
          id: parseInt(profile.uid[0], 10),
          name: username,
          email: profile.mail[0]
        });
      }
    )
  );
}

module.exports = configurePassport;
