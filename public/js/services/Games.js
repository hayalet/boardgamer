angular.module('app')
    .factory('Games', function ($resource) {
        return $resource('/api/games/:id', {id: '@_id'}, {
            update: {
                method: 'PUT'
            },
            save: {
                method: 'POST',
                transformRequest: function (data) {
                    if (data === undefined) {
                        return data;
                    }

                    var fd = new FormData();
                    angular.forEach(data, function (value, key) {
                        if (value instanceof FileList) {
                            console.log(value);
                        } else {
                            fd.append(key, value);
                        }
                    });

                    return fd;
                },
                headers: {'Content-type': undefined}
            },
            review: {
                method: 'PUT',
                url: '/api/games/:id/reviews'
            }
        });
    });