const passport = require('passport');

const shouldAuthenticate = () => passport.authenticate('jwt', { session: false });

module.exports = shouldAuthenticate;

