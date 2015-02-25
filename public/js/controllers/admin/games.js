angular.module('app')
    .controller('AdminGamesListCtrl', ['$rootScope', '$scope', 'Games',
        function ($rootScope, $scope, Games) {
            $scope.games = Games.query();

            $scope.delete = function(game) {
                game.$delete();
                $scope.games = Games.query();
            };
        }]);

angular.module('app')
    .controller('AdminGamesEditCtrl', ['$rootScope', '$scope', '$stateParams', '$location', 'Games', 'Categories',
        function ($rootScope, $scope, $stateParams, $location, Games, Categories) {
            Games.get({id: $stateParams.id}).$promise.then(function(game) {
                $scope.game = game;
                Categories.get({id: game.category}).$promise.then(function(category) {
                     $scope.game.category = category;
                });
            });
            $scope.categories = Categories.query();

            $scope.updateGame = function() {
                $scope.game.category = $scope.game.category._id;
                $scope.game.$update(function() {
                    $location.path('/admin/games');
                });
            };
        }]);

angular.module('app')
    .controller('AdminGamesAddCtrl', ['$rootScope', '$scope', '$location', 'Games', 'Categories',
        function ($rootScope, $scope, $location, Games, Categories) {
            $scope.game = new Games();
            $scope.categories = Categories.query();

            $scope.addGame = function() {
                $scope.game.category = $scope.game.category._id;
                $scope.game.$save();
                $location.path('/admin/games');
            };
        }]);