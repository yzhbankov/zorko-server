const express = require('express');
const passport = require('passport');
const handlers = require('./handlers');
const SpecReadCommand = require('./SpecReadCommand');
const logger = require('../logger');

const router = express.Router();

router.get(['/'], handlers.getSpecsHandler);
router.get('/:id', async (req, res) => {
    try {
        const { params, session: { context } } = req;
        const command = new SpecReadCommand({ context });
        const result = await command.run(params);
        res.json(result);
    } catch (e) {
        logger.error(e);
        // TODO: determine error code
        res.status(500).json({
            code: e.message,
        });
    }
});

router.post('/', passport.authenticate('jwt', { session: false }), handlers.createSpecHandler);
router.delete('/:uid', passport.authenticate('jwt', { session: false }), handlers.removeSpecHandler);

router.put('/:specUid/preview', passport.authenticate('jwt', { session: false }), handlers.addPreviewHandler);
router.get('/preview/:prevUid', handlers.getPreview);

module.exports = router;
