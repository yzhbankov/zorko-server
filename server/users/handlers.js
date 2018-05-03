const error = require('http-errors');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectID;
const db = require('./../../db');

async function findUserByEmail(email) {
    const usersCollection = db.get().collection('users');
    const user = await usersCollection.findOne({ email });
    return user;
}

function formatUser(user) {
    const formattedUser = { ...user };
    formattedUser.id = formattedUser._id;
    delete formattedUser._id;
    return formattedUser;
}

async function getUsers(uid = null, options) {
    const usersCollection = db.get().collection('users');
    if (!uid) {
        let users = await usersCollection.find({}).toArray();
        users = users.map(user => formatUser(user));
        if (options.offset) {
            users = users.filter((user, index) => index > options.offset - 1);
        }
        if (options.limit) {
            users = users.filter((user, index) => index <= options.limit - 1);
        }
        return users;
    }
    const user = await usersCollection.findOne({ _id: ObjectId(uid) });
    return formatUser(user);
}

async function createUser(user) {
    const usersCollection = db.get().collection('users');
    const userExist = await findUserByEmail(user.email);
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
