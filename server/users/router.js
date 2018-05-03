const express = require('express');

const { getUsers, createUser } = require('./handlers');

const router = express.Router();

router.get(['/', '/:uid'], async (req, res) => {
    try {
        const uid = req.params.uid;
        const query = req.query;
        console.log('query', query);
        if (uid) {
            const user = await getUsers(uid);
            res.status(200).send(user);
        } else {
            const users = await getUsers();
            res.status(200).send(users);
        }
    } catch (err) {
        throw err;
    }
});

router.post('/', async (req, res) => {
    try {
        const data = {
            email: req.body.email,
            password: req.body.email,
            admin: req.body.admin,
        };
        const user = await createUser(data);
        res.status(200).send(user);
    } catch (err) {
        throw err;
    }
});

module.exports = router;
