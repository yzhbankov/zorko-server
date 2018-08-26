const express = require('express');
const passport = require('passport');
const handlers = require('./handlers');
const SpecReadCommand = require('./SpecReadCommand');
const logger = require('../logger');

const router = express.Router();


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
        logger.log('error', err);
        // TODO: determine error code, return 400 if validation fails
        res.status(500).json({
            code: err.message,
        });
    }
};

router.get(['/'], handlers.getSpecsHandler);
router.get('/:id', makeRouterHandler(SpecReadCommand, req => ({ id: req.params.id })));

router.post('/', passport.authenticate('jwt', { session: false }), handlers.createSpecHandler);
router.delete('/:uid', passport.authenticate('jwt', { session: false }), handlers.removeSpecHandler);

router.put('/:specUid/preview', passport.authenticate('jwt', { session: false }), handlers.addPreviewHandler);
router.get('/preview/:prevUid', handlers.getPreview);

module.exports = router;
