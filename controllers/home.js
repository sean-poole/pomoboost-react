const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.sendStatus(401);

    try {
      const foundUser = await User.findOne({ email: req.body.email });

      req.login(user, async(err) => {
        if (err) return next(err);
      });

      console.log(`Found user with email: ${foundUser}`);

      // Generate JWT.
      const accessToken = jwt.sign(
        { "email": foundUser.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Save Refresh Token to user object.
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      res.cookie("jwt", refreshToken, {
        http: true,
        maxAge: 25 * 60 * 60 * 1000,
        secure: true,
        sameSite: "None"
      });
      res.status(200).json({ accessToken, refreshToken });
    } catch(err) {
      next(err);
    }
  })(req, res, next);
}

exports.signup = async (req, res, next) => {
  const { username, password, confirmPassword } = req.body;
  let { email } = req.body;
  email = validator.normalizeEmail(email, {
    gmail_remove_dots: false
  });

  try {
    // Validate matching passwords.
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        msg: "Passwords do not match"
      });
    }
    // Validate unique username and email.
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        msg: "An account with that username already exists."
      });
    }
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        msg: "An account with that email address already exists."
      });
    }

    // Create new user.
    const user = new User({
      username: username,
      email: email,
      password: password
    });

    await user.save();

    // Log in upon successful account creation.
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(200).json({
        success: true,
        msg: "Account created. Logging in..."
      });
    });
  } catch(err) {
    next(err);
  }
}

exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.regenerate(err => {
      if (err) return next(err);
    });

    req.user = null;
    res.status(200).json({
      success: true,
      msg: "Logging out..."
    });
  });
}
