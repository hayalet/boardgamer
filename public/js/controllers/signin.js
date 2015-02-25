angular.module('app')
    .controller('SigninCtrl', ['$rootScope', '$scope', 'Auth', '$location', function ($rootScope, $scope, Auth, $location) {
        $scope.rememberme = true;

        $scope.login = function () {
            Auth.login({
                email: $scope.email,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function () {
                $location.path('/');
            },
            function (err) {
                $scope.email = '';
                $scope.password = '';
                $rootScope.error = err;
            });
        }
    }]);