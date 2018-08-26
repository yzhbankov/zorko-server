const express = require('express');
const passport = require('passport');
const handlers = require('./handlers');
const SpecRead = require('./SpecRead');
const SpecListRead = require('./SpecListRead');
const SpecCreate = require('./SpecCreate');
const logger = require('../logger');

const router = express.Router();

const shouldAuthenticate = passport.authenticate('jwt', { session: false });

const makeRouterHandler = (Command, mapToParams) => async (req, res) => {
    try {
        const { session: { context } } = req;
        const command = new Command({ context });
        const result = await command.run(mapToParams(req));
        if (result) {
            res.json(result);
        } else {
            result.status(404).json({ code: 'NOT_FOUND' });
        }
    } catch (err) {
        if (err.code === 'FORMAT_ERROR') {
            const data = err.toHash();
            logger.log('error', ` code: ${data.code}\\n fields: ${data.fields}`);
            res.status(400).json(data);
        } else {
            logger.log('error', ` message: ${err.message} stack: ${err.stack}`);
            res.status(500).json({
                message: err.message,
            });
        }
    }
};

router.get('/', makeRouterHandler(SpecListRead, req => ({
    limit: req.query.limit,
    offset: req.query.offset,
})));
router.get('/:id', makeRouterHandler(SpecRead, req => ({ id: req.params.id })));

router.post('/', shouldAuthenticate, makeRouterHandler(SpecCreate, req => ({
    ...req.body,
    createdBy: {
        login: req.user.login,
    },
})));
router.delete('/:uid', shouldAuthenticate, handlers.removeSpecHandler);

router.put('/:specUid/preview', shouldAuthenticate, handlers.addPreviewHandler);
router.get('/preview/:prevUid', handlers.getPreview);

module.exports = router;
