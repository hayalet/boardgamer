angular.module('app')
    .factory('Categories', function ($resource) {
        return $resource('/api/categories/:id', {id: '@_id'}, {
            update: {
                method: 'PUT'
            }
        });
    });