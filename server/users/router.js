const express = require('express');

const { getUsers } = require('./handlers');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).send(users);
    } catch (err) {
        throw err;
    }
});

module.exports = router;
