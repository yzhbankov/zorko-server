const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const config = require('./config');
const api = require('./server/api');
const db = require('./db');

const app = express();

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
}));

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (username, password, done) => {
        const usersCollection = db.get().collection('users');
        const user = await usersCollection.findOne({ email: username });

        if (!user) { return done(null, false); }

        const correctPassword = bcrypt.compareSync(password, user.password);

        if (!correctPassword) { return done(null, false); }

        return done(null, user);
    },
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const usersCollection = db.get().collection('users');
    usersCollection.findOne({ _id: id }, (err, user) => {
        done(err, user);
    });
});


app.use(api);

db.connect(config.db.url, (err) => {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    } else {
        app.listen(config.server.port, () => {
            console.log(`Zorko listening on port ${config.server.port}`);
        });
    }
});
