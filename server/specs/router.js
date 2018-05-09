const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { createSpec } = require('./handlers');
const config = require('./../../config');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from specs router');
});

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
        const spec = {
            spec: req.body.spec ? req.body.spec : {},
            preview: null,
            title: req.body.title ? req.body.title : '',
            createdBy: decoded.email,
        };
        const newSpec = await createSpec(spec);
        res.status(200).send(newSpec);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
