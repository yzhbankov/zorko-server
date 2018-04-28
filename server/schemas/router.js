const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from schemas router')
});

module.exports = router;
