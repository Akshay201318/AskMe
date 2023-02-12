const express = require('express');
const passport = require('passport');
require('../../config/passport-oauth2-strategy.js');

const router = express.Router();

const usersApi = require('../../controllers/api/usersApi');

router.post('/signup', usersApi.signUp);
router.post('/login', usersApi.login);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/signup',session: false }),
  usersApi.google
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/users/signup',session: false }),
  usersApi.facebook
);

router.post('/getUserData', passport.authenticate('jwt', { session: false }),usersApi.getUser);

module.exports = router;
