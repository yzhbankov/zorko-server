const config = require('../config');
const logger = require('../logger');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy(
    {
        clientID: config.auth.github.clientId,
        clientSecret: config.auth.github.secret,
        callbackURL: config.auth.github.callbackUrl,
    },
    ((accessToken, refreshToken, profile, cb) => {
        logger.log('info', `Start github user verification ${profile.id}`);
        process.nextTick(() => {
            logger.log('info', `Finish github user verification ${profile.id}`);
            return cb(null, profile);
        });
    }),
));

passport.serializeUser((user, done) => {
    logger.log('info', `Serialize user ${user}`);
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    logger.log('info', `Deserialize user ${obj}`);
    done(null, obj);
});

module.exports = passport;
