var mongoose = require('mongoose'),
    Category = mongoose.model('Category');

exports.create = function(req, res) {
    var newCategory = new Category(req.body);

    Category.findOne({name: req.body.name}).exec(function (err, category) {
        if (!category) {
            newCategory.save(function(err) {
                if (err) {
                    return res.json(400, err);
                }

                return res.send(200, "Category created");
            })
        } else {
            return res.send(400, "This category already exists");
        }
    });
};

exports.update = function(req, res) {
    Category.findById(req.params.id).exec(function (err, category) {
        if (category) {
            category.name = req.body.name;

            category.save(function(err) {
                if (err) {
                    return res.send(err);
                }

                return res.send(200, "Category updated");
            })
        } else {
            return res.send(400, 'Wrong category id')
        }
    });
};

exports.delete = function(req, res) {
    Category.remove({
        _id: req.params.id
    }, function(err) {
        if (err) {
            return res.send(err);
        }

        return res.send(200, "Category deleted");
    });
}

exports.getAll = function(req, res) {
    Category.find({}, function (err, categories) {
        if (err) {
            res.send(err);
        }

        res.json(categories);
    });
};

exports.getById = function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            res.send(err);
        }

        res.json(category);
    });
}