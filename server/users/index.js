const error = require('http-errors');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectID;

const db = require('./../../db');
const { DATES } = require('./../config/constants');

async function findUserByEmailOrUid(email, uid) {
    const usersCollection = db.get()
        .collection('users');
    let user;
    if (email) {
        user = await usersCollection.findOne({ email });
    } else if (uid) {
        user = await usersCollection.findOne({ _id: ObjectId(uid) });
    }
    return user;
}

async function findByGithubId(githubId) {
    const usersCollection = db.get()
        .collection('users');
    const user = await usersCollection.findOne({ githubId });
    return user;
}

async function userCreate(options) {
    const {
        email, login, firstName, lastName, avatarUrl, githubId,
    } = options;

    const usersCollection = db.get()
        .collection('users');

    const user = {
        email,
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        removedAt: new Date(DATES.REMOVED_AT),
        login,
        firstName,
        lastName,
        avatarUrl,
        githubId,
        specs: [],
    };

    const insert = await usersCollection.insert({ ...user });

    if (insert.result && insert.result.ok === 1 && insert.result.n === 1) {
        const insertedUser = insert.ops[0];
        insertedUser.id = insertedUser._id;
        delete insertedUser._id;

        return { ...insertedUser };
    }
    throw error(400, 'User not created');
}

async function findOrCreate(options) {
    const { githubId } = options;
    let user;

    if (githubId) {
        user = await findByGithubId(githubId);
        if (!user) {
            user = await userCreate(options);
        }
    }
    // TODO: create user with local auth (not github)
    return user;
}

async function setSpecsToUser(email, specs) {
    try {
        const usersCollection = db.get()
            .collection('users');
        let user;
        if (email) {
            user = await usersCollection.updateOne(
                { email },
                { $set: { specs } },
            );
        }
        return user;
    } catch (err) {
        throw err;
    }
}

function formatUser(user) {
    return {
        login: user.login,
        avatarUrl: user.avatarUrl ? user.avatarUrl : '',
        specs: user.specs ? user.specs : [],
    };
}

async function getUsers(login = null, { offset = 0, limit = 0 }) {
    const usersCollection = db.get()
        .collection('users');
    if (!login) {
        const users = await usersCollection.find({
            $where: `(new Date(this.removedAt)).getTime() === ${(new Date(DATES.REMOVED_AT)).getTime()}`,
        })
            .skip(offset)
            .limit(limit)
            .toArray();

        return users.map(user => formatUser(user));
    }

    const user = await usersCollection.findOne({
        $and: [
            { login },
            {
                $where: `(new Date(this.removedAt)).getTime() === ${(new Date(DATES.REMOVED_AT)).getTime()}`,
            },
        ],
    });

    if (!user) {
        throw error(404, 'User not found');
    }

    return formatUser(user);
}

async function createUser(user) {
    const usersCollection = db.get()
        .collection('users');
    const userExist = await findUserByEmailOrUid(user.email, null);
    if (userExist) {
        throw error(422, 'User with this email already exist');
    }
    const now = (new Date()).getTime();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const result = await usersCollection.insert({
        email: user.email,
        password: hashedPassword,
        admin: user.admin,
        created_at: now,
    });

    return result.ops[0];
}

async function removeUser(uid) {
    const usersCollection = db.get()
        .collection('users');
    const userExist = await findUserByEmailOrUid(null, uid);
    if (!userExist) {
        throw error(404, 'Removed user not found');
    }
    await usersCollection.deleteOne({
        _id: uid,
    });

    return userExist;
}

module.exports = {
    getUsers,
    createUser,
    removeUser,
    findUserByEmailOrUid,
    setSpecsToUser,
    findOrCreate,
};

