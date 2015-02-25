angular.module('app')
    .controller('ProfileCtrl', ['$rootScope', '$scope', 'Auth', 'Games', function ($rootScope, $scope, Auth, Games) {
        Games.query().$promise.then(function(games) {
            Auth.getProfile(function(data) {
                $scope.user = data;
                $scope.user.created = moment(data.createdAt).format('DD.MM.YYYY');
                _.each($scope.user.games, function(game) {
                    game.name = _.result(_.findWhere(games, {'_id': game._id}), 'name');
                });
            });

            $scope.addPlay = function(game) {
                game.plays++;
                Auth.addPlay(game);
            }
        });
    }]);