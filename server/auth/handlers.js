const bcrypt = require('bcrypt');

const db = require('./../../db');

async function userCreate(password, email) {
    const usersCollection = db.get().collection('users');
    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);

    await usersCollection.insert({ email, password: hash, created_at: new Date() });

    return { email, password: hash };
}

module.exports = {
    userCreate,
};
