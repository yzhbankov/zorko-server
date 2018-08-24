const express = require('express');
const passport = require('passport');

const router = express.Router();
const config = require('../config');

// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     return res.status(403)
//         .send({ error: { code: 'NOT_AUTHORIZED_SESSION' } });
// }

router.get('/auth', passport.authenticate('github', { scope: ['user:email'] }, () => {
    console.log('start auth with github');
}));

router.get('/account', (req, res) => {
    res.send({ user: req.user });
});

router.get(
    '/callback', passport.authenticate('github', { failureRedirect: `${config.client.url}\\failure-auth` }),
    (req, res) => {
        console.log('Redirect to zorko web app: ', req.sessionID, config.client.url);
        // Successful authentication, redirect home.
        res.redirect(config.client.url);
    },
);

module.exports = router;
