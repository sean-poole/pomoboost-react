const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
require("dotenv").config();

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email.toLowerCase() })
        .exec()
        .then(async (user) => {
          if (!user) {
            return done(null, false, { msg: "Email not found." });
          }
          if (!user.password) {
            return done(null, false, { msg: "Password not found." });
          }

          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            return done(null, user);
          }

          return done(null, false, { msg: "Invalid email or password." });
        })
        .catch((err) => {
          return done(err);
        });
    })
  );

  // JWT Strategy for token authentication
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
  }

  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await User.findOne({ email: payload.email });
        // console.log(`JWT`, user)
        if (user) {
          return done(null, user);
        }

        return done(null, false);
      } catch(err) {
        return done(err, false);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    }
  });
}
