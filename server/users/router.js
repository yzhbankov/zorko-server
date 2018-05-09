const express = require('express');
const passport = require('passport');

const { getUsers, createUser, removeUser } = require('./handlers');

const router = express.Router();

router.get(['/', '/:login'], async (req, res, next) => {
    try {
        const login = req.params.login;
        const options = {
            limit: req.query.limit ? Number(req.query.limit) : 0,
            offset: req.query.offset ? Number(req.query.offset) : 0,
        };
        if (login) {
            const user = await getUsers(login, {});
            res.status(200).send(user);
        } else {
            const users = await getUsers(null, options);
            res.status(200).send(users);
        }
    } catch (err) {
        next(err);
    }
});

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const data = {
            email: req.body.email,
            password: req.body.password,
            admin: req.body.admin,
        };
        const user = await createUser(data);
        res.status(200).send(user);
    } catch (err) {
        next(err);

    }
});

router.delete('/:uid', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const user = await removeUser(uid);
        res.status(204).send(user);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
