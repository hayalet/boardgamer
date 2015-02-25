angular.module('app')
    .controller('MainCtrl', ['$rootScope', '$scope', 'Auth', function ($rootScope, $scope, Auth) {
        $scope.user = Auth.user;
        $scope.userRoles = Auth.userRoles;
        $scope.accessLevels = Auth.accessLevels;
    }]);