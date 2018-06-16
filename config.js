module.exports = {
    server: {
        port: process.env.PORT,
    },
    client: {
        url: process.env.ZORKO_WEB_APP_URL,
    },
    db: {
        url: process.env.MONGO_ROOT_URL,
        name: process.env.MONGO_DB_NAME,
    },
    secret: process.env.SESSION_SECRET,
    jwtsecret: process.env.JWT_SECRET,
};
