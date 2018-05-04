const error = require('http-errors');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectID;
const db = require('./../../db');

async function findUserByEmailOrUid(email, uid) {
    const usersCollection = db.get().collection('users');
    let user;
    if (email) {
        user = await usersCollection.findOne({ email });
    } else if (uid) {
        user = await usersCollection.findOne({ _id: ObjectId(uid) });
    }
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
    const userExist = await findUserByEmailOrUid(user.email, null);
    if (userExist) {
        throw error(422, 'User with this email already exist');
    }
    const now = (new Date()).getTime();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const result = await usersCollection.insert({
        email: user.email, password: hashedPassword, admin: user.admin, created_at: now,
    });

    return result.ops[0];
}

async function removeUser(uid) {
    const usersCollection = db.get().collection('users');
    const userExist = await findUserByEmailOrUid(null, uid);
    if (!userExist) {
        throw error(404, 'Removed user not found');
    }
    const result = await usersCollection.deleteOne({
        _id: uid,
    });
    console.log('result', result);

    return userExist;
}

module.exports = {
    getUsers,
    createUser,
    removeUser,
};
