const express = require('express');
const error = require('http-errors');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('./../../config');
const db = require('./../../db');
const { userCreate } = require('./handlers');

const router = express.Router();

router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
    }),
    (req, res) => {
        const token = jwt.sign(req.user, config.jwtsecret, { expiresIn: '1h' });
        return res.json({ user: req.user, token });
    },
);

router.get('/logout', (req, res) => {
    req.logout();
    res.send('You are logout');
});

router.post('/sign_up', async (req, res, next) => {
    try {
        const {
            email, password, login, firstName, lastName, avatarUrl,
        } = req.body;


        if (!password || !email || !login) {
            throw error(422, 'Should be specified password, email and login');
        }
        const usersCollection = db.get().collection('users');
        const usersExist = await usersCollection.find({ $or: [{ email }, { login }] }).toArray();

        if (usersExist.length > 0) {
            throw error(422, 'User with this email and login already exist');
        }

        const newUser = await userCreate(email, password, login, firstName, lastName, avatarUrl);

        res.send(newUser);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
