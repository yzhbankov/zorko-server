const express = require('express');
const passport = require('passport');
const makeRouterHandler = require('../util/makeRouterHandler');
const UserListRead = require('./UserListRead');

const handlers = require('./handlers');

const router = express.Router();

router.get('/', makeRouterHandler(
    UserListRead,
    req => ({ offset: req.query.offset, limit: req.query.limit }),
));
router.get('/:login', handlers.getUsersHandler);
router.post('/', passport.authenticate('jwt', { session: false }), handlers.createUserHandler);
router.delete('/:uid', passport.authenticate('jwt', { session: false }), handlers.removeUserHandler);

module.exports = router;
