angular.module('app')
    .directive('compileHtml', ['$sce', '$parse', '$compile', function($sce, $parse, $compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var expression = $sce.parseAsHtml(attrs.compileHtml);

                var getResult = function () {
                    return expression(scope);
                }

                scope.$watch(getResult, function (newValue) {
                    var linker = $compile(newValue);
                    element.append(linker(scope));
                })
            }
        }
    }]);