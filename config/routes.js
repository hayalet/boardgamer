var path = require('path'),
    _ = require('lodash'),
    userRoles = require('../public/js/roles').userRoles,
    accessLevels = require('../public/js/roles').accessLevels,
    UsersCtrl = require('../controllers/users'),
    GamesCtrl = require('../controllers/games'),
    CategoriesCtrl = require('../controllers/categories'),
    AuthCtrl = require('../controllers/auth');

var routes = [
    {
        path: '/views/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('/partials', req.url);
            res.render(requestedView);
        }]
    },
    {
        path: '/signup',
        httpMethod: 'POST',
        middleware: [AuthCtrl.register]
    },
    {
        path: '/signin',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login]
    },
    {
        path: '/signout',
        httpMethod: 'POST',
        middleware: [AuthCtrl.logout]
    },
    {
        path: '/api/users',
        httpMethod: 'GET',
        middleware: [UsersCtrl.getAll],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/user',
        httpMethod: 'GET',
        middleware: [UsersCtrl.getUser],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/user',
        httpMethod: 'POST',
        middleware: [UsersCtrl.updateUser],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/users',
        httpMethod: 'POST',
        middleware: [UsersCtrl.create],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/users/:id',
        httpMethod: 'GET',
        middleware: [UsersCtrl.getById],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/users/:id',
        httpMethod: 'PUT',
        middleware: [UsersCtrl.update],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/users/:id',
        httpMethod: 'DELETE',
        middleware: [UsersCtrl.delete],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/games',
        httpMethod: 'GET',
        middleware: [GamesCtrl.getAll]
    },
    {
        path: '/api/games',
        httpMethod: 'POST',
        middleware: [GamesCtrl.create],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/games/:id',
        httpMethod: 'GET',
        middleware: [GamesCtrl.getById]
    },
    {
        path: '/api/games/:id',
        httpMethod: 'DELETE',
        middleware: [GamesCtrl.delete],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/games/:id',
        httpMethod: 'PUT',
        middleware: [GamesCtrl.update],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/games/:id/reviews',
        httpMethod: 'PUT',
        middleware: [GamesCtrl.addReview],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/categories',
        httpMethod: 'GET',
        middleware: [CategoriesCtrl.getAll]
    },
    {
        path: '/api/categories',
        httpMethod: 'POST',
        middleware: [CategoriesCtrl.create],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/categories/:id',
        httpMethod: 'GET',
        middleware: [CategoriesCtrl.getById]
    },
    {
        path: '/api/categories/:id',
        httpMethod: 'DELETE',
        middleware: [CategoriesCtrl.delete],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/categories/:id',
        httpMethod: 'PUT',
        middleware: [CategoriesCtrl.update],
        accessLevel: accessLevels.admin
    },
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            if (req.user) {
                res.cookie('user', JSON.stringify({
                    'username': req.user.username,
                    'email': req.user.email,
                    'role': req.user.role,
                    'games': req.user.games
                }));
            }
            res.render('index.html');
        }]
    }
];

module.exports = function (app) {
    _.each(routes, function (route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);

        switch (route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}

function ensureAuthorized(req, res, next) {
    var role, accessLevel;

    if (!req.user) {
        role = userRoles.public;
    } else {
        role = req.user.role;
    }
    accessLevel = _.findWhere(routes, {
        path: req.route.path,
        httpMethod: req.route.stack[0].method.toUpperCase()
    }).accessLevel || accessLevels.public;

    if (!(accessLevel.bitMask & role.bitMask)) {
        return res.send(403);
    }
    return next();
}