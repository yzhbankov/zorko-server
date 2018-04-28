const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const api = require('./server/api');
const db = require('./db');

const app = express();

app.use(bodyParser());
app.use(api);

db.connect(config.db.url, (err) => {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    } else {
        app.listen(config.server.port, () => {
            console.log(`Zorko listening on port ${config.server.port}`);
        });
    }
});
