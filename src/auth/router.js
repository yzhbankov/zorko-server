const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const config = require('../config');
const handlers = require('./handlers');

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    const token = jwt.sign(req.user, config.jwtsecret, { expiresIn: '1h' });
    return res.json({ user: req.user, token });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send('You are logout');
});

router.post('/sign_up', handlers.signUpHandler);

module.exports = router;
