const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);//this id is the id generated by mongodb
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
})

passport.use(new GoogleStrategy(
  {
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "http://localhost:5001/auth/google/callback",
    passReqToCallback: true,
    proxy: true
  },
  async (request, accessToken, refreshToken, profile, done) => {

    const existingUser = await User.findOne({ googleId: profile.id })    //always async when we reach out our db
    if (existingUser) {
      //already exists
      return done(null, existingUser);
    }
    //new user
    const user = await new User({ googleId: profile.id }).save();
    done(null, user);
  }
)

);