const express = require('express');
const router = new express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Repo = require('../models/repo');

const SALT_ROUNDS = 10;
const SECRET_KEY = 'secretKey';

// create new user
router.post('/users/create', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    User.findOne({ email }).then((user) => {
      if (user) {
        res.status(406).send({ message: 'Username is taken' });
      } else {
        bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
          const username = email.split('@')[0];
          const user = new User({
            email,
            username,
            password: hash,
            firstName,
            lastName,
          });
          const token = jwt.sign({ sub: user._id }, SECRET_KEY, {
            expiresIn: '1h',
          });

          user.save().then(() => {
            res.status(200).send({ token, username });
          });
        });
      }
    });
  } catch (err) {
    res.status(400).send({ message: 'Unable to create new user' });
  }
});

// login user
router.post('/users/login', (req, res) => {
  const { email } = req.body;
  try {
    User.findOne({ email })
      .then((user) => {
        bcrypt.compare(req.body.password, user.password).then((result) => {
          if (result) {
            const token = jwt.sign({ sub: user._id }, SECRET_KEY, {
              expiresIn: '1h',
            });
            res.status(200).send({ token, username: user.username });
          } else {
            res.status(400).send({ message: 'Invalid password' });
          }
        });
      })
      .catch((err) => res.status(400).send('Invalid username'));
  } catch (err) {
    res.status(400).send({ message: 'Unable to login user' });
  }
});

router.post('/users/logout', (req, res) => {
  // expire token in passport
  res.status(200).send({ message: 'Successfully logged out' });
});

// get user by jwt token
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { _id } = req.user;
    try {
      User.findById(_id)
        .select('username')
        .then((user) =>
          res.status(200).send({ message: `Authenticated as ${user.username}` })
        )
        .catch((err) =>
          res.status(400).send({ message: 'Unable to authenticate' })
        );
    } catch (err) {
      res.status(400).send({ message: 'Unable to authenticate' });
    }
  }
);

// get user repos
router.get(
  '/users/repos',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { _id } = req.user;
    try {
    } catch (err) {
      res.status(400).send({ message: 'Unable to get user repos' });
    }
  }
);

module.exports = router;
