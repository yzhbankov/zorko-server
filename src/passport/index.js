const config = require('../config');
const logger = require('../logger');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../users');

passport.use(new GitHubStrategy(
    {
        clientID: config.auth.github.clientId,
        clientSecret: config.auth.github.secret,
        callbackURL: config.auth.github.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
        logger.log('info', `Start github user verification ${profile.id}`);
        const {
            id, avatar_url, login, email, name,
        } = profile._json;
        let user;
        let error;
        try {
            user = await User.findOrCreate({
                githubId: id,
                avatarUrl: avatar_url,
                login,
                email,
                firstName: name,
                lastName: '',
            });
        } catch (e) {
            error = e;
        }
        return done(error, user);
    },
));


// passport.use(new LocalStrategy(
//     {
//         usernameField: 'email',
//         passwordField: 'password',
//     },
//     async (username, password, done) => {
//         const usersCollection = db.get().collection('users');
//         const user = await usersCollection.findOne({ email: username }, { password: false });
//
//         if (!user) { return done(null, false); }
//
//         const correctPassword = bcrypt.compareSync(password, user.password);
//
//         if (!correctPassword) { return done(null, false); }
//
//         delete user.password;
//
//         return done(null, user);
//     },
// ));

passport.use(new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.auth.jwtsecret,
    },
    async (jwtPayload, done) => {
        let user;
        try {
            user = await User.findById(jwtPayload._id);
        } catch (e) {
            logger.error(`Error during jwt verification on user id=${jwtPayload.id}`);
            done(e, null);
        }

        if (!user) {
            logger.info(`Can't find user by id ${jwtPayload.id}`);
            return done(null, false);
        }

        return done(null, user);
    },
));

passport.serializeUser((user, done) => {
    logger.log('info', `Serialize user by id${user._id}`);
    done(null, {id: user._id});
});

passport.deserializeUser(async (obj, done) => {
    logger.log('info', `Deserialize user by id ${obj.id}`);
    try {
        const user = await User.findById(obj.id);
        done(null, user);
    } catch (e) {
        logger.error(`Can't deserialize user ${obj.id}`);
        done(e, null);
    }
});

module.exports = passport;
