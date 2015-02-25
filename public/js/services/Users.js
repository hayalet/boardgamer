angular.module('app')
    .factory('Users', function ($resource) {
        return $resource('/api/users/:id', {id: '@_id'}, {
            update: {
                method: 'PUT'
            }
        });
    });