const Users = require('./');

async function getUsersHandler(req, res, next) {
    try {
        const login = req.params.login;
        const options = {
            limit: req.query.limit ? Number(req.query.limit) : 0,
            offset: req.query.offset ? Number(req.query.offset) : 0,
        };
        if (login) {
            const user = await Users.getUsers(login, {});
            res.status(200).send(user);
        } else {
            const users = await Users.getUsers(null, options);
            res.status(200).send(users);
        }
    } catch (err) {
        next(err);
    }
}

async function createUserHandler(req, res, next) {
    try {
        const data = {
            email: req.body.email,
            password: req.body.password,
            admin: req.body.admin,
        };
        const user = await Users.createUser(data);
        res.status(200).send(user);
    } catch (err) {
        next(err);
    }
}

async function removeUserHandler(req, res, next) {
    try {
        const uid = req.params.uid;
        const user = await Users.removeUser(uid);
        res.status(204).send(user);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getUsersHandler,
    createUserHandler,
    removeUserHandler,
};
