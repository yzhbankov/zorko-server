const express = require('express');
const passport = require('passport');

const handlers = require('./handlers');

const router = express.Router();

router.get(['/', '/:uid'], handlers.getSpecsHandler);

router.post('/', passport.authenticate('jwt', { session: false }), handlers.createSpecHandler);

router.delete('/:uid', passport.authenticate('jwt', { session: false }), handlers.removeSpecHandler);

router.put('/:uid/preview', passport.authenticate('jwt', { session: false }), handlers.addPreviewHandler);

router.get('/preview/:uid', handlers.getPreview);

module.exports = router;
