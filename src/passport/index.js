import User from '../users';

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

// passport.use(new JWTStrategy(
//     {
//         jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//         secretOrKey: config.jwtsecret,
//     },
//     async (jwtPayload, done) => {
//         const usersCollection = db.get().collection('users');
//         const user = await usersCollection.findOne({ email: jwtPayload.email });
//
//         if (!user) { return done(null, false); }
//
//         return done(null, user);
//     },
// ));
//
// passport.use(new GitHubStrategy(
//     {
//         clientID: config.github.clientId,
//         clientSecret: config.github.secret,
//         callbackURL: config.github.callbackUrl,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         const {
//             id, avatar_url, login, email, name,
//         } = profile._json;
//         const user = await User.findOrCreate({
//             githubId: id,
//             avatarUrl: avatar_url,
//             login,
//             email,
//             firstName: name,
//             lastName: '',
//         });
//         return done(null, user);
//     },
// ));
//
// passport.serializeUser((user, done) => {
//     console.log('serialize user', user);
//     done(null, user);
// });
// passport.deserializeUser(async (obj, done) => {
//     console.log('deserialize user', obj);
//     // const usersCollection = db.get().collection('users');
//     // usersCollection.findOne({ _id: id }, (err, user) => {
//     //     done(err, user);
//     // });
//     done(null, obj);
// });

passport.serializeUser((user, done) => {
    logger.log('info', `Serialize user ${user}`);
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    logger.log('info', `Deserialize user ${obj}`);
    done(null, obj);
});

module.exports = passport;
