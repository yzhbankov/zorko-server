require('dotenv').config();
const config = require('../config');
const db = require('.');
const { users } = require('./seeds/users');
const { specs } = require('./seeds/specs');

try {
    db.connect(config.db.url, async (err) => {
        if (err) {
            console.log('Unable to connect to Mongo.');
            process.exit(1);
        } else {
            db.get().dropDatabase();
            const usersCollection = db.get().collection('users');
            const specsCollection = db.get().collection('specs');
            const specsIds = [];

            for (let i = 0; i < specs.length; i += 1) {
                const result = await specsCollection.insert({
                    spec: specs[i].spec,
                    title: specs[i].title,
                    createdBy: specs[i].createdBy,
                    preview: specs[i].preview,
                    createdAt: specs[i].createdAt,
                    updatedAt: specs[i].updatedAt,
                });
                specsIds.push(...Object.values(result.insertedIds));
            }

            for (let i = 0; i < users.length; i += 1) {
                await usersCollection.insert({
                    email: users[i].email,
                    login: users[i].login,
                    password: users[i].password,
                    admin: users[i].admin,
                    createdAt: users[i].createdAt,
                    updatedAt: users[i].updatedAt,
                    removedAt: users[i].removedAt,
                    firstName: users[i].firstName,
                    lastName: users[i].lastName,
                    avatarUtl: users[i].avatarUtl,
                    specs: specsIds,
                });
            }

            console.log('Database successfully filled');
            process.exit(0);
        }
    });
} catch (e) {
    console.log('Error. db filled with error', e);
    process.exit(1);
}

