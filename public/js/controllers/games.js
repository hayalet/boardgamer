angular.module('app')
    .controller('GamesListCtrl', ['$rootScope', '$scope', 'Games', 'Categories', 'Auth',
        function ($rootScope, $scope, Games, Categories, Auth) {
            $scope.categories = Categories.query();
            $scope.currentFilter = null;
            $scope.user = Auth.user;

            $scope.reset = function() {
                $scope.category = null;
                Games.query().$promise.then(function(games) {
                    $scope.games = games;

                    if ($scope.user) {
                        angular.forEach($scope.games, function(game) {
                            game.inCollection = Auth.isInCollection(game);
                        });
                    }
                });
            };

            $scope.filter = function(category) {
                $scope.category = category;
                Games.query({'category': category}).$promise.then(function(games) {
                    $scope.games = games;

                    if ($scope.user) {
                        angular.forEach($scope.games, function(game) {
                            game.inCollection = Auth.isInCollection(game);
                        });
                    }
                });
            };

            $scope.addToCollection = function(game) {
                game.inCollection = true;
                Auth.addGame(game);
                $scope.user = Auth.user;
            };

            $scope.reset();
        }]);

angular.module('app')
    .controller('GamesDetailsCtrl', ['$rootScope', '$scope', '$stateParams', 'Games', 'Auth', 'Categories', '$sce',
        function ($rootScope, $scope, $stateParams, Games, Auth, Categories, $sce) {
            $scope.currentFilter = null;
            $scope.review = {
                author: Auth.user.username
            };

            function getGame() {
                Games.get({id: $stateParams.id}, function(game) {
                    $scope.game = game;
                    $scope.game.description = $sce.trustAsHtml(game.description);
                    $scope.category = Categories.get({id: game.category});
                });
            }

            $scope.addReview = function() {
                if (!$scope.game.reviews) {
                    $scope.game.reviews = [];
                }
                angular.extend($scope.review, {date: Date.now()});
                $scope.game.reviews.push($scope.review);
                $scope.game.$review(function() {
                    $scope.review.review = '';
                    getGame();
                });
            }

            getGame();
        }]);