const express = require('express');

const { getUsers, createUser, removeUser } = require('./handlers');

const router = express.Router();

router.get(['/', '/:uid'], async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const options = {
            limit: req.query.limit ? Number(req.query.limit) : 0,
            offset: req.query.offset ? Number(req.query.offset) : 0,
        };
        if (uid) {
            const user = await getUsers(uid);
            res.status(200).send(user);
        } else {
            const users = await getUsers(null, options);
            res.status(200).send(users);
        }
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const data = {
            email: req.body.email,
            password: req.body.email,
            admin: req.body.admin,
        };
        const user = await createUser(data);
        res.status(200).send(user);
    } catch (err) {
        next(err);

    }
});

router.delete('/:uid', async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const user = await removeUser(uid);
        res.status(204).send(user);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
