angular.module('app', [
    'ngCookies',
    'ngResource',
    'ui.router',
    'ui.tinymce'
])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        var access = roles.accessLevels;

        $stateProvider
            .state('public', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.public
                }
            })
            .state('public.404', {
                url: '/404',
                templateUrl: 'views/partials/404.html'
            })
            .state('public.games', {
                url: '/games',
                templateUrl: 'views/partials/games/list.html',
                controller: 'GamesListCtrl'
            })
            .state('public.games:details', {
                url: '/games/:id',
                templateUrl: 'views/partials/games/detail.html',
                controller: 'GamesDetailsCtrl'
            })
            .state('public.home', {
                url: '/',
                templateUrl: 'views/partials/home.html'
            });

        $stateProvider
            .state('anon', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.anon
                }
            })
            .state('anon.signup', {
                url: '/signup',
                templateUrl: 'views/partials/signup.html',
                controller: 'SignupCtrl'
            })
            .state('anon.signin', {
                url: '/signin',
                templateUrl: 'views/partials/signin.html',
                controller: 'SigninCtrl'
            });

        $stateProvider
            .state('user', {
                template: "<ui-view/>",
                data: {
                    access: access.user
                }
            }).state('user.profile', {
                url: '/profile',
                templateUrl: 'views/partials/user/profile.html',
                controller: 'ProfileCtrl'
            });

        $stateProvider
            .state('admin', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.admin
                }
            })
            .state('admin.admin', {
                url: '/admin',
                templateUrl: 'views/partials/admin/index.html'
            })
            .state('admin.users', {
                url: '/admin/users',
                views: {
                    '': {
                        templateUrl: 'views/partials/admin/index.html'
                    },
                    '@admin.users': {
                        templateUrl: 'views/partials/admin/users/list.html',
                        controller: 'AdminUsersListCtrl'
                    }
                }
            })
            .state('admin.users:edit', {
                url: '/admin/users/:id/edit',
                views: {
                    '': {
                        templateUrl: 'views/partials/admin/index.html'
                    },
                    '@admin.users:edit': {
                        templateUrl: 'views/partials/admin/users/edit.html',
                        controller: 'AdminUsersEditCtrl'
                    }
                }
            })
            .state('admin.users:add', {
                url: '/admin/users/add',
                views: {
                    '': {
                        templateUrl: 'views/partials/admin/index.html'
                    },
                    '@admin.users:add': {
                        templateUrl: 'views/partials/admin/users/add.html',
                        controller: 'AdminUsersAddCtrl'
                    }
                }
            })
            .state('admin.games', {
                url: '/admin/games',
                views: {
                    '': {
                        templateUrl: 'views/partials/admin/index.html'
                    },
                    '@admin.games': {
                        templateUrl: 'views/partials/admin/games/list.html',
                        controller: 'AdminGamesListCtrl'
                    }
                }
            })
            .state('admin.games:add', {
                url: '/admin/games/add',
                views: {
                    '': {
                        templateUrl: 'views/partials/admin/index.html'
                    },
                    '@admin.games:add': {
                        templateUrl: 'views/partials/admin/games/add.html',
                        controller: 'AdminGamesAddCtrl'
                    }
                }
            })
            .state('admin.games:edit', {
                url: '/admin/games/:id/edit',
                views: {
                    '': {
                        templateUrl: 'views/partials/admin/index.html'
                    },
                    '@admin.games:edit': {
                        templateUrl: 'views/partials/admin/games/edit.html',
                        controller: 'AdminGamesEditCtrl'
                    }
                }
            })
            .state('admin.categories', {
                url: '/admin/categories',
                views: {
                    '': {
                        templateUrl: 'views/partials/admin/index.html'
                    },
                    '@admin.categories': {
                        templateUrl: 'views/partials/admin/categories/list.html',
                        controller: 'AdminCategoriesListCtrl'
                    }
                }
            })
            .state('admin.categories:add', {
                url: '/admin/categories/add',
                views: {
                    '': {
                        templateUrl: 'views/partials/admin/index.html'
                    },
                    '@admin.categories:add': {
                        templateUrl: 'views/partials/admin/categories/add.html',
                        controller: 'AdminCategoriesAddCtrl'
                    }
                }
            })
            .state('admin.categories:edit', {
                url: '/admin/categories/:id/edit',
                views: {
                    '': {
                        templateUrl: 'views/partials/admin/index.html'
                    },
                    '@admin.categories:edit': {
                        templateUrl: 'views/partials/admin/categories/edit.html',
                        controller: 'AdminCategoriesEditCtrl'
                    }
                }
            })
        $urlRouterProvider.otherwise('/404');
        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(function($q, $location) {
            return {
                'responseError': function(response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        });
    }])
    .run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            $rootScope.error = '';

            if(!('data' in toState) || !('access' in toState.data)){
                event.preventDefault();
            }
            else if (!Auth.authorize(toState.data.access)) {
                event.preventDefault();

                if(fromState.url === '^') {
                    if(Auth.isLoggedIn()) {
                        $state.go('public.home');
                    } else {
                        $rootScope.error = null;
                        $state.go('anon.signin');
                    }
                }
            }
        });

        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
           $rootScope.previousStateName = fromState.name;
           $rootScope.previousStateParams = fromState.params;
        });

        $rootScope.back = function() {
            if ($rootScope.previousStateName) {
                $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
            }
        };

    }]);