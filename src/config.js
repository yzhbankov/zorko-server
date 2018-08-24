require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    auth: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            secret: process.env.GITHUB_CLIENT_SECRET,
            callbackUrl: process.env.GITHUB_CLIENT_CALLBACK_URL,
        },
        sessionSecret: process.env.SESSION_SECRET,
        zorkoWebAppUrl: process.env.ZORKO_WEB_APP_URL,
    },
    db: {
        url: process.env.MONGO_ROOT_URL,
        name: process.env.MONGO_DB_NAME,
        urlParams: process.env.MONGO_URL_PARAMS,
    },
};
