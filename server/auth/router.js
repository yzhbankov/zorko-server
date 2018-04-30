const express = require('express');
const error = require('http-errors');
const passport = require('passport');

const db = require('./../../db');
const { userCreate } = require('./handlers');

const router = express.Router();

router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
    }),
    (req, res) => {
        console.log(req);
        res.send('Hello from login router');
    },
);

router.get('/logout', (req, res) => {
    res.send('Hello from logout router');
});

router.post('/sign_up', async (req, res, next) => {
    try {
        const { password, email } = req.body;

        if (!password || !email) {
            throw error(422, 'Should be specified password and email');
        }
        const usersCollection = db.get().collection('users');
        const userExist = await usersCollection.find({email}).toArray();

        if (userExist.length > 0) {
            throw error(422, 'User with this email already exist');
        }

        const newUser = await userCreate(password, email);

        res.send(newUser);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
