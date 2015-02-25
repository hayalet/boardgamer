var mongoose = require('mongoose'),
    Game = mongoose.model('Game'),
    Category = mongoose.model('Category'),
    ObjectId = require('mongoose').Types.ObjectId,
    fs = require('fs');

exports.create = function(req, res) {
    var game = new Game(req.body);

    var imagePath = '/images/games/' + game._id + '.' + req.files.image.extension;
    var source = fs.createReadStream('./' + req.files.image.path);
    var dest = fs.createWriteStream('./public' + imagePath);

    source.pipe(dest);
    source.on('end', function() {
       fs.unlink('./' + req.files.image.path);
    });

    game.image = imagePath;

    game.save(function(err) {
        if (err) {
            return res.json(400, err);
        }

        return res.send(200, "Game created");
    });
};

exports.update = function(req, res) {
    Game.findById(req.params.id).exec(function (err, game) {
        if (game) {
            game.name = req.body.name;
            game.publisher = req.body.publisher;
            game.year = req.body.year;
            game.category = req.body.category;
            game.players = req.body.players;
            game.description = req.body.description;

            game.save(function(err) {
                if (err) {
                    return res.send(err);
                }

                return res.send(200, "Game updated");
            })
        } else {
            return res.send(400, 'Wrong game id')
        }
    });
};

exports.addReview = function(req, res) {
    Game.findById(req.params.id).exec(function (err, game) {
        if (game) {
            game.reviews = req.body.reviews;

            game.save(function(err) {
                if (err) {
                    return res.send(err);
                }

                return res.send(200, "Game updated");
            })
        } else {
            return res.send(400, 'Wrong game id')
        }
    });
};

exports.delete = function(req, res) {
    Game.findByIdAndRemove(req.params.id, function(err, game) {
        if (err) {
            return res.send(err);
        }

        fs.unlink('./public' + game.image);

        return res.send(200, "Game deleted");
    });
}

exports.getAll = function(req, res) {
    if (req.query.category) {
        Category.findOne({name: req.query.category}, function (err, category) {
            if (err) {
                res.send(err);
            }

            Game.find({'category': category._id}, function(err, games) {
                if (err) {
                    res.send(err);
                }

                res.json(games);
            });
        });
    } else {
        Game.find({}, function (err, games) {
            if (err) {
                res.send(err);
            }

            res.json(games);
        });
    }
};

exports.getById = function(req, res) {
    Game.findById(req.params.id, function(err, game) {
        if (err) {
            res.send(err);
        }

        res.json(game);
    });
}