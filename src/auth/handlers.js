const error = require('http-errors');
const logger = require('../logger');

const db = require('./../../db');
const Auth = require('./');

async function signUpHandler(req, res, next) {
    try {
        const {
            email, password, login, firstName, lastName, avatarUrl,
        } = req.body;


        if (!password || !email || !login) {
            throw error(422, 'Should be specified password, email and login');
        }
        const usersCollection = db.get().collection('users');
        const usersExist = await usersCollection.find({ $or: [{ email }, { login }] }).toArray();

        if (usersExist.length > 0) {
            throw error(422, 'User with this email and login already exist');
        }

        const newUser = await Auth.userCreate(email, password, login, firstName, lastName, avatarUrl);

        res.send(newUser);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        logger.log('info', 'User authenticated');
        return next();
    }
    logger.log('info', 'User not authenticated');
    res.status(403).send({ error: { code: 'NOT_AUTHORIZED_SESSION' } });
}


module.exports = {
    signUpHandler,
    ensureAuthenticated,
};
