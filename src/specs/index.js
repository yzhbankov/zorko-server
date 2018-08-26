const db = require('../db');
const ObjectId = require('mongodb').ObjectID;

const { SEARCH } = require('../constants');

function formatSpec(spec) {
    return {
        id: spec._id,
        title: spec.title,
        preview: spec.preview,
        author: {
            login: spec.createdBy.login,
            avatarUrl: spec.createdBy.avatarUrl,
        },
    };
}

async function createSpec({ spec, title, preview, createdBy }) {
    const specsCollection = db.get()
        .collection('specs');
    const now = new Date();

    const result = await specsCollection.insert({
        spec,
        title,
        createdBy,
        preview,
        createdAt: now,
        updatedAt: now,
    });
    return result.ops[0];
}

async function removeSpec(id) {
    const specsCollection = db.get()
        .collection('specs');
    const specExist = await specsCollection.findOne({
        _id: ObjectId(id),
    });

    if (!specExist) {
        return false;
    }
    // const user = await findUserByEmailOrUid(email);
    // if (!specExist || !user) {
    //     throw error(404, 'Spec or user not exist');
    // }
    await specsCollection.deleteOne({
        _id: ObjectId(id),
    });
    // const updatedUserSpecs = user.specs.filter(spec => ObjectId(spec)
    //     .toString() !== ObjectId(id)
    //     .toString());
    // await setSpecsToUser(email, updatedUserSpecs);

    return true;
}

async function getSpecs(uid = null, { offset = 0, limit = SEARCH.LIMIT }) {
    const specsCollection = db.get()
        .collection('specs');
    if (!uid) {
        const specs = await specsCollection.find({})
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 })
            .toArray();

        return specs.map(spec => formatSpec(spec));
    }

    const spec = await specsCollection.findOne({ _id: ObjectId(uid) });

    return spec;
}

module.exports = {
    createSpec,
    removeSpec,
    getSpecs,
};
