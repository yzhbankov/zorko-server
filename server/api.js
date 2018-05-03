const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json({ limit: '100mb' }));

router.use('/users', require('./users/router'));
router.use('/auth', require('./auth/router'));
router.use('/specs', passport.authenticate('jwt', { session: false }), require('./specs/router'));

module.exports = router;
