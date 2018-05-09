const error = require('http-errors');
const db = require('./../../db');

async function createSpec({ spec, title, createdBy, preview }) {
    try {
        const specsCollection = db.get().collection('specs');
        const now = new Date();
        const result = await specsCollection.insert({
            spec, title, createdBy, preview, createdAt: now, updatedAt: now,
        });

        return result.ops[0];
    } catch (err) {
        throw err;
    }

}

module.exports = {
    createSpec,
};
