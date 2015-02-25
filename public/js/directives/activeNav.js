angular.module('app')
    .directive('activeNav', ['$location', function($location) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var path = element.find('a')[0].href;
                scope.location = $location;
                scope.$watch('location.absUrl()', function (newPath) {
                    var addr = newPath.replace('http://', ''),
                        domain = '';
                        tmpAddr = '';
                        addrs = [];
                    addr = addr.split('/');
                    domain = 'http://' + addr[0];
                    addr.splice(0, 1);

                    element.removeClass('active');

                    for(var i = 0; i < addr.length; i++) {
                        tmpAddr += '/' + addr[i];

                        if (domain + tmpAddr === path) {
                            element.addClass('active');
                            break;
                        }
                    }
                });
            }
        }
    }]);