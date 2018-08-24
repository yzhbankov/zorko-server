const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json({ limit: '10mb' }));

router.use('/api/auth', require('../auth/router'));
router.use('/api/users', require('../users/router'));
router.use('/api/specs', require('../specs/router'));

module.exports = router;
