const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const config = require('../config');
const handlers = require('./handlers');

// TODO: sync up with '/auth/account'
router.post('/local/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    const token = jwt.sign(req.user, config.jwtsecret, { expiresIn: '1h' });
    return res.json({ user: req.user, token });
});

router.get('/account', handlers.ensureAuthenticated, (req, res) => {
    res.send({user: req.user});
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send('You are logout');
});

router.post('/local/sign-in', handlers.signUpHandler);

router.use('/github', require('./github/router'));

module.exports = router;
