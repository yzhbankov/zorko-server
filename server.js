const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const api = require('./server/api');

const app = express();

app.use(bodyParser());
app.use(api);

app.listen(config.server.port, () => {
    console.log(`Zorko listening on port ${config.server.port}`);
});
