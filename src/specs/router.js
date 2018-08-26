const express = require('express');
const handlers = require('./handlers');
const makeRouterHandler = require('../util/makeRouterHandler');
const SpecRead = require('./SpecRead');
const SpecListRead = require('./SpecListRead');
const SpecCreate = require('./SpecCreate');
const shouldAuthenticate = require('../util/shouldAuthenticate');

const router = express.Router();

router.get('/', makeRouterHandler(SpecListRead, req => ({
    limit: req.query.limit,
    offset: req.query.offset,
})));
router.get('/:id', makeRouterHandler(SpecRead, req => ({ id: req.params.id })));

router.post('/', shouldAuthenticate(), makeRouterHandler(SpecCreate, req => ({
    ...req.body,
    createdBy: {
        login: req.user.login,
    },
})));
router.delete('/:uid', shouldAuthenticate(), handlers.removeSpecHandler);

router.put('/:specUid/preview', shouldAuthenticate(), handlers.addPreviewHandler);
router.get('/preview/:prevUid', handlers.getPreview);

module.exports = router;
