const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');
const router = express.Router();
require('../config/passport-config')

// routes
router.post("/login", passport.authenticate('local'))

router.post("/signup", async (req, res) => {
  // import data form request
  const { name, username, password } = req.body;

  // check if a user already exists with the username or email
  const validationErrors = [];

  const userFound = await User.findOne({ username });
  if (userFound) validationErrors.push("Username Taken. Try again.");
  if (!password) validationErrors.push("Password required.");
  if (!name) validationErrors.push("Name required.");

  if (validationErrors.length > 0) {
    return res.status(400).json({
      message: validationErrors.join(" "),
      success: false,
    });
  }

  // encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);

  // if not exist, save the user to db
  const newUser = await User.create({
    name,
    username,
    password: hashedPassword,
  });

  // respond with the success message and user in json
  res.status(200).json({
    message: "User Created.",
    success: true,
    user: newUser,
  });
});

module.exports = router;