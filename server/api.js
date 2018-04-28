const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json({ limit: '100mb' }));

router.use('/user', require('./users/router'));
router.use('/login', require('./login/router'));
router.use('/schemas', require('./schemas/router'));

module.exports = router;
