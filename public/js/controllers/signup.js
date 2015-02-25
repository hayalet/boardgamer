angular.module('app')
    .controller('SignupCtrl', ['$rootScope', '$scope', 'Auth', '$location', function ($rootScope, $scope, Auth, $location) {
        $scope.register = function () {
            Auth.register({
                username: $scope.username,
                email: $scope.email,
                password: $scope.password
            },
            function() {
                $location.path('/');
            },
            function(err) {
                $scope.email = '';
                $rootScope.error = err;
            });
        }
    }]);