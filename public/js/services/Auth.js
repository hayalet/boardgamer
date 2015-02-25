angular.module('app')
    .factory('Auth', function ($http, $cookieStore) {
        var accessLevels = roles.accessLevels;
        var userRoles = roles.userRoles;
        var currentUser = $cookieStore.get('user') || { username: '', email: '', role: userRoles.public, games: []};

        $cookieStore.remove('user');

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function updateProfile() {
            $http.post('/api/user', currentUser);
        }

        return {
            login: function (user, success, error) {
                $http.post('/signin', user).success(function(user) {
                    changeUser(user);
                    success(user);
                }).error(error);
            },

            getProfile: function(success, error) {
                $http.get('/api/user').success(success).error(error);
            },

            addPlay: function(game) {
                var playedGame = _.filter(currentUser.games, function(gm) {
                    return gm._id = game._id;
                });

                playedGame[0].plays++;

                updateProfile();
            },

            addGame: function(game) {
                var newGame = {
                    _id: game._id,
                    plays: 0
                };

                currentUser.games.push(newGame);
                updateProfile();
            },

            isInCollection: function(game) {
                if (!Array.isArray(currentUser.games)) {
                    return false;
                }

                var result = currentUser.games.filter(function(userGame) {
                    return game._id === userGame._id;
                });

                return result.length > 0;
            },

            authorize: function(accessLevel, role) {
                if(role === undefined) {
                    role = currentUser.role;
                }

                return accessLevel.bitMask & role.bitMask;
            },

            isLoggedIn: function(user) {
                if (user === undefined) {
                    user = currentUser;
                }
                return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
            },

            register: function (user, success, error) {
                $http.post('/signup', user).success(function(res) {
                    changeUser(res);
                    success();
                }).error(error);
            },

            logout: function(success, error) {
                $http.post('/signout').success(function(res) {
                    changeUser({
                        username: '',
                        role: userRoles.public
                    });
                    success();
                }).error(error);
            },
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        }
    });