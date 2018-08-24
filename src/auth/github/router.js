const express = require('express');

const router = express.Router();
const config = require('../../config');
const logger = require('../../logger');
const passport = require('../../passport');

router.get('/sign-in', passport.authenticate('github'));

router.get('/callback', passport.authenticate('github', {
    failureRedirect: config.auth.zorkoWebAppUrl,
}), (req, res) => {
    logger.log('info', `Successfully return from github auth with sessionID=${req.sessionID}`);
    res.redirect(config.auth.zorkoWebAppUrl);
});

module.exports = router;
