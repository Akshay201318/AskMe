const passportGoogle = require('passport');

const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');

const User = require('../models/user.model');

let baseUrl = 'http://localhost:5000';
      // baseUrl= 'https://mayihelpu.herokuapp.com';


passportGoogle.serializeUser(function(user, done) {
     done(null, user);
});
    
passportGoogle.deserializeUser(function(user, done) {
        done(null, user);
});


passportGoogle.use(
   new googleStrategy(
    {
      clientID:'483217679431-nokvlaejcsbddgbfvaqhbum5sfr330vm.apps.googleusercontent.com',
      clientSecret: 'az-TCdffr9VmKtm-cJRbR01t',
      callbackURL: `${baseUrl}/auth/googleCallback`,
      passReqToCallback   : true
    },
    (req, accessToken, refreshToken, profile, done) => {
        console.log("req >>>>>>>>>>>>>>>>>>", req);
      User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
        if (err) {
          console.log('Error in google authentication', errr);
          return;
        }
        if (user) {
          return done(null, user);
        } else {
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString('hex'),
            },
            (err, user) => {
              if (err) {
                console.log('Error in google authentication', errr);
                return;
              } else {
                return  done(null, user);
              }
            }
          );
        }
      });
    }
  )
);

module.exports = {
    passportGoogle
};
