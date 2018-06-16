require('dotenv')
    .config();
const config = require('../config');
const db = require('.');
const admin = require('./seeds/users/admin');
const util = require('util');
const fs = require('fs');

const fsReaddir = util.promisify(fs.readdir);
const fsReadFile = util.promisify(fs.readFile);

const readFileNames = async path => fsReaddir(path);
const readFile = async path => fsReadFile(path);

const SEEDS_SPECS_PATH = `${__dirname}/seeds/specs/vega-lite`;
const getSpecFilePath = fileName => `${SEEDS_SPECS_PATH}/${fileName}`;
const DEFAULT_DATE = '2018-05-04T17:00:00.000+0000';

const readSpecs = async () => {
    let specs = [];
    try {
        const filenames = await readFileNames(SEEDS_SPECS_PATH);
        const fileBuffers = await Promise.all(filenames.map(filename => readFile(getSpecFilePath(filename))));
        specs = fileBuffers.map(buffer => JSON.parse(buffer.toString()));
    } catch (e) {
        console.error(e);
    }
    return specs;
};

const loadSeedsToDb = async () => {
    try {
        db.connect(config.db.url, async (err) => {
            if (err) {
                console.log('Unable to connect to Mongo.');
                process.exit(1);
            } else {
                db.get()
                    .dropDatabase();
                const usersCollection = db.get()
                    .collection('users');
                const specsCollection = db.get()
                    .collection('specs');

                const specs = await readSpecs();
                const specInsertResults = await Promise.all(specs.map(spec => specsCollection.insert({
                    spec,
                    createdBy: {
                        login: admin.login,
                        firstName: admin.firstName,
                        lastName: admin.lastName,
                        avatarUtl: admin.avatarUtl,
                    },
                    preview: null,
                    createdAt: DEFAULT_DATE,
                    updatedAt: DEFAULT_DATE,
                })));

                const specIds = specInsertResults.reduce((memo, result) => {
                    memo.push(...Object.values(result.insertedIds));
                    return memo;
                }, []);

                console.log(`Database successfully filled with ${specIds.length} specs`);

                await usersCollection.insert({
                    email: admin.email,
                    login: admin.login,
                    password: admin.password,
                    admin: admin.admin,
                    createdAt: admin.createdAt,
                    updatedAt: admin.updatedAt,
                    removedAt: admin.removedAt,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    avatarUtl: admin.avatarUtl,
                    specs: specIds,
                });

                console.log('Database successfully filled with 1 user');
                process.exit(0);
            }
        });
    } catch (e) {
        console.log('Error. db filled with error', e);
        process.exit(1);
    }
};

loadSeedsToDb();
