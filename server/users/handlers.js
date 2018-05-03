const error = require('http-errors');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectID;
const db = require('./../../db');

async function findUserByEmail(email) {
    const usersCollection = db.get().collection('users');
    const user = await usersCollection.findOne({ email });
    return user;
}

async function getUsers(uid = null) {
    const usersCollection = db.get().collection('users');
    if (!uid) {
        return usersCollection.find({}).toArray();
    }
    return usersCollection.findOne({ _id: ObjectId(uid) });
}

async function createUser(user) {
    const usersCollection = db.get().collection('users');
    const userExist = await findUserByEmail(user.email);
    console.log(userExist)
    if (userExist) {
        throw error(422, 'User with this email already exist');
    }
    const now = (new Date()).getTime();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const result = await usersCollection.insert({ email: user.email, password: hashedPassword, admin: user.admin, created_at: now });

    return result.ops[0];
}

module.exports = {
    getUsers,
    createUser,
};
