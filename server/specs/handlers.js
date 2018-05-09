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

async function removeSpec(uid, email) {
    try {
        const specsCollection = db.get().collection('specs');
        const specExist = await specsCollection.findOne({ _id: ObjectId(uid), createdBy: email });
        const user = await findUserByEmailOrUid(email);
        if (!specExist || !user) {
            throw error(404, 'Spec or user not exist');
        }
        await specsCollection.deleteOne({ _id: ObjectId(uid), createdBy: email });
        const updatedUserSpecs = user.specs.filter(spec => ObjectId(spec).toString() !== ObjectId(uid).toString());
        await setSpecsToUser(email, updatedUserSpecs);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createSpec,
    removeSpec,
};
