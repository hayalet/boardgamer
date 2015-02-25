var mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findOne({_id: id}, function (err, user) {
        done(err, user);
    })
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, {
                    'errors': {
                        'email': { type: 'Email is not registered.'}
                    }
                })
            }

            if (!user.authenticate(password)) {
                return done(null, false, {
                    'errors': {
                        'password': {type: 'Password is incorrect.'}
                    }
                });
            }

            return done(null, user);
        });
    }
));