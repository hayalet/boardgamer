angular.module('app')
    .directive('confirm', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    var message = attrs.confirmMsg;
                    if (message && confirm(message)) {
                        scope.$apply(attrs.confirm);
                    }
                })
            }
        }
    }]);