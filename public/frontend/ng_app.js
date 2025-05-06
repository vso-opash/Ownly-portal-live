/**
 * Angular Bootstrap file
 * @author Minakshi k
 */
(function () {

    'use strict';
    var dependencies = [
        'ngRoute',
        'tmh.dynamicLocale',
        'ngFileUpload',
        'oitozero.ngSweetAlert',
        'ngAnimate',
        'ui.bootstrap',
        'ngSanitize',
        '720kb.tooltips',
        'uiSwitch',
        'LocalStorageModule',
        'ngResource',
        'ngFlash',
        'ngTagsInput',
        'toastr',
        'bootstrapLightbox',
        'blockUI',
        'ui.router',
        'ngStorage',
        'mgcrea.ngStrap',
        'ngCookies',
        'satellizer',
        'ngTable',
        'angularUtils.directives.dirPagination',
        'oc.lazyLoad',
        'isteven-multi-select',
        'ngScrollable',
        'autocomplete',
        'angularFileUpload',
        'ngTextTruncate',
        'ui.tinymce',
        //'AngularXmppServices',
        'ui.calendar',
        'socketService',
        'slick',
        'angular-ladda',
        'ngTagsInput'
    ];
    angular.module('SYNC', dependencies, function ($httpProvider) { });
    angular.module('SYNC').constant('LOCALES', {
        'locales': {
            'en_US': 'English'
        },
        'preferredLocale': 'en_US'
    });
    angular.module('SYNC').directive('validPasswordC', function () {
        return {
            require: 'ngModel',
            scope: {

                reference: '=validPasswordC'

            },
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue, $scope) {

                    var noMatch = viewValue != scope.reference
                    ctrl.$setValidity('noMatch', !noMatch);
                    return (noMatch) ? noMatch : !noMatch;
                });

                scope.$watch("reference", function (value) {
                    ;
                    ctrl.$setValidity('noMatch', value === ctrl.$viewValue);

                });
            }
        }
    });
    angular.module('SYNC').constant('APP_CONST', (function () {
        return {
            DATE_FORAMT: 'MM/dd/yyyy',
            DEFAULT_FORAMT: "0000-00-00"
        };
    })());
    angular.module('SYNC').constant('BASE_URL', (function () {
        return {
            // URL: "http://52.64.215.66:5095/"
            // for staging - syncitt
            URL: "http://portal.syncitt.world/"
            // for Production - ownly
            // URL: "http://portal.ownly.com.au/"
        };
    })());
    angular.module('SYNC').config(function ($routeProvider, $httpProvider, $locationProvider, $stateProvider, toastrConfig, $urlRouterProvider, $authProvider) {
        //toastr settings
        // console.log('to be hit', baseUrl + '/api/auth/facebooklogin');
        // $authProvider.facebook({
        //     // clientId: '522806651720565',
        //     // responseType: 'token',
        //     clientId: facebook_client_id,
        //     // url: baseUrl + '/api/auth/facebooklogin',
        //     //redirectUri: 'http://propertymarketplace.tk:5074',
        // });

        // $authProvider.oauth2({
        //     name: 'facebook',
        //     url: '/auth/facebook',
        //     clientId: facebook_client_id,
        //     redirectUri: window.location.origin + '/',
        //     authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
        //     defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
        //     requiredUrlParams: null,
        //     optionalUrlParams: null,
        //     scope: ['email'],
        //     scopePrefix: null,
        //     scopeDelimiter: ',',
        //     state: null,
        //     oauthType: '2.0',
        //     popupOptions: { width: 580, height: 400 },
        //     responseType: 'token',
        //     responseParams: {
        //         code: 'code',
        //         clientId: 'clientId',
        //         redirectUri: 'redirectUri'
        //     }
        // });

        // $authProvider.httpInterceptor = function () { return true; },
        //     $authProvider.withCredentials = false;
        // $authProvider.tokenRoot = null;
        // $authProvider.baseUrl = '/';
        // $authProvider.loginUrl = '/auth/login';
        // $authProvider.signupUrl = '/auth/signup';
        // $authProvider.unlinkUrl = '/auth/unlink/';
        // $authProvider.tokenName = 'token';
        // $authProvider.tokenPrefix = 'satellizer';
        // $authProvider.tokenHeader = 'Authorization';
        // $authProvider.tokenType = 'Bearer';
        // $authProvider.storageType = 'localStorage';
        // Facebook
        $authProvider.facebook({
            name: 'facebook',
            url: '/auth/facebook',
            clientId: facebook_client_id,
            authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
            redirectUri: window.location.origin + '/',
            requiredUrlParams: ['display', 'scope'],
            scope: ['email'],
            scopeDelimiter: ',',
            display: 'popup',
            oauthType: '2.0',
            popupOptions: { width: 580, height: 400 }
        });

        // Google
        $authProvider.google({
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
            clientId: '1057447651047-n6trglkmmcu55de5j0etr4jj6pbo7i1v.apps.googleusercontent.com',
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display'],
            scope: ['profile', 'email'],
            scopePrefix: 'openid',
            scopeDelimiter: ' ',
            display: 'popup',
            oauthType: '2.0',
            popupOptions: { width: 452, height: 633 }
        });


        angular.extend(toastrConfig, {
            positionClass: 'toast-top-right',
            preventOpenDuplicates: true,
            closeButton: false,
            progressBar: true,
        });
        // ****************** Provide Support to IE **********************
        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        // disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
        // **************************** End ******************************
        $httpProvider.interceptors.push(function ($q, $location, $localStorage, $rootScope) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    config.headers['authorization'] = $localStorage.token;
                    // config.headers['authorization'] = 'asdasdfasdfasfadfsadsfsdafsdafadsffds';
                    return config;
                },
                response: function (response) {
                    if (response.data.code == 401) {
                        delete $localStorage.token;
                        $localStorage.userLoggedIn = false;
                        // console.log('goto login');
                        // handle the case where the user is not authenticated
                        $location.path('/login');
                    }
                    return response || $q.when(response);
                }
            };
        });
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix("!");

        $stateProvider
            .state('home', {
                url: '/',
                title: 'Home',
                menu: 'home',
                cache: false,
                label: 'Home',
                controller: 'PropertyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/dashboard/views/dashboard.html',
                        controller: 'LandingCtrl'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/controllers/controllers.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    },
                    permitted: isPermitted('dashboard')
                }
            })
            /*.state('home', {
                url: '/',
                title: 'Home',
                menu: 'home',
                cache: false,
                label: 'Home',
                controller: 'HomeCtrl',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/home/views/home.html',
                        controller: 'HomeCtrl'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/home/home_ng_controller.js',
                                '/assets/modules/controllers/controllers.js'
                            ]
                        });
                    },
                }
            }) */
            .state('login', {
                title: 'userLogin',
                url: '/login',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/login1.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'login',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js'
                            ]
                        });
                    },
                    loggedin: isLogedIn()
                }
            })
            .state('signupStep1', {
                title: 'signup',
                url: '/signup',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/registrationstep1.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'login',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })
            .state('signupStep1forStrataManager', {
                title: 'strata_manager',
                url: '/strata_manager/:id',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/registrationstep2.html',
                        controller: 'loginController'
                    }
                },
                params: { name: 'strata_manager' },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'login',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })
            .state('signupStep1forPropertyManager', {
                title: 'property_manager',
                url: '/property_manager/:id',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/registrationstep2.html',
                        controller: 'loginController'
                    }
                },
                params: { name: 'property_manager' },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'login',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })
            .state('signupStep1forPropertyOwner', {
                title: 'property_owner',
                url: '/property_owner/:id',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/registrationstep2.html',
                        controller: 'loginController'
                    }
                },
                params: { name: 'property_owner' },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'login',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })
            .state('welcomeScreen', {
                title: 'welcome',
                url: '/welcome',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/welcome.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'welcomeScreen',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
                // permitted: isPermitted('welcome')
            })
            .state('activeUser', {
                title: 'activeUser',
                url: '/activeUser/:id',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/activeUser.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'activeUser',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    },
                    activate: activate()
                }
            })
            .state('activeUserAccount', {
                title: 'activeUserAccount',
                url: '/activeUserAccount/:id/:mr_id',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/activeUser.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'activeUserAccount',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    },
                    activatedAccountautologin: activatedAccountautologin()
                }
            })
            .state('newUsers', {
                title: 'newUser',
                url: '/newUser/:id',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/inviteUser.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'newUsers',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })
            .state('signupStep2', {
                title: 'signup',
                url: '/signup',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/registrationstep2.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'signupStep2',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })
            .state('verifyUser', {
                title: 'verifyUser',
                url: '/verifyUser/:id',
                cache: false,
                controller: 'loginController',
                views: {
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/verify-user.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'verifyUser',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })
            .state('tenant_invitation_request', {
                title: 'tenant_invitation_request',
                url: '/tenant_invitation_request/:id',
                cache: false,
                controller: 'loginController',
                views: {
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/tenant_invitation.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'check_tenent_request',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })
            .state('forgotPassword', {
                title: 'forgotPassword',
                url: '/forgotPassword',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/forgot-password.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'forgotPassword',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })
            .state('resetPassword', {
                title: 'resetPassword',
                url: '/resetPassword/:id',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/reset-password.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'resetPassword',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })
            .state('reGeneratePassword', {
                title: 'reGeneratePassword',
                url: '/reGeneratePasswordLink',
                cache: false,
                controller: 'loginController',
                views: {
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/regenrateVerificationCode.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'reGeneratePassword',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })
            .state('error', {
                title: 'pageNotFound',
                url: '/pageNotFound',
                cache: false,
                controller: 'loginController',
                views: {
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/404.html',
                        controller: 'loginController'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'error',
                            files: [
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    }
                }
            })

            .state('setting', {
                title: 'setting',
                url: '/setting',
                cache: false,
                controller: 'UserCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/users/views/user_edit.html',
                        controller: 'UserCtrl'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'setting',
                            files: ['/assets/modules/users/user_ng_controller.js',
                                '/assets/modules/users/services/userService.js',
                                '/assets/modules/agencies/services/agencyService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js',

                            ]
                        });
                    },
                    permitted: isPermitted('setting')
                }
            })
            .state('maintance_listing', {
                title: 'maintance_listing',
                url: '/maintance_listing',
                cache: false,
                controller: 'MaintenanceCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/maintenance/views/listing.html',
                        controller: 'MaintenanceCtrl'
                    },
                    'footer': {
                        // templateUrl: '/frontend/modules/partials/views/home_footer.html',
                        // controller: 'FooterCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'maintance_listing',
                            files: [
                                '/assets/modules/maintenance/maintenance_ng_controller.js',
                                '/assets/modules/maintenance/services/maintenanceService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/users/services/userService.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/properties/property_ng_controller.js',

                            ]
                        });
                    }
                }
            })
            .state('maintance_detail', {
                title: 'maintance_detail',
                url: '/maintance_detail/:id',
                cache: false,
                controller: 'MaintenanceCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/maintenance/views/detail.html',
                        controller: 'MaintenanceCtrl'
                    },
                    'footer': {
                        // templateUrl: '/frontend/modules/partials/views/home_footer.html',
                        // controller: 'FooterCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'maintance_listing',
                            files: [
                                '/assets/modules/maintenance/maintenance_ng_controller.js',
                                '/assets/modules/maintenance/services/maintenanceService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js'
                            ]
                        });
                    }
                },
            })
            .state('quote_detail', {
                title: 'quote_detail',
                url: '/quote_detail/:id/:trader_id',
                cache: false,
                controller: 'MaintenanceCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/maintenance/views/detail.html',
                        controller: 'MaintenanceCtrl'
                    },
                    'footer': {
                        // templateUrl: '/frontend/modules/partials/views/home_footer.html',
                        // controller: 'FooterCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'maintance_listing',
                            files: [
                                '/assets/modules/maintenance/maintenance_ng_controller.js',
                                '/assets/modules/maintenance/services/maintenanceService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js'
                            ]
                        });
                    }
                },
            })
            .state('job_detail', {
                title: 'job_detail',
                url: '/job_detail/:id',
                cache: false,
                controller: 'MaintenanceCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/maintenance/views/job_details.html',
                        controller: 'MaintenanceCtrl'
                    },
                    'footer': {
                        // templateUrl: '/frontend/modules/partials/views/home_footer.html',
                        // controller: 'FooterCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'maintance_listing',
                            files: [
                                '/assets/modules/maintenance/maintenance_ng_controller.js',
                                '/assets/modules/maintenance/services/maintenanceService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js'
                            ]
                        });
                    }
                },
            })
            .state('welcome', {
                title: 'welcome',
                url: '/welcomeScreen',
                cache: false,
                controller: 'UserCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/authentication/views/welcomeScreen.html',
                        controller: 'loginController'
                    },
                    'footer': {
                        // templateUrl: '/frontend/modules/partials/views/home_footer.html',
                        // controller: 'FooterCtrl'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: ['/assets/modules/users/services/userService.js',
                                '/assets/css/theme_styles.css',
                                '/assets/css/custom_style.css',
                                '/assets/modules/authentication/controller.js',
                                '/assets/modules/authentication/services/service.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })
            .state('chat', {
                title: 'chat',
                url: '/chatScreen/:id',
                cache: false,
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/chat/views/chat.html',
                        controller: 'ChatCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'chat',
                            files: [
                                // '/assets/modules/chat/services/chatService.js',
                                '/assets/modules/chat/chat_ng_controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/agents/services/agentService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    },
                    // permitted: isPermitted('messages'),
                    usrlist: function (chatService, $localStorage) {

                        let postData = {
                            "user_id": $localStorage.loggedInUserId
                        };

                        let promise = new Promise(function (resolve, reject) {
                            chatService.getChatUserList().post(postData, function (resp) {
                                resolve(resp.data);
                            });
                        });

                        return promise;
                    }
                }
            })
            .state('profile', {
                title: 'profile',
                url: '/profile/:id',
                cache: false,
                controller: 'UserCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/users/views/profile.html',
                        controller: 'UserCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: ['/assets/modules/users/services/userService.js',
                                '/assets/modules/users/user_ng_controller.js',
                                '/assets/modules/agencies/services/agencyService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })
            .state('rentalCase', {
                title: 'rentalCase',
                url: '/rental_case',
                cache: false,
                controller: 'RentalCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/rental/views/case.html',
                        controller: 'RentalCtrl'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'rentalCase',
                            files: ['/assets/modules/users/services/userService.js',
                                '/assets/modules/users/user_ng_controller.js',
                                '/assets/modules/rental/views/case.html',
                                '/assets/modules/rental/rental_ng_controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })
            .state('addAgreement', {
                title: 'addAgreement',
                url: '/add_agreement',
                cache: false,
                controller: 'AgreementCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/agreement/views/add.html',
                        controller: 'AgreementCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'addAgreement',
                            files: ['/assets/modules/users/services/userService.js',
                                '/assets/modules/users/user_ng_controller.js',
                                '/assets/modules/agreement/views/add.html',
                                '/assets/modules/agreement/agreement_ng_controller.js',
                                '/assets/modules/agreement/services/agreementService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })
            .state('bulkUploadListing', {
                title: 'bulk_upload_listing',
                url: '/bulk_upload_listing',
                cache: false,
                controller: 'AgreementCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/agreement/views/agreement_bulk_upload.html',
                        controller: 'AgreementCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'addAgreement',
                            files: ['/assets/modules/users/services/userService.js',
                                '/assets/modules/users/user_ng_controller.js',
                                '/assets/modules/agreement/views/add.html',
                                '/assets/modules/agreement/agreement_ng_controller.js',
                                '/assets/modules/agreement/services/agreementService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })
            .state('editAgreement', {
                title: 'editAgreement',
                url: '/edit_agreement/:id',
                cache: false,
                controller: 'AgreementCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/agreement/views/edit.html',
                        controller: 'AgreementCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'editAgreement',
                            files: ['/assets/modules/users/services/userService.js',
                                '/assets/modules/users/user_ng_controller.js',
                                '/assets/modules/agreement/views/add.html',
                                '/assets/modules/agreement/agreement_ng_controller.js',
                                '/assets/modules/agreement/services/agreementService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })
            .state('editBulkAgreement', {
                title: 'editBulkAgreement',
                cache: false,
                url: '/edit_bulk_agreement/:id',
                controller: 'AgreementCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/agreement/views/edit_bulk.html',
                        controller: 'AgreementCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'editAgreement',
                            files: ['/assets/modules/users/services/userService.js',
                                '/assets/modules/users/user_ng_controller.js',
                                '/assets/modules/agreement/views/add.html',
                                '/assets/modules/agreement/agreement_ng_controller.js',
                                '/assets/modules/agreement/services/agreementService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })
            .state('detailAgreement', {
                title: 'detailAgreement',
                url: '/detail_agreement/:id',
                cache: false,
                controller: 'AgreementCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/agreement/views/detail.html',
                        controller: 'AgreementCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'detailAgreement',
                            files: ['/assets/modules/users/services/userService.js',
                                '/assets/modules/users/user_ng_controller.js',
                                '/assets/modules/agreement/views/add.html',
                                '/assets/modules/agreement/agreement_ng_controller.js',
                                '/assets/modules/agreement/services/agreementService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })
            .state('dispute', {
                title: 'dispute',
                url: '/dispute',
                cache: false,
                controller: 'UserCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/disputes/views/dispute.html',
                        controller: 'DisputesCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'dispute',
                            files: ['/assets/modules/disputes/services/disputeService.js',
                                '/assets/modules/disputes/disputes_ng_controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',]
                        });
                    }
                }
            })
            .state('dispute_details', {
                title: 'dispute_details',
                url: '/dispute_details/:id',
                cache: false,
                controller: 'UserCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/disputes/views/dispute_details.html',
                        controller: 'DisputesCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'dispute',
                            files: ['/assets/modules/disputes/services/disputeService.js',
                                '/assets/modules/disputes/disputes_ng_controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',]
                        });
                    }
                }
            })
            .state('agreement_listing', {
                title: 'agreement_listing',
                url: '/agreement_listing',
                cache: false,
                controller: 'AgreementCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/agreement/views/listing.html',
                        controller: 'AgreementCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'agreement_listing',
                            files: [
                                '/assets/modules/agreement/services/agreementService.js',
                                '/assets/modules/agreement/agreement_ng_controller.js',
                                '/assets/modules/users/services/userService.js',
                                '/assets/modules/users/user_ng_controller.js',
                                // '/assets/modules/agreement/views/agreement.html',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js'
                            ]
                        });
                    }
                }
            })
            .state('fileListing', {
                title: 'fileListing',
                url: '/file_listing',
                cache: false,
                controller: 'UserCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/files/views/files_listing.html',
                        controller: 'MyFilesCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: ['/assets/modules/files/services/fileService.js',
                                '/assets/modules/files/file_ng_controller.js',
                                '/assets/modules/agencies/services/agencyService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    },
                    permitted: isPermitted('myFile')
                }
            })
            .state('noticeBoardListing', {
                title: 'noticeBoardListing',
                url: '/notice_board_listing',
                cache: false,
                controller: 'NoticeBoardCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/notice board/views/listing.html',
                        controller: 'NoticeBoardCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'noticeBoardListing',
                            files: [
                                '/assets/modules/notice board/notice_board_ng_controller.js',
                                '/assets/modules/notice board/services/notice_board_service.js',
                                '/assets/modules/agencies/services/agencyService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })
            .state('noticeBoardDetail', {
                title: 'noticeBoardDetail',
                url: '/notice_board_detail/:id',
                cache: false,
                controller: 'NoticeBoardCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/notice board/views/detail.html',
                        controller: 'NoticeBoardCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'noticeBoardDetail',
                            files: [
                                '/assets/modules/notice board/notice_board_ng_controller.js',
                                '/assets/modules/notice board/services/notice_board_service.js',
                                '/assets/modules/agencies/services/agencyService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })
            .state('noticePostDetail', {
                title: 'noticePostDetail',
                url: '/notice_post_detail/:id',
                cache: false,
                controller: 'NoticeBoardCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/notice board/views/post_detail.html',
                        controller: 'NoticeBoardCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'noticeBoardDetail',
                            files: [
                                '/assets/modules/notice board/notice_board_ng_controller.js',
                                '/assets/modules/notice board/services/notice_board_service.js',
                                '/assets/modules/agencies/services/agencyService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })

            .state('agencyProfile', {
                title: 'agency_profile',
                url: '/agency_profile/:id',
                cache: false,
                controller: 'AgencyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/agencies/views/profile.html',
                        controller: 'AgencyCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'agency_profile',
                            files: ['/assets/modules/agencies/services/agencyService.js',
                                '/assets/modules/agencies/agency_ng_controller.js',
                                '/assets/css/owl.carousel.min.css',
                                '/assets/css/owl.theme.default.min.css',
                                '/assets/javascripts/owl.carousel.js',
                                '/assets/modules/users/services/userService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    }
                }
            })
            .state('traderProfile', {
                title: 'trader_profile',
                url: '/trader_profile/:id',
                cache: false,
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/traders/views/profile.html',
                        controller: 'TraderCtrl'
                    }
                },
                resolve: {
                    // you can lazy load files for an existing module
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'trader_profile',
                            files: [
                                '/assets/modules/traders/services/traderService.js',
                                '/assets/modules/traders/trader_ng_controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js'
                            ]
                        });
                    },
                }
            })
            .state('tenantProfile', {
                title: 'tenant_profile',
                url: '/tenant_profile/:id',
                cache: false,
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/tenants/views/profile.html',
                        controller: 'TenantCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'trader_profile',
                            files: [
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/tenants/tenant_ng_controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/maintenance/services/maintenanceService.js'

                            ]
                        });
                    }
                }
            })
            .state('ownerProfile', {
                title: 'owner_profile',
                url: '/owner_profile/:id',
                cache: false,
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/owners/views/profile.html',
                        controller: 'OwnerCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'owner_profile',
                            files: [
                                '/assets/modules/owners/services/ownerService.js',
                                '/assets/modules/owners/owner_ng_controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/maintenance/services/maintenanceService.js'

                            ]
                        });
                    }
                }
            })
            .state('tenants_listing', {
                title: 'tenants_listing',
                url: '/tenants_listing',
                cache: false,
                controller: 'TenantCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/tenants/views/listing.html',
                        controller: 'TenantCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'tenants_listing',
                            files: ['/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/tenants/tenant_ng_controller.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    },
                    permitted: isPermitted('tenants_listing'),
                }
            })
            .state('agents_listing', {
                title: 'agents_listing',
                cache: false,
                url: '/agents_listing',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/agents/views/listing.html',
                        controller: 'AgentCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: ['/assets/modules/agents/agent_ng_controller.js',
                                '/assets/modules/agents/services/agentService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    },
                    permitted: isPermitted('agents_listing')
                }
            })
            // agency hub
            .state('agencyhub', {
                title: 'agencyhub',
                cache: false,
                url: '/agencyhub',
                controller: 'AgencyhubCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/agencyhub/views/listing.html',
                        controller: 'AgencyhubCtrl'
                    }
                },
                resolve: {
                    // check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/agencyhub/agencyhub_ng_controller.js',
                                '/assets/modules/agencyhub/services/AgencyhubService.js']
                        });
                    },
                    permitted: isPermitted('agencyhub')
                }
            })
            .state('Starta_user_listing', {
                title: 'Starta_user_listing',
                cache: false,
                url: '/Starta_user_listing',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/startaUsers/views/listing.html',
                        controller: 'StratUserCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: ['/assets/modules/startaUsers/starta_users_ng_controller.js',
                                '/assets/modules/startaUsers/services/agentService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                            ]
                        });
                    },
                    // permitted: isPermitted('tenants_listing')
                }
            })
            .state('trader_listing', {
                title: 'trader_listing',
                url: '/trader_listing',
                cache: false,
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/traders/views/listing.html',
                        controller: 'TraderCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'trader_listing',
                            files: ['/assets/modules/traders/trader_ng_controller.js',
                                '/assets/modules/traders/services/traderService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    },
                    permitted: isPermitted('trader_listing')
                }
            })
            .state('trader_location', {
                title: 'trader_location',
                url: '/trader_location',
                cache: false,
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/traders/views/traders_location.html',
                        controller: 'TraderCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'trader_listing',
                            files: ['/assets/modules/traders/trader_ng_controller.js',
                                '/assets/modules/traders/services/traderService.js',
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    },
                    permitted: isPermitted('trader_listing')
                }
            })
            .state('dashboard', {
                title: 'dashboard',
                url: '/dashboard',
                cache: false,
                controller: 'PropertyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/dashboard/views/dashboard.html',
                        controller: 'LandingCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/controllers/controllers.js',
                                '/assets/modules/users/services/userService.js']
                        });
                    },
                    permitted: isPermitted('dashboard')
                }
            })
            .state('createProperty', {
                title: 'create_property',
                url: '/create_property',
                cache: false,
                controller: 'PropertyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/properties/views/create_property.html',
                        controller: 'PropertyCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js']
                        });
                    },
                    permitted: isPermitted('create_property')
                }
            })
            .state('editProperty', {
                title: 'edit_property',
                url: '/edit_property/:id',
                cache: false,
                controller: 'PropertyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/properties/views/edit_property.html',
                        controller: 'PropertyCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js']
                        });
                    },
                    permitted: isPermitted('edit_property')
                }
            })
            .state('applicationProperty', {
                title: 'application_property',
                url: '/application_property/:id',
                cache: false,
                controller: 'PropertyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/properties/views/application_for_property.html',
                        controller: 'PropertyCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js']
                        });
                    },
                    permitted: isPermitted('application_property')
                }
            })
            .state('applicationView', {
                title: 'view_application',
                url: '/view_application/:id',
                cache: false,
                controller: 'PropertyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/properties/views/application_details.html',
                        controller: 'PropertyCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js']
                        });
                    },
                    permitted: isPermitted('view_application')
                }
            })
            .state('globalSearch', {
                title: 'global Search',
                url: '/global_search/:key',
                cache: false,
                controller: 'PropertyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/partials/views/global_search.html',
                        controller: 'globalSearchCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js']
                        });
                    }
                }
            })
            .state('propertyListing', {
                title: 'property_listing',
                url: '/property_listing',
                cache: false,
                controller: 'PropertyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/properties/views/property_listing.html',
                        controller: 'PropertyCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    },
                    permitted: isPermitted('property_listing')
                }
            })
            .state('propertyLocation', {
                title: 'property_location',
                url: '/property_location/:id',
                cache: false,
                controller: 'PropertyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/properties/views/property_location.html',
                        controller: 'PropertyCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js']
                        });
                    },
                    permitted: isPermitted('property_listing')
                }
            })
            .state('notificationList', {
                title: 'notification_list',
                url: '/notification_list',
                cache: false,
                controller: 'NotificationCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/notification/views/notification.html',
                        controller: 'NotificationCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'notificationList',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/notification/services/notificationServices.js',
                                '/assets/modules/notification/notification_ng_controller.js',
                            ]
                        });
                    },
                    permitted: isPermitted('property_listing')
                }
            })
            .state('propertyAgreement', {
                title: 'propertyAgreement',
                url: '/upload_property_document/:id',
                cache: false,
                controller: 'PropertyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/properties/views/agreement.html',
                        controller: 'PropertyCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'property_document',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js',]
                        });
                    },
                    permitted: isPermitted('property_details')
                }
            })
            .state('propertyDetails', {
                title: 'property_details',
                url: '/property_details/:id',
                cache: false,
                controller: 'PropertyCtrl',
                views: {
                    'left_navigation': {
                        templateUrl: '/frontend/modules/partials/views/left_navigation.html',
                        controller: 'LandingCtrl'
                    },
                    'header': {
                        templateUrl: '/frontend/modules/partials/views/home_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/frontend/modules/properties/views/property_details.html',
                        controller: 'PropertyCtrl'
                    }
                },
                resolve: {
                    check_trader_request: check_trader_request(),
                    // you can lazy load files for an existing module
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: [
                                '/assets/modules/properties/services/propertyServices.js',
                                '/assets/modules/properties/property_ng_controller.js',
                                '/assets/modules/tenants/services/tenantService.js',
                                '/assets/modules/maintenance/services/maintenanceService.js',]
                        });
                    },
                    permitted: isPermitted('property_details')
                }
            })

        // $urlRouterProvider.otherwise('/login');
        $urlRouterProvider.otherwise('/');

    });
    angular.module('SYNC').filter('replace', [function () {
        return function (input, from, to) {
            if (input === undefined) {
                return;
            }
            var regex = new RegExp(from, 'g');
            return input.replace(regex, to);
        };
    }]);

    angular.module('SYNC').run(function ($http, $localStorage) {
        $http.defaults.headers.common.authorization = ($localStorage.token) ? $localStorage.token : '';

    });

}());
var isLogedIn = function ($localStorage, $location) {
    return [
        "$localStorage",
        '$location',
        function ($localStorage, $location) {
            if ($localStorage.userLoggedIn) {
                $location.path("/dashboard");
            }
        }
    ];
}
var activate = function () {
    return [
        "$q",
        "$rootScope",
        "$location",
        '$http',
        "permissions",
        "$localStorage",
        "$state",
        "$stateParams",
        "toastr",
        function ($q, $rootScope, $location, $http, permissions, $localStorage, $state, $stateParams, toastr) {
            var id = $stateParams.id;
            var user = {};
            user.user_id = id;
            $http.post(baseUrl + '/api/directLogin', user)
                .success(function (response) {
                    var errorMessage = '';
                    var obj = {};
                    obj.userId = $localStorage.loggedInUserId;
                    if (response.code == 200) {
                        $localStorage.userLoggedIn = true;
                        $localStorage.isLoggedIn = true;
                        $localStorage.loggedInfirstname = response.data.userInfo.firstname;
                        $localStorage.loggedInlastname = response.data.userInfo.lastname;
                        $localStorage.loggedInUserId = response.data.userInfo._id;
                        $localStorage.userData = response.data.userInfo;
                        $rootScope.userName = response.data.firstname + ' ' + response.data.lastname;
                        $localStorage.token = response.token;
                        $localStorage.role_id = response.data.roleInfo.role_id;
                        $rootScope.isLoggedIn = true;
                        $localStorage.userLoggedIn == true
                        if ($localStorage.userData.is_active) {
                            $location.path('/login');
                            $rootScope.isLoggedIn = false;
                            toastr.error("Sorry,the link you are accessing is expired");
                            $localStorage.userLoggedIn = false;
                            $localStorage.loggedInUserId = '';
                            $localStorage.loggedInfirstname = '';
                            $localStorage.loggedInlastname = '';
                            $localStorage.permission = '';
                            $localStorage.role_id = '';
                            $localStorage.userData = '';
                            $localStorage.isLoggedIn = false;
                            $localStorage.token = '';
                            $rootScope.role = '';
                            $localStorage.defaultRoleId = '';
                        }
                        // console.log("$localStorage.role_id",$localStorage.role_id);
                        var data = {
                            user_id: $localStorage.loggedInUserId,
                            role_id: $localStorage.role_id
                        };
                        // $state.go('welcome');
                        if ($localStorage.role_id != "undefined" && ($localStorage.loggedInUserId != "undefined" && $localStorage.userLoggedIn == true)) {
                            $http.post(baseUrl + '/api/getUserPermission', data)
                                .success(function (response) {
                                    if (response.code === 200) {
                                        $rootScope.permission = response.data;
                                        $localStorage.permission = $rootScope.permission;
                                        $rootScope.isAssociatedWithAgency = ($localStorage.userData.agency_id) ? true : false;
                                        // console.log("roleId", roleId);
                                        $rootScope.canCreateProperty = ($localStorage.role_id == roleId.agent || $localStorage.role_id == roleId.ownAgency || $localStorage.role_id == roleId.owner) ? true : false;
                                        $state.go('welcome');
                                        // if (($rootScope.permission).indexOf(currentState) == -1 && currentState != ''&& currentState!='dashboard') {
                                        //     event.preventDefault();
                                        //     toastr.warning("You do not have access permission");
                                        //     $state.go('welcome');
                                        // }
                                        deferred.resolve(true);
                                    }
                                });
                        }
                    } else {
                        toastr.warning("Activation link expires or your account is already activated");
                        // $state.go('login');
                    }
                });
            return deferred.promise;
        }
    ];
}

var activatedAccountautologin = function () {
    return [
        "$q",
        "$rootScope",
        "$location",
        '$http',
        "permissions",
        "$localStorage",
        "$state",
        "$stateParams",
        "maintainService",
        "toastr",
        function ($q, $rootScope, $location, $http, permissions, $localStorage, $state, $stateParams, maintainService, toastr) {
            var id = $stateParams.id;
            var mr_id = $stateParams.mr_id;
            var user = {};
            user.user_id = id;
            $http.post(baseUrl + '/api/directLoginActivatedAccount', user)
                .success(function (response) {
                    var errorMessage = '';
                    var obj = {};
                    obj.userId = $localStorage.loggedInUserId;
                    if (response.code == 200) {
                        $localStorage.userLoggedIn = true;
                        $localStorage.isLoggedIn = true;
                        $localStorage.loggedInfirstname = response.data.userInfo.firstname;
                        $localStorage.loggedInlastname = response.data.userInfo.lastname;
                        $localStorage.loggedInUserId = response.data.userInfo._id;
                        $localStorage.userData = response.data.userInfo;
                        $rootScope.userName = response.data.firstname + ' ' + response.data.lastname;
                        $localStorage.token = response.token;
                        $localStorage.role_id = response.data.roleInfo.role_id;
                        $rootScope.isLoggedIn = true;
                        $localStorage.userLoggedIn == true

                        var data = {
                            user_id: $localStorage.loggedInUserId,
                            role_id: $localStorage.role_id
                        };

                        if ($localStorage.role_id != "undefined" && ($localStorage.loggedInUserId != "undefined" && $localStorage.userLoggedIn == true)) {
                            $http.post(baseUrl + '/api/getUserPermission', data)
                                .success(function (response) {
                                    if (response.code === 200) {
                                        $rootScope.permission = response.data;
                                        $localStorage.permission = $rootScope.permission;
                                        $rootScope.isAssociatedWithAgency = ($localStorage.userData.agency_id) ? true : false;

                                        $rootScope.canCreateProperty = ($localStorage.role_id == roleId.agent || $localStorage.role_id == roleId.ownAgency || $localStorage.role_id == roleId.owner) ? true : false;
                                        var obj = { id: $stateParams.mr_id };
                                        maintainService.detailMaintenenace().get(obj, function (response) {
                                            if (response.code == 200) {
                                                var traderBtn = false;
                                                if ($localStorage.role_id == roleId.trader) {
                                                    traderBtn = true;
                                                }

                                                console.log(response.data.request_type + " -- " + !response.data.trader_id);
                                                if (traderBtn == false && response.data && response.data.request_type && response.data.request_type == 1 && !response.data.trader_id) {
                                                    $location.path('job_detail/' + mr_id);
                                                } else {
                                                    $location.path('maintance_detail/' + mr_id);
                                                }
                                            }
                                        });
                                        // deferred.resolve(true);
                                    }
                                });
                        }
                    } else {
                        toastr.warning("Something went wrong. Please try again later.");
                    }
                });
            return deferred.promise;
        }
    ];
}

angular.module('SYNC').directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});
angular.module('socketService', [])
    .factory('socket', function ($rootScope) {
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    })
    .factory("Chat", function ($rootScope, $resource) {
        return {
            read: function () {
                return $resource('/chat/set_read');
            },
            readAll: function () {
                return $resource('/chat/set_readall');
            }
        }
    });

angular.module('SYNC').run([
    '$rootScope',
    '$localStorage',
    '$location',
    '$stateParams',
    '$state',
    'toastr',
    '$timeout',
    function ($rootScope, $localStorage, $location, $stateParams, $state, toastr, $timeout) {

        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            $rootScope.internal_panel = false;

            if (toState.name == 'login' || toState.name == 'signupStep1' || toState.name == 'signupStep1forStrataManager' || toState.name == 'signupStep1forPropertyManager' || toState.name == 'signupStep1forPropertyOwner' || toState.name == 'welcomeScreen' || toState.name == 'activeUser' || toState.name == 'newUsers' || toState.name == 'signupStep2' || toState.name == 'verifyUser' || toState.name == 'tenant_invitation_request' || toState.name == 'forgotPassword' || toState.name == 'resetPassword' || toState.name == 'reGeneratePassword' || toState.name == 'error' || toState.name == 'setting' || toState.name == 'maintance_listing' || toState.name == 'maintance_detail' || toState.name == 'job_detail' || toState.name == 'quote_detail' || toState.name == 'welcome' || toState.name == 'chat' || toState.name == 'profile' || toState.name == 'rentalCase' || toState.name == 'addAgreement' || toState.name == 'bulkUploadListing' || toState.name == 'editAgreement' || toState.name == 'editBulkAgreement' || toState.name == 'detailAgreement' || toState.name == 'dispute' || toState.name == 'dispute_details' || toState.name == 'agreement_listing' || toState.name == 'fileListing' || toState.name == 'noticeBoardListing' || toState.name == 'noticeBoardDetail' || toState.name == 'noticePostDetail' || toState.name == 'agencyProfile' || toState.name == 'traderProfile' || toState.name == 'tenantProfile' || toState.name == 'ownerProfile' || toState.name == 'tenants_listing' || toState.name == 'agents_listing' || toState.name == 'Starta_user_listing' || toState.name == 'trader_listing' || toState.name == 'trader_location' || toState.name == 'dashboard' || toState.name == 'createProperty' || toState.name == 'editProperty' || toState.name == 'applicationProperty' || toState.name == 'applicationView' || toState.name == 'globalSearch' || toState.name == 'propertyListing' || toState.name == 'propertyLocation' || toState.name == 'notificationList' || toState.name == 'propertyAgreement' || toState.name == 'propertyDetails' || toState.name == 'agencyhub') {
                $rootScope.internal_panel = true;
            }
            $rootScope.internal_panel_class = '';
            $timeout(function () {
                if (toState.name == 'login' || toState.name == 'signupStep1' || toState.name == 'signupStep1forStrataManager' || toState.name == 'signupStep1forPropertyManager' || toState.name == 'signupStep1forPropertyOwner' || toState.name == 'newUsers' || toState.name == 'signupStep2' || toState.name == 'verifyUser' || toState.name == 'tenant_invitation_request' || toState.name == 'forgotPassword' || toState.name == 'resetPassword' || toState.name == 'reGeneratePassword') {
                    $rootScope.internal_panel_class = 'login-register-forgate-password';
                    var myEl = angular.element(document.querySelector('body'));
                    myEl.addClass($rootScope.internal_panel_class);
                }
                else {
                    $rootScope.internal_panel_class = '';
                    var myEl = angular.element(document.querySelector('body'));
                    myEl.removeClass('login-register-forgate-password');
                }
                var currentURL = '',
                    currentURL = window.location.hostname;
                if (currentURL === 'portal.ownly.com.au') {
                    $rootScope.isProd = true;
                    const script = document.createElement('script');
                    script.async = true;
                    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-1BR9CM0WHN';
                    document.head.prepend(script);
                } else {
                    $rootScope.isProd = false;
                }
            });
            $rootScope.isLoggedIn = false;
            if (toState.name == "newUsers" && $localStorage.userLoggedIn && $localStorage.userLoggedIn == true) {
                // console.log("condition true");
                $rootScope.isLoggedIn = false;
                toastr.success("Successfully logged out");
                $localStorage.userLoggedIn = false;
                $localStorage.loggedInUserId = '';
                $localStorage.loggedInfirstname = '';
                $localStorage.loggedInlastname = '';
                $localStorage.permission = '';
                $localStorage.role_id = '';
                $localStorage.userData = '';
                $localStorage.isLoggedIn = false;
                $localStorage.token = '';
                $rootScope.role = '';
                $localStorage.defaultRoleId = '';

            } else if ($localStorage.userLoggedIn && $localStorage.userLoggedIn == true) {
                $rootScope.isLoggedIn = true;
                if (toState.name == "tenant_invitation_request")
                    $location.path('/login');
                else if (toState.name == "dashboard")
                    $location.path('/dashboard');
                else if (toState.name == "home")
                    $location.path('/dashboard');
            }
            else if (toState.name != "newUsers" && toState.name != "forgotPassword" && toState.name != "verifyUser" && toState.name != "resetPassword" && toState.name != "reGeneratePassword" && toState.name != "newUsers" && toState.name != "activeUser" && toState.name != "signupStep2" && toState.name != "signupStep1" && toState.name != "signupStep1forStrataManager" && toState.name != "signupStep1forPropertyManager" && toState.name != "signupStep1forPropertyOwner" && toState.name != "tenant_invitation_request") {
                console.log("login");
                $location.path('/login');
            }
        });
    }
]);

// angular.module('SYNC').run([
//     '$rootScope',
//     '$localStorage',
//     '$location',
//     '$stateParams',
//     '$state',
//     function($rootScope, $localStorage,$location,$stateParams,$state) {
//         $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
//             if ($localStorage.userLoggedIn && $localStorage.userLoggedIn == true && toState.name=="welcome" && $localStorage.userData) {
//                // $scope.name = $localStorage.userData.firstname+" "+$localStorage.userData.lastname;
//                $rootScope.canCreateProperty = ($localStorage.role_id  == roleId.agent || $localStorage.role_id  == roleId.ownAgency|| $localStorage.role_id  == roleId.owner)? true:false;
//                console.log("$rootScope.canCreateProperty",$rootScope.canCreateProperty);
//             }
//         });
//     }
// ]);






function replaceAll(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

angular.module('SYNC').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, { 'event': event });
                });
                event.preventDefault();
            }
        });
    };
});
angular.module('SYNC').directive('enterSubmit', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('keydown', function (event) {
                var code = event.keyCode || event.which;
                if (code === 13) {
                    if (!event.shiftKey) {
                        event.preventDefault();
                        scope.$apply(attrs.enterSubmit);
                        scope.text = '';
                        scope.private_Message = '';
                    }
                }
            });
        }
    }
});
angular.module('SYNC').directive("disableLink", function () {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {
            $(elem).click(function () {
                $().JqueryFunction();
            });
        }
    }
});

var check_trader_request = function () {

    return [
        "$q",
        "$rootScope",
        "$location",
        '$http',
        "permissions",
        "$localStorage",
        "$state",
        "toastr",
        "$timeout",
        'SweetAlert',
        function ($q, $rootScope, $location, $http, permissions, $localStorage, $state, toastr, $timeout, SweetAlert) {
            $localStorage.subscription_not_done = '';

            if ($localStorage.role_id == roleId.trader) {
                var userData = {
                    "userId": $localStorage.loggedInUserId,
                    "roleId": $localStorage.role_id
                }
                $http.post(baseUrl + '/api/getUserDetails', userData)
                    .success(function (response) {
                        if (response.code === 200) {
                            // Removed required Subscription
                            // if (response.data && response.data.subscription_id) {
                            //     $localStorage.subscription_not_done = 'no';
                            // } else {
                            //     $state.go('setting');
                            //     // $location.path('/setting');
                            //     $localStorage.subscription_not_done = 'yes';
                            //     //Disallow to access pages
                            //     swal({
                            //         title: "",
                            //         text: "Please Activate your Account by Selecting a Plan",
                            //         // imageUrl: '/assets/images/logo1.png',
                            //         imageUrl: '/assets/images/logo-dark.png',
                            //         imageWidth: 10,
                            //         imageHeight: 10,
                            //         maxHeight: 45,
                            //         confirmButtonText: "Okay",
                            //         imageAlt: 'Custom image',
                            //         closeOnConfirm: true
                            //     }, function () {

                            //     });
                            // }



                            // if (response.data && response.data.groups && !response.data.groups.about_user) {
                            if (response.data && (!response.data.mobile_no || !response.data.mobile_no)) {
                                $state.go('setting');
                                //Disallow to access pages
                                // swal({
                                //     title: "",
                                //     text: "Please go to the Settings page to complete your profile",
                                //     // imageUrl: '/assets/images/logo1.png',
                                //     imageUrl: '/assets/images/logo-dark.png',
                                //     imageWidth: 10,
                                //     imageHeight: 10,
                                //     maxHeight: 45,
                                //     confirmButtonText: "Okay",
                                //     imageAlt: 'Custom image',
                                //     closeOnConfirm: true
                                // }, function () {

                                // });

                                toastr.warning("Please complete Profile.");
                                let HTMLcontent = '<p>Please watch this video for how to best create your Profile</p>' +
                                    '<div style="margin-top:15px;"><video style="height: 100%;width: 100%;" src="https://portal.ownly.com.au/assets/video/Trade_Profile_Set_up.mp4" controls></video></div>';
                                SweetAlert.swal({
                                    title: "",
                                    text: HTMLcontent,
                                    imageUrl: '/assets/images/logo-dark.png',
                                    imageWidth: 10,
                                    imageHeight: 10,
                                    maxHeight: 45,
                                    confirmButtonText: "Okay",
                                    imageAlt: 'Custom image',
                                    closeOnConfirm: true,
                                    html: true
                                });
                            }

                            // Removed required Subscription
                        }
                    });
            }
        }
    ];
};


var isPermitted = function (currentState) {

    return [
        "$q",
        "$rootScope",
        "$location",
        '$http',
        "permissions",
        "$localStorage",
        "$state",
        "toastr",
        function ($q, $rootScope, $location, $http, permissions, $localStorage, $state, toastr) {

            var data = {
                user_id: $localStorage.loggedInUserId,
                role_id: $localStorage.role_id
            };
            if ($localStorage.userLoggedIn == false) {
                $location.path('/login');
            }
            var deferred = $q.defer();
            if ($localStorage.role_id != "und1efined" && ($localStorage.loggedInUserId != "undefined" && $localStorage.userLoggedIn == true)) {
                $http.post(baseUrl + '/api/getUserPermission', data)
                    .success(function (response) {
                        if (response.code === 200) {
                            $rootScope.permission = response.data;
                            $localStorage.permission = $rootScope.permission;
                            $rootScope.isAssociatedWithAgency = ($localStorage.userData.agency_id) ? true : false;

                            if (($rootScope.permission).indexOf(currentState) == -1 && currentState != '' && currentState != 'dashboard') {
                                event.preventDefault();
                                toastr.warning("You do not have access permission");
                                $state.go('dashboard');
                            }
                            deferred.resolve(true);
                        }
                    });
                $http.post(baseUrl + '/api/getUserDefaultRoles', data)
                    .success(function (response) {
                        if (response.code === 200) {
                            $localStorage.defaultRoleId = (response.data) ? response.data.role_id : '';
                            deferred.resolve(true);
                        }
                    });
            }
            return deferred.promise;
        }
    ];
};
angular.module('SYNC').directive('validDate', function ($timeout) {
    return {
        scope: {
            ngModel: '='
        },
        bindToController: true,
        controllerAs: 'vm',
        link: function (scope, element, attrs, ctrl) {
            element.on('blur', function () {
                // using timeout instead of scope.$apply, notify angular of changes
                $timeout(function () {
                    ctrl.ngModel = ctrl.ngModel || new Date();
                });
            });
        },
        controller: function () { }
    }
});
angular.module('SYNC').filter('positive', function () {
    return function (input) {
        if (!input) {
            return 0;
        }

        return Math.abs(input);
    };
});
angular.module('SYNC').filter('titlecase', function () {
    return function (input) {
        var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

        input = input.toLowerCase();
        return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
            if (index > 0 && index + match.length !== title.length &&
                match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                title.charAt(index - 1).search(/[^\s-]/) < 0) {
                return match.toLowerCase();
            }

            if (match.substr(1).search(/[A-Z]|\../) > -1) {
                return match;
            }

            return match.charAt(0).toUpperCase() + match.substr(1);
        });
    }
});

angular.module('SYNC').directive('awLimitLength', function () {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            attrs.$set("ngTrim", "false");
            var limitLength = parseInt(attrs.awLimitLength, 10);// console.log(attrs);
            scope.$watch(attrs.ngModel, function (newValue) {
                if (ngModel.$viewValue && ngModel.$viewValue.length > limitLength) {
                    ngModel.$setViewValue(ngModel.$viewValue.substring(0, limitLength));
                    ngModel.$render();
                }
            });
        }
    };
});


angular.module('SYNC').
    filter('htmlToPlaintext', function () {
        return function (text) {
            return angular.element(text).text();
        }
    }
    );
