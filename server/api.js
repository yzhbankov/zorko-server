const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json({ limit: '100mb' }));

router.use('/user', require('./users/router'));
router.use('/auth', require('./auth/router'));
router.use('/schemas', passport.authenticate('jwt', { session: false }), require('./schemas/router'));

module.exports = router;
