const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');

//Routes
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) res.send('No User Exists');
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send('Successfully Authenticated');
        console.log(req.user);
      });
    }
  })(req, res, next);
});

router.post('/register', (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send('User Already Exists');
    if (!doc) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hashPassword,
      });
      await newUser.save();
      res.send('User created!');
    }
  });
});

router.get('/user', (req, res) => {
  console.log(req.user);
});

module.exports = router;
