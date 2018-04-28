const db = require('./../../db');

async function getUsers() {
    const usersCollection = db.get().collection('users');

    const users = await usersCollection.find({}).toArray();

    return users;
}

module.exports = {
    getUsers,
};
