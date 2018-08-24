const jwt = require('jsonwebtoken');
const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const Grid = require('gridfs-stream');

require('dotenv').config();
const config = require('../config');
const db = require('./../../db');

const Specs = require('./');

async function getSpecsHandler(req, res, next) {
    try {
        const uid = req.params.uid;
        const options = {
            limit: req.query.limit ? Number(req.query.limit) : 0,
            offset: req.query.offset ? Number(req.query.offset) : 0,
        };
        if (uid) {
            const spec = await Specs.getSpecs(uid, {});
            if (!spec) {
                res.status(404).send('Spec not found');
            }
            res.status(200).send(spec.spec);
        } else {
            const users = await Specs.getSpecs(null, options);
            res.status(200).send(users);
        }
    } catch (err) {
        next(err);
    }
}

async function createSpecHandler(req, res, next) {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
        const spec = {
            spec: req.body.spec ? req.body.spec : {},
            preview: '',
            title: req.body.title ? req.body.title : '',
            email: decoded.email,
        };
        const newSpec = await Specs.createSpec(spec);
        res.status(200).send(newSpec);
    } catch (err) {
        next(err);
    }
}

async function removeSpecHandler(req, res, next) {
    try {
        const uid = req.params.uid;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
        const spec = await Specs.removeSpec(uid, decoded.email);
        res.status(204).send(spec);
    } catch (err) {
        next(err);
    }
}

async function addPreviewHandler(req, res, next) {
    try {
        const uid = req.params.specUid;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtsecret);
        const spec = await Specs.getSpecs(uid, {});
        if (!spec || spec.createdBy.email !== decoded.email) {
            res.status(404).send('Spec not found');
        }
        const gfs = Grid(db.get(), mongo);
        req.pipe(gfs.createWriteStream({
            content_type: 'image/svg+xml',
            root: 'specs',
        })).on('close', async (savedFile) => {
            const previewUrl = `${req.hostname}:${config.server.port}/specs/preview/${savedFile._id}`;
            const specsCollection = db.get().collection('specs');
            await specsCollection.updateOne(
                {  _id: ObjectId(uid) },
                { $set: { preview: previewUrl } },
            );
            return res.send({ previewUrl });
        });
    } catch (err) {
        next(err);
    }
}

async function getPreview(req, res, next) {
    try {
        const uid = req.params.prevUid;
        const gfs = Grid(db.get(), mongo);
        const previewExist = await gfs.exist({
            _id: ObjectId(uid),
            content_type: 'image/svg+xml',
            root: 'specs',
        });

        if (!previewExist) {
            res.status(404).send('preview not found');
        }

        const readstream = gfs.createReadStream({
            _id: ObjectId(uid),
            content_type: 'image/svg+xml',
            root: 'specs',
        });
        readstream.on('error', (err) => {
            console.log('Read preview from db error', err);
            throw err;
        });
        readstream.pipe(res);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getSpecsHandler,
    createSpecHandler,
    removeSpecHandler,
    addPreviewHandler,
    getPreview,
};
