const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('config');
const bcrypt = require('bcryptjs');

module.exports = function(passport, db) {
  // Local Strategy
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = db.findUserByUsername(username);
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // JWT Strategy
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwtSecret')
  };

  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    const user = db.findUserById(jwt_payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  }));
};