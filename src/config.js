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
    github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        secret: process.env.GITHUB_CLIENT_SECRET,
        callbackUrl: process.env.GITHUB_CLIENT_CALLBACK_URL,
    },
    secret: process.env.SESSION_SECRET,
    jwtsecret: process.env.JWT_SECRET,
};
