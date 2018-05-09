const error = require('http-errors');
const db = require('./../../db');
const ObjectId = require('mongodb').ObjectID;

const { findUserByEmailOrUid, setSpecsToUser } = require('./../users/handlers');

async function createSpec({ spec, title, createdBy, preview }) {
    try {
        const specsCollection = db.get().collection('specs');
        const now = new Date();
        const result = await specsCollection.insert({
            spec, title, createdBy, preview, createdAt: now, updatedAt: now,
        });
        const createdSpec = result.ops[0];

        const currentUser = await findUserByEmailOrUid(createdBy);
        if (!currentUser) {
            await specsCollection.deleteOne({ _id: ObjectId(createdSpec._id) });
            throw error(404, 'User not found');
        }
        const currentUserSpecs = currentUser.specs ? currentUser.specs : [];
        const updatedUserSpecs = [...currentUserSpecs, createdSpec._id];
        await setSpecsToUser(createdBy, updatedUserSpecs);

        return result.ops[0];
    } catch (err) {
        throw err;
    }

}

module.exports = {
    createSpec,
};
