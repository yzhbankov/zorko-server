const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
// const bcrypt = require('bcrypt');

const passport = require('passport');
const logger = require('./logger');
// const LocalStrategy = require('passport-local').Strategy;
// const JWTStrategy = require('passport-jwt').Strategy;
// const ExtractJWT = require('passport-jwt').ExtractJwt;
// const GitHubStrategy = require('passport-github').Strategy;

const config = require('./config');
const db = require('./db');
const cors = require('cors');
// const User = require('./users');

const app = express();

app.use(morgan('combined', { stream: { write: message => logger.info(message) }}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: config.auth.zorkoWebAppUrl,
    credentials: true,
}));
app.use(session({
    secret: config.auth.sessionSecret,
    resave: true,
    saveUninitialized: true,
}));

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

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./api/router'));

db.connect(config.db.url, (err) => {
    if (err) {
        logger.error('Unable to connect to Mongo.', err);
        process.exit(1);
    } else {
        app.listen(config.port, () => {
            logger.info(`Zorko API Server started and listening on port ${config.port}`);
        });
    }
});
