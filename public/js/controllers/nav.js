angular.module('app')
    .controller('NavCtrl', ['$rootScope', '$scope', 'Auth', 'Games', '$location', function ($rootScope, $scope, Auth, Games, $location) {
        $scope.user = Auth.user;
        $scope.username = $scope.user.username.toLowerCase();

        $scope.games = Games.query();

        $scope.logout = function () {
            Auth.logout(function () {
                $location.path('/');
            }, function () {
                $rootScope.error = 'Failed to logout';
            })
        }
    }]);