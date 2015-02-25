var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    userRoles = require('../public/js/roles').userRoles;

exports.create = function(req, res) {
    console.log(req.body);
    var newUser = new User(req.body);

    newUser.provider = 'local';
    newUser.role = JSON.parse(req.body.role);

    User.findOne({email: req.body.email}).exec(function (err, user) {
        if (!user) {
            newUser.save(function(err) {
                if (err) {
                    return res.json(400, err);
                }

                return res.send(200, "User created");
            })
        } else {
            return res.send(400, "User using this email already exists");
        }
    });
};

exports.getUser = function(req, res) {
    if (!req.user) {
        return res.send(401, "Unauthorized");
    }

    return res.send(req.user);
};

exports.updateUser = function(req, res) {
    if (req.user && req.user.email === req.body.email) {
        User.findOne({email: req.body.email}).exec(function (err, user) {
            if (user) {
                user.games = req.body.games;

                user.save(function(err) {
                    if (err) {
                        return res.send(err);
                    }

                    return res.send(200, "User updated");
                });
            }
        });
    } else {
        return res.send(401, "Unauthorized");
    }
};

exports.update = function(req, res) {
  User.findById(req.params.id).exec(function (err, user) {
      if (user) {
          user.username = req.body.username;
          user.email = req.body.email;
          user.role = JSON.parse(req.body.role);

          user.save(function(err) {
              if (err) {
                  return res.send(err);
              }

              return res.send(200, "User updated");
          });
      } else {
          return res.send(400, 'Wrong user id')
      }
  });
};

exports.delete = function(req, res) {
    User.remove({
        _id: req.params.id
    }, function(err) {
        if (err) {
            return res.send(err);
        }

        return res.send(200, "User deleted");
    });
}

exports.getAll = function(req, res) {
    User.find({}, '_id username email role', function (err, users) {
        if (err) {
            res.send(err);
        }

        res.json(users);
    });
};

exports.getById = function(req, res) {
    User.findById(req.params.id, '_id username email role', function(err, user) {
        if (err) {
            res.send(err);
        }

        res.json(user);
    });
}