angular.module('app')
    .controller('AdminUsersListCtrl', ['$rootScope', '$scope', 'Users', 'Auth',
        function ($rootScope, $scope, Users, Auth) {
        $scope.userRoles = Auth.userRoles;
        $scope.users = Users.query();

        $scope.delete = function(user) {
            user.$delete();
            $scope.users = Users.query();
        };
    }]);

angular.module('app')
    .controller('AdminUsersEditCtrl', ['$rootScope', '$scope', '$stateParams', '$location', 'Users', 'Auth',
        function ($rootScope, $scope, $stateParams, $location, Users, Auth) {
            var roles = [];
            $scope.user = Users.get({id: $stateParams.id}, function(user) {
                $scope.user.role = user.role;
            });

            for (var role in Auth.userRoles) {
                var newRole = {
                    title: role,
                    val: JSON.stringify(Auth.userRoles[role])
                };

                roles.push(newRole);
            }
            $scope.userRoles = roles;

            $scope.updateUser = function() {
                $scope.user.role = $scope.user.role.val;
                $scope.user.$update(function() {
                    $location.path('/admin/users');
                });
            };
        }]);

angular.module('app')
    .controller('AdminUsersAddCtrl', ['$rootScope', '$scope', '$location', 'Users', 'Auth',
        function ($rootScope, $scope, $location, Users, Auth) {
            var roles = [];
            $scope.user = new Users();

            for (var role in Auth.userRoles) {
                roles.push({
                    title: role,
                    val: JSON.stringify(Auth.userRoles[role])
                });
            }
            $scope.userRoles = roles;

            $scope.addUser = function() {
                $scope.user.role = $scope.user.role.val;
                $scope.user.$save();
                $location.path('/admin/users');
            };
        }]);