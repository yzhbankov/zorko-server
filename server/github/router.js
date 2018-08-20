const express = require('express');
const passport = require('passport');

const router = express.Router();
const config = require('./../../config');


router.get('/auth', passport.authenticate('github', () => {
    console.log('start auth with github');
}));

router.get(
    '/callback', passport.authenticate('github', { failureRedirect: `${config.client.url}\\failure-auth` }),
    (req, res) => {
        console.log('Redirect to zorko web app: ', req.sessionID, config.client.url);
        // Successful authentication, redirect home.
        res.redirect(config.client.url);
    },
);

module.exports = router;
