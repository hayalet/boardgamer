var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    userRoles = require('../public/js/roles').userRoles;

exports.logout = function (req, res) {
    req.logout();
    res.send(200);
};

exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user) {

        if (err) { return next(err); }
        if (!user) { return res.send(400, "Incorrect email or password"); }

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            if (req.body.rememberme) {
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
            }
            res.json(200, req.user.user_info);
        })
    })(req, res, next);
};

exports.register = function(req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = userRoles.user;

    User.findOne({email: req.body.email}).exec(function (err, user) {
        if (!user) {
            newUser.save(function(err) {
                if (err) {
                    return res.json(400, err);
                }

                req.logIn(newUser, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.json(newUser.user_info);
                });
            })
        } else {
            return res.send(400, "User using this email already exists");
        }
    });
};