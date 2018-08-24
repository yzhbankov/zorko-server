const express = require('express');
const jwt = require('jsonwebtoken');
const handlers = require('./handlers');
const config = require('../config');

const router = express.Router();

router.get('/profile', handlers.ensureAuthenticated, (req, res) => {
    const token = jwt.sign(req.user, config.auth.jwtsecret, { expiresIn: config.auth.jwtExpireTime });
    return res.json({ user: req.user, token });
});
// TODO: add post to obtain profile object by token which persisted on client

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(config.auth.zorkoWebAppUrl);
});

router.post('/local/sign-in', handlers.signUpHandler);

router.use('/github', require('./github/router'));

module.exports = router;
