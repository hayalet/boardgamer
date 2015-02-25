angular.module('app')
    .directive('typeahead', ['$timeout', function($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                items: '=',
                prompt: '@',
                title: '@',
                href: '@',
                model: '=',
                onSelect: '&'
            },
            link: function(scope, element, attrs) {
                scope.handleSelection = function() {
                    scope.model = '';
                    scope.selected = true;
                };
            },
            templateUrl: 'views/partials/templates/typeahead.html'
        }
    }]);