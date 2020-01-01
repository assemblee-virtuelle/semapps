const passport = require('passport');
const CasStrategy = require('passport-cas2').Strategy;
const session = require('express-session');
const express = require('express');

const cas = new CasStrategy(
  {
    casURL: 'https://monprofil.colibris-lemouvement.org/cas'
  },
  function(username, profile, done) {
    console.log('user found', {
      id: parseInt(profile.uid[0], 10),
      name: username,
      email: profile.mail[0]
    });
    // TODO create or find user based on his email address
    done(null, username);
  }
);
passport.use(cas);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const app = express();
app.use(session({ secret: 'my-secret' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Logged in as ' + req.user);
});

app.get('/cas/login', passport.authenticate('cas'), function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

app.get('/cas/logout', function(req, res) {
  var returnURL = 'http://localhost:3000/';
  cas.logout(req, res, returnURL);
});

app.listen(3000);
