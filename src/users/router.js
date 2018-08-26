const express = require('express');
const makeRouterHandler = require('../util/makeRouterHandler');
const shouldAuthenticate = require('../util/shouldAuthenticate');
const UserListRead = require('./UserListRead');
const UserRead = require('./UserRead');
const UserLocalCreate = require('./UserLocalCreate');

const handlers = require('./handlers');

const router = express.Router();

router.get('/', makeRouterHandler(
    UserListRead,
    req => ({ offset: req.query.offset, limit: req.query.limit }),
));

router.get('/:login', makeRouterHandler(
    UserRead,
    req => ({ login: req.params.login }),
));

router.post('/', makeRouterHandler(
    UserLocalCreate,
    req => ({
        login: req.body.login,
        password: req.body.password,
        email: req.body.email,
    }),
));

router.delete('/:uid', shouldAuthenticate(), handlers.removeUserHandler);

module.exports = router;
