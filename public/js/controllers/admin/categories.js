angular.module('app')
    .controller('AdminCategoriesListCtrl', ['$rootScope', '$scope', 'Categories',
        function ($rootScope, $scope, Categories) {
            $scope.categories = Categories.query();

            $scope.delete = function(user) {
                user.$delete();
                $scope.categories = Categories.query();
            };
        }]);

angular.module('app')
    .controller('AdminCategoriesEditCtrl', ['$rootScope', '$scope', '$stateParams', '$location', 'Categories',
        function ($rootScope, $scope, $stateParams, $location, Categories) {
            $scope.category = Categories.get({id: $stateParams.id});

            $scope.updateCategory = function() {
                $scope.category.$update(function() {
                    $location.path('/admin/categories');
                });
            };
        }]);

angular.module('app')
    .controller('AdminCategoriesAddCtrl', ['$rootScope', '$scope', '$location', 'Categories',
        function ($rootScope, $scope, $location, Categories) {
            $scope.category = new Categories();

            $scope.addCategory = function() {
                $scope.category.$save();
                $location.path('/admin/categories');
            };
        }]);