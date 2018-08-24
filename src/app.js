const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const GitHubStrategy = require('passport-github').Strategy;

require('dotenv').config();
const config = require('./config');
const api = require('./api');
const db = require('../db/index');
const cors = require('cors');
const User = require('./users/index');

const app = express();

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
    origin: config.client.url,
    credentials: true,
}));

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60000 },
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

passport.use(new GitHubStrategy(
    {
        clientID: config.github.clientId,
        clientSecret: config.github.secret,
        callbackURL: config.github.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
        const {
            id, avatar_url, login, email, name,
        } = profile._json;
        const user = await User.findOrCreate({
            githubId: id,
            avatarUrl: avatar_url,
            login,
            email,
            firstName: name,
            lastName: '',
        });
        return done(null, user);
    },
));

passport.serializeUser((user, done) => {
    console.log('serialize user', user);
    done(null, user);
});
passport.deserializeUser(async (obj, done) => {
    console.log('deserialize user', obj);
    // const usersCollection = db.get().collection('users');
    // usersCollection.findOne({ _id: id }, (err, user) => {
    //     done(err, user);
    // });
    done(null, obj);
});

app.use(api);

db.connect(config.db.url, (err) => {
    if (err) {
        console.error('Unable to connect to Mongo.', err);
        process.exit(1);
    } else {
        app.listen(config.server.port, () => {
            console.log(`Zorko listening on port ${config.server.port}`);
        });
    }
});
