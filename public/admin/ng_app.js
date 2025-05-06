/**  
 * Angular Bootstrap file
 * @author Ankur A
 */
(function () {

    'use strict';
    var dependencies = [
        'vsGoogleAutocomplete',
        'ngRoute',
        '720kb.datepicker',
        // 'tmh.dynamicLocale',
        // 'ngImgCrop',
        // 'oitozero.ngSweetAlert',
        'ui.bootstrap',
        'ngSanitize',
        'ngFileUpload',
        // '720kb.tooltips',
        // 'ui.bootstrap.datetimepicker',
        // 'uiSwitch',
        'LocalStorageModule',
        'ngResource',
        // 'ngFlash',
        // 'ngTagsInput',
        'toastr',
        'fcsa-number',
        'bootstrapLightbox',
        'blockUI',
        'ui.router',
        'angularFileUpload',
        'ngStorage',
        // 'socketService',
        'mgcrea.ngStrap',
        // 'ngFileUpload',
        'angularUtils.directives.dirPagination',
        'ui.tinymce',
        'ngCookies',
        'satellizer',
        'ngTable',
        'ui.mask',
        'ngCookies',
    ];
    angular.module('TSM_ADMIN', dependencies, function ($httpProvider) { });
    angular.module('TSM_ADMIN').constant('LOCALES', {
        'locales': {
            'en_US': 'English'
        },
        'preferredLocale': 'en_US'
    });
    angular.module('TSM_ADMIN').constant('BASE_URL', (function () {
        return {
            // URL: "http://portal.syncitt.world/"
            URL: "http://portal.ownly.com.au/"
        };
    })());
    angular.module('TSM_ADMIN').config(function ($routeProvider, $httpProvider, $locationProvider, $stateProvider, toastrConfig, $urlRouterProvider, $authProvider) {
        angular.extend(toastrConfig, {
            positionClass: 'toast-top-right',
            preventOpenDuplicates: true,
            closeButton: true,
            progressBar: true,
        });
        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
        $httpProvider.interceptors.push(function ($q, $location, $localStorage) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    config.headers['authorization'] = $localStorage.token;
                    return config;
                },
                response: function (response) {
                    if (response.data.code == 401) {
                        delete $localStorage.token;
                        // handle the case where the user is not authenticated
                        $location.path('/login');
                    }
                    return response || $q.when(response);
                }
            };
        });
        // $httpProvider.interceptors.push('BearerAuthInterceptor');
        // $httpProvider.interceptors.push('authHttpResponseInterceptor');

        // $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';     
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix("!");

        $stateProvider
            .state('home', {
                url: '/home',
                title: 'Home',
                menu: 'home',
                label: 'Home',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/dashboard/views/admin_content.html',
                        controller: 'DashboardCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('userManagement', {
                url: '/userManagement',
                title: 'userManagement',
                menu: 'userManagement',
                label: 'userManagement',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/users/views/management.html',
                        controller: 'UserCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('traderManagement', {
                url: '/traderManagement',
                title: 'traderManagement',
                menu: 'traderManagement',
                label: 'traderManagement',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/trader/views/management.html',
                        controller: 'TraderCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('agencyStatus', {
                url: '/agencyStatus',
                title: 'agencyStatus',
                menu: 'agencyStatus',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/agency/views/agencyListing.html',
                        controller: 'AgencyCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('agentListing', {
                url: '/agentListing/:id',
                title: 'agentListing',
                menu: 'agentListing',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/agency/views/agentListing.html',
                        controller: 'AgencyCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('agentPropertyListing', {
                url: '/agentPropertyListing/:id',
                title: 'agentPropertyListing',
                menu: 'agentPropertyListing',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/properties/views/agentProperty.html',
                        controller: 'PropertyCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('resetPassword', {
                title: 'resetPassword',
                url: '/resetPassword/:id',
                controller: 'AuthCtrl',
                views: {
                    'content': {
                        templateUrl: '/admin/modules/auth/views/reset-password.html',
                        controller: 'AuthCtrl'
                    }
                }
            })
            .state('addUser', {
                url: '/addUser',
                title: 'addUser',
                menu: 'addUser',
                label: 'addUser',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/users/views/addUser.html',
                        controller: 'UserCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('fileListing', {
                url: '/fileListing/:id',
                title: 'fileListing',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/users/views/fileListing.html',
                        controller: 'UserCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('emailTemplate', {
                url: '/propertyManagement/email/:id',
                title: 'emailTemplate',
                menu: 'emailTemplate',
                label: 'emailTemplate',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/properties/views/mailTemplate.html',
                        controller: 'PropertyCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('emailTemplateUser', {
                url: '/userManagement/email/:id',
                title: 'emailTemplate',
                menu: 'emailTemplate',
                label: 'emailTemplate',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/users/views/mailTemplate.html',
                        controller: 'UserCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('propertyManagement', {
                url: '/propertyManagement',
                title: 'propertyManagement',
                menu: 'propertyManagement',
                label: 'propertyManagement',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/properties/views/management.html',
                        controller: 'PropertyCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            // Maintenance Management

            // Listing
            .state('maintenanceManagement', {
                url: '/maintenanceManagement',
                title: 'maintenanceManagement',
                menu: 'maintenanceManagement',
                label: 'maintenanceManagement',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/maintenance/views/listing.html',
                        controller: 'MaintenanceCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })

            // .state('maintenanceManagement', {
            //     url: '/maintenanceManagement',
            //     title: 'maintenanceManagement',
            //     menu: 'maintenanceManagement',
            //     label: 'maintenanceManagement',
            //     views: {
            //         'header': {
            //             templateUrl: '/admin/modules/partials/views/admin_header.html',
            //             controller: 'LandingCtrl',
            //         },
            //         'content': {
            //             templateUrl: '/admin/modules/maintenance/views/listing.html',
            //             controller: 'MaintenanceCtrl',
            //         },
            //         'footer': {
            //             templateUrl: '/admin/modules/partials/views/admin_footer.html',
            //             controller: 'FooterCtrl'
            //         },
            //         resolve: {
            //             isAuthorise: isAuthorise()
            //         }
            //     }
            // })
            .state('userDetail', {
                url: '/userDetail/:id',
                title: 'userDetail',
                menu: 'userDetail',
                label: 'userDetail',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/users/views/viewUser.html',
                        controller: 'UserCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('profileEdit', {
                url: '/profile',
                title: 'profileEdit',
                menu: 'profileEdit',
                label: 'profileEdit',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/users/views/adminProfile.html',
                        controller: 'LandingCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('userEdit', {
                url: '/userEdit/:id',
                title: 'userEdit',
                menu: 'userEdit',
                label: 'userEdit',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/users/views/editUser.html',
                        controller: 'UserCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('propertyDetail', {
                url: '/propertyDetail/:id',
                title: 'propertyDetail',
                menu: 'propertyDetail',
                label: 'propertyManagement',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/properties/views/detail.html',
                        controller: 'DashboardCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('maintenanceListing', {
                url: '/maintenanceListing/:id',
                title: 'maintenanceListing',
                menu: 'maintenanceListing',
                label: 'propertyManagement',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/properties/views/miantenanceList.html',
                        controller: 'PropertyCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            .state('maintenanceDetails', {
                url: '/maintenanceDetails/:id',
                title: 'maintenanceDetails',
                menu: 'maintenanceDetails',
                label: 'propertyManagement',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/properties/views/maintenanceDetails.html',
                        controller: 'PropertyCtrl',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            // Advertising Manager 

            // Listing
            .state('advertisingManager', {
                url: '/advertisingManager',
                title: 'advertisingManager',
                menu: 'advertisingManager',
                label: 'advertisingManager',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/advertisingManager/views/listAdvertise.html',
                        controller: 'AdvertisingController',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            // add advertise
            .state('addAdvertisingManager', {
                url: '/advertisingManager/add',
                title: 'addAdvertisingManager',
                menu: 'addAdvertisingManager',
                label: 'addAdvertisingManager',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/advertisingManager/views/addAdvertise.html',
                        controller: 'AdvertisingController',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            // View advertise
            .state('viewAdvertisingManager', {
                url: '/advertisingManager/detail/:id',
                title: 'viewAdvertisingManager',
                menu: 'viewAdvertisingManager',
                label: 'viewAdvertisingManager',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl',
                    },
                    'content': {
                        templateUrl: '/admin/modules/advertisingManager/views/viewAdvertise.html',
                        controller: 'AdvertisingController',
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    },
                    resolve: {
                        isAuthorise: isAuthorise()
                    }
                }
            })
            // error
            .state('error', {
                title: 'pageNotFound',
                url: '/pageNotFound',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/admin/modules/partials/views/404.html',
                        controller: 'LandingCtrl'
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    }
                }
            }).state('noUserFound', {
                title: 'noUserFound',
                url: '/noUserFound',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/admin/modules/users/views/noUser.html',
                        controller: 'UserCtrl'
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    }
                }
            })
            .state('noPropertyFound', {
                title: 'noPropertyFound',
                url: '/noPropertyFound',
                views: {
                    'header': {
                        templateUrl: '/admin/modules/partials/views/admin_header.html',
                        controller: 'LandingCtrl'
                    },
                    'content': {
                        templateUrl: '/admin/modules/properties/views/noProperty.html',
                        controller: 'PropertyCtrl'
                    },
                    'footer': {
                        templateUrl: '/admin/modules/partials/views/admin_footer.html',
                        controller: 'FooterCtrl'
                    }
                }
            })
            .state('forgotPassword', {
                title: 'forgotPassword',
                url: '/forgotPassword',
                controller: 'AuthCtrl',
                views: {
                    'content': {
                        templateUrl: '/admin/modules/auth/views/forgotPassword.html',
                        controller: 'AuthCtrl'
                    }
                }
            })
            .state('Login', {
                title: 'LoginPage',
                url: '/login',
                controller: 'AuthCtrl',
                views: {
                    'content': {
                        templateUrl: '/admin/modules/auth/views/login.html',
                        controller: 'AuthCtrl'
                    }
                },
                resolve: {
                    isLogedIn: isLogedIn()
                }
            });

        $urlRouterProvider.otherwise('/pageNotFound');
    }); //Config End
    angular.module('TSM_ADMIN').run([
        //"Crud",
        "$rootScope",
        //"permissions",
        "$location",
        function ($rootScope, $location) {
            $rootScope.flash = {};
            $rootScope.flash.text = '';
            $rootScope.flash.type = '';
            $rootScope.flash.timeout = 5000;
            $rootScope.hasFlash = false;
            var path = $location.path();
            var allowed = [
                '/login'
            ];
            if ($location.path().length == 0) {
                $location.path("/login");
            }
        }
    ]);
    angular.module('TSM_ADMIN').run(function ($http, $localStorage, $rootScope) {
        $http.defaults.headers.common.authorization = ($localStorage.token) ? $localStorage.token : '';
    });
}());
var isAuthorise = function () {
    return [
        "$rootScope",
        "$location",
        '$http',
        "permissions",
        "$state",
        "$localStorage",
        function ($rootScope, $location, $http, permissions, $state, $localStorage) {
            var path = $location.path();
            console.log('run method called');
            var allowed = [
                '/login',
            ];
            if (allowed.indexOf(path) !== -1)
                return;
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: baseUrl + "/api/is_admin_loggedin",
            }).success(function (data) {
                if (data.status == 'OK') {
                    $rootScope.isLoggedIn = true;
                    $rootScope.userDetail = data.userid;
                    $rootScope.users = data.userid;
                    deferred.resolve(true);
                    $localStorage.isLoggedIn = ''
                } else {
                    $location.path("/login");
                    $rootScope.isLoggedIn = false;
                }
            })
                .error(function (data) {
                    $("#loginErrMsg").html('<div class="alert alert-danger>Invalid username or password!!</div>');
                });
            return deferred.promise;

        }
    ];
};
var isLogedIn = function ($localStorage, $location) {
    return [
        "$localStorage",
        '$location',
        '$http',
        '$state',
        '$rootScope',
        function ($localStorage, $location, $http, $state, $rootScope) {
            if ($localStorage.token) {
                $http({
                    method: 'GET',
                    url: baseUrl + "/api/is_admin_loggedin",
                }).success(function (data) {
                    if (data.status == 'OK') {
                        console.log("i m ok");
                        $state.go("home");
                        $rootScope.isLoggedIn = true;
                        $rootScope.userDetail = data.user._id;
                        $rootScope.users = data.userid;
                    } else {
                        $state.go("Login");
                    }
                })
                    .error(function (data) {
                        $("#loginErrMsg").html('<div class="alert alert-danger>Invalid username or password!!</div>');
                    });
            } else {
                $state.go("Login");
            }
        }
    ];
};
angular.module('TSM_ADMIN').directive('errSrc', function () {
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

angular.module('TSM_ADMIN').run([
    '$rootScope',
    '$location',
    '$http',
    '$localStorage',
    '$state',
    function ($rootScope, $location, $http, $localStorage, $state) {
        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            if (toState.name === "Login" && fromState.title == 'Home' && $localStorage.adminuserloggedIn) {
                e.preventDefault();
                $rootScope.userlogin = true;
            } else if (toState.title === 'Home' && !$localStorage.adminuserloggedIn) {
                e.preventDefault();
                $rootScope.userlogin = false;
                $state.go('login');
            }
            // else if ((fromState.title == 'Home'|| toState.title === 'Home') && (!$localStorage.token|| $localStorage.token==' ')) {
            //     e.preventDefault();
            //     $rootScope.userlogin = false;
            //     $state.go('Login');
            // }

        });
    }
]);
angular.module('TSM_ADMIN').directive('uiMask', [
    function () {
        var maskDefinitions = {
            '8': /8|9/,
            '0': /\d/,
            'A': /[a-zA-Z]/,
            '*': /[a-zA-Z0-9]/,
            'd': /[0-9]*/
        };
        return {
            priority: 100,
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, iElement, iAttrs, controller) {
                //console.log('init');
                var maskProcessed = false,
                    eventsBound = false,
                    maskCaretMap, maskPatterns, maskPlaceholder, maskComponents,
                    validValue,
                    // Minimum required length of the value to be considered valid
                    minRequiredLength,
                    value, valueMasked, isValid,
                    // Vars for initializing/uninitializing
                    originalPlaceholder = iAttrs.placeholder,
                    originalMaxlength = iAttrs.maxlength,
                    // Vars used exclusively in eventHandler()
                    oldValue, oldValueUnmasked, oldCaretPosition, oldSelectionLength;

                function initialize(maskAttr) {
                    if (!angular.isDefined(maskAttr)) {
                        return uninitialize();
                    }
                    processRawMask(maskAttr);
                    if (!maskProcessed) {
                        return uninitialize();
                    }
                    initializeElement();
                    bindEventListeners();
                }

                function formatter(fromModelValue) {
                    if (!maskProcessed) {
                        return fromModelValue;
                    }
                    value = unmaskValue(fromModelValue || '');
                    isValid = validateValue(value);
                    controller.$setValidity('mask', isValid);

                    if (isValid) validValue = value;
                    //console.log('formatter valid:'+validValue);
                    return isValid && value.length ? maskValue(value) : undefined;
                }


                function parser(fromViewValue) {
                    if (!maskProcessed) {
                        return fromViewValue;
                    }
                    value = unmaskValue(fromViewValue || '');
                    isValid = validateValue(value);
                    viewValue = value.length ? maskValue(value) : '';
                    // We have to set viewValue manually as the reformatting of the input
                    // value performed by eventHandler() doesn't happen until after
                    // this parser is called, which causes what the user sees in the input
                    // to be out-of-sync with what the controller's $viewValue is set to.
                    controller.$viewValue = viewValue;
                    controller.$setValidity('mask', isValid);
                    if (value === '' && controller.$error.required !== undefined) {
                        controller.$setValidity('required', false);
                    }
                    if (isValid) validValue = value;
                    //console.log('parser valid:'+validValue);
                    return isValid ? value : undefined;
                }

                iAttrs.$observe('uiMask', initialize);
                controller.$formatters.push(formatter);
                controller.$parsers.push(parser);

                function uninitialize() {
                    maskProcessed = false;
                    unbindEventListeners();

                    if (angular.isDefined(originalPlaceholder)) {
                        iElement.attr('placeholder', originalPlaceholder);
                    } else {
                        iElement.removeAttr('placeholder');
                    }

                    if (angular.isDefined(originalMaxlength)) {
                        iElement.attr('maxlength', originalMaxlength);
                    } else {
                        iElement.removeAttr('maxlength');
                    }

                    iElement.val(controller.$modelValue);
                    controller.$viewValue = controller.$modelValue;
                    return false;
                }

                function initializeElement() {
                    value = oldValueUnmasked = unmaskValue(controller.$modelValue || '');
                    valueMasked = oldValue = maskValue(value);
                    isValid = validateValue(value);
                    viewValue = isValid && value.length ? valueMasked : '';
                    if (iAttrs.maxlength) { // Double maxlength to allow pasting new val at end of mask
                        iElement.attr('maxlength', maskCaretMap[maskCaretMap.length - 1] * 2);
                    }
                    iElement.attr('placeholder', maskPlaceholder);
                    iElement.val(viewValue);
                    controller.$viewValue = viewValue;
                    // Not using $setViewValue so we don't clobber the model value and dirty the form
                    // without any kind of user interaction.
                }

                function bindEventListeners() {
                    if (eventsBound) {
                        return true;
                    }
                    iElement.bind('blur', blurHandler);
                    iElement.bind('mousedown mouseup', mouseDownUpHandler);
                    iElement.bind('input keyup click', eventHandler);
                    eventsBound = true;
                }

                function unbindEventListeners() {
                    if (!eventsBound) {
                        return true;
                    }
                    iElement.unbind('blur', blurHandler);
                    iElement.unbind('mousedown', mouseDownUpHandler);
                    iElement.unbind('mouseup', mouseDownUpHandler);
                    iElement.unbind('input', eventHandler);
                    iElement.unbind('keyup', eventHandler);
                    iElement.unbind('click', eventHandler);
                    eventsBound = false;
                }

                function validateValue(value) {
                    // Zero-length value validity is ngRequired's determination
                    return value.length ? value.length >= minRequiredLength : true;
                }

                function unmaskValue(value) {
                    var valueUnmasked = '',
                        maskPatternsCopy = maskPatterns.slice();
                    // Preprocess by stripping mask components from value
                    value = value.toString();
                    angular.forEach(maskComponents, function (component, i) {
                        value = value.replace(component, '');
                    });
                    angular.forEach(value.split(''), function (chr, i) {
                        if (maskPatternsCopy.length && maskPatternsCopy[0].test(chr)) {
                            valueUnmasked += chr;
                            maskPatternsCopy.shift();
                        }
                    });
                    return valueUnmasked;
                }

                function maskValue(unmaskedValue) {
                    var valueMasked = '',
                        maskCaretMapCopy = maskCaretMap.slice();
                    angular.forEach(maskPlaceholder.split(''), function (chr, i) {
                        if (unmaskedValue.length && i === maskCaretMapCopy[0]) {
                            valueMasked += unmaskedValue.charAt(0) || '_';
                            unmaskedValue = unmaskedValue.substr(1);
                            maskCaretMapCopy.shift();
                        } else {
                            valueMasked += chr;
                        }
                    });
                    return valueMasked;
                }

                function processRawMask(mask) {
                    var characterCount = 0;
                    maskCaretMap = [];
                    maskPatterns = [];
                    maskPlaceholder = '';

                    // No complex mask support for now...
                    // if (mask instanceof Array) {
                    //   angular.forEach(mask, function(item, i) {
                    //     if (item instanceof RegExp) {
                    //       maskCaretMap.push(characterCount++);
                    //       maskPlaceholder += '_';
                    //       maskPatterns.push(item);
                    //     }
                    //     else if (typeof item == 'string') {
                    //       angular.forEach(item.split(''), function(chr, i) {
                    //         maskPlaceholder += chr;
                    //         characterCount++;
                    //       });
                    //     }
                    //   });
                    // }
                    // Otherwise it's a simple mask
                    // else

                    if (typeof mask === 'string') {
                        minRequiredLength = 0;
                        var isOptional = false;

                        angular.forEach(mask.split(''), function (chr, i) {
                            if (maskDefinitions[chr]) {
                                maskCaretMap.push(characterCount);
                                maskPlaceholder += '_';
                                maskPatterns.push(maskDefinitions[chr]);

                                characterCount++;
                                if (!isOptional) {
                                    minRequiredLength++;
                                }
                            } else if (chr === "?") {
                                isOptional = true;
                            } else {
                                maskPlaceholder += chr;
                                characterCount++;
                            }
                        });
                    }
                    // Caret position immediately following last position is valid.
                    maskCaretMap.push(maskCaretMap.slice().pop() + 1);
                    // Generate array of mask components that will be stripped from a masked value
                    // before processing to prevent mask components from being added to the unmasked value.
                    // E.g., a mask pattern of '+7 9999' won't have the 7 bleed into the unmasked value.
                    // If a maskable char is followed by a mask char and has a mask
                    // char behind it, we'll split it into it's own component so if
                    // a user is aggressively deleting in the input and a char ahead
                    // of the maskable char gets deleted, we'll still be able to strip
                    // it in the unmaskValue() preprocessing.
                    maskComponents = maskPlaceholder.replace(/[_]+/g, '_').replace(/([^_]+)([a-zA-Z0-9])([^_])/g, '$1$2_$3').split('_');
                    maskProcessed = maskCaretMap.length > 1 ? true : false;
                }

                function blurHandler(e) {
                    oldCaretPosition = 0;
                    oldSelectionLength = 0;
                    if (!isValid || value.length === 0) {
                        valueMasked = '';
                        iElement.val('');
                        scope.$apply(function () {
                            controller.$setViewValue('');
                        });
                    }
                }

                function mouseDownUpHandler(e) {
                    if (e.type === 'mousedown') {
                        iElement.bind('mouseout', mouseoutHandler);
                    } else {
                        iElement.unbind('mouseout', mouseoutHandler);
                    }
                }

                iElement.bind('mousedown mouseup', mouseDownUpHandler);

                function mouseoutHandler(e) {
                    oldSelectionLength = getSelectionLength(this);
                    iElement.unbind('mouseout', mouseoutHandler);
                }

                function eventHandler(e) {
                    e = e || {};
                    // Allows more efficient minification
                    var eventWhich = e.which,
                        eventType = e.type;
                    // Prevent shift and ctrl from mucking with old values
                    if (eventWhich === 16 || eventWhich === 91) { return true; }

                    var val = iElement.val(),
                        valOld = oldValue,
                        valMasked,
                        valUnmasked = unmaskValue(val),
                        valUnmaskedOld = oldValueUnmasked,
                        valAltered = false,

                        caretPos = getCaretPosition(this) || 0,
                        caretPosOld = oldCaretPosition || 0,
                        caretPosDelta = caretPos - caretPosOld,
                        caretPosMin = maskCaretMap[0],
                        caretPosMax = maskCaretMap[valUnmasked.length] || maskCaretMap.slice().shift(),

                        selectionLen = getSelectionLength(this),
                        selectionLenOld = oldSelectionLength || 0,
                        isSelected = selectionLen > 0,
                        wasSelected = selectionLenOld > 0,

                        // Case: Typing a character to overwrite a selection
                        isAddition = (val.length > valOld.length) || (selectionLenOld && val.length > valOld.length - selectionLenOld),
                        // Case: Delete and backspace behave identically on a selection
                        isDeletion = (val.length < valOld.length) || (selectionLenOld && val.length === valOld.length - selectionLenOld),
                        isSelection = (eventWhich >= 37 && eventWhich <= 40) && e.shiftKey, // Arrow key codes

                        isKeyLeftArrow = eventWhich === 37,
                        // Necessary due to "input" event not providing a key code
                        isKeyBackspace = eventWhich === 8 || (eventType !== 'keyup' && isDeletion && (caretPosDelta === -1)),
                        isKeyDelete = eventWhich === 46 || (eventType !== 'keyup' && isDeletion && (caretPosDelta === 0) && !wasSelected),

                        // Handles cases where caret is moved and placed in front of invalid maskCaretMap position. Logic below
                        // ensures that, on click or leftward caret placement, caret is moved leftward until directly right of
                        // non-mask character. Also applied to click since users are (arguably) more likely to backspace
                        // a character when clicking within a filled input.
                        caretBumpBack = (isKeyLeftArrow || isKeyBackspace || eventType === 'click') && caretPos > caretPosMin;

                    oldSelectionLength = selectionLen;

                    // These events don't require any action
                    if (isSelection || (isSelected && (eventType === 'click' || eventType === 'keyup'))) {
                        return true;
                    }

                    // Value Handling
                    // ==============

                    // User attempted to delete but raw value was unaffected--correct this grievous offense

                    if ((eventType === 'input') && isDeletion && !wasSelected && valUnmasked === valUnmaskedOld) {
                        //console.log("Value HandlingAAAAAAAAAAAAAAAAAAAA!!!!");
                        while (isKeyBackspace && caretPos > caretPosMin && !isValidCaretPosition(caretPos)) {
                            caretPos--;
                        }
                        while (isKeyDelete && caretPos < caretPosMax && maskCaretMap.indexOf(caretPos) === -1) {
                            caretPos++;
                        }
                        var charIndex = maskCaretMap.indexOf(caretPos);
                        // Strip out non-mask character that user would have deleted if mask hadn't been in the way.
                        valUnmasked = valUnmasked.substring(0, charIndex) + valUnmasked.substring(charIndex + 1);
                        valAltered = true;
                    }

                    // Update values
                    //   console.log(e);
                    //   console.log(String.fromCharCode(e.keyCode));
                    //console.log(String.fromCodePoint(e.keyCode));
                    //console.log("---> update values start");
                    //console.log("valUnmasked:" + valUnmasked);
                    //console.log("valMasked:" + valMasked);
                    valMasked = maskValue(valUnmasked);
                    oldValue = valMasked;
                    oldValueUnmasked = valUnmasked;
                    iElement.val(valMasked);
                    if (valAltered) {
                        //console.log("value was altered");
                        //console.log("apply:" + valUnmasked);
                        // We've altered the raw value after it's been $digest'ed, we need to $apply the new value.
                        scope.$apply(function () {
                            controller.$setViewValue(valUnmasked);
                        });
                    }
                    //console.log("<--- update values end");
                    // Caret Repositioning
                    // ===================

                    // Ensure that typing always places caret ahead of typed character in cases where the first char of
                    // the input is a mask char and the caret is placed at the 0 position.
                    if (isAddition && (caretPos <= caretPosMin)) {
                        caretPos = caretPosMin + 1;
                    }

                    if (caretBumpBack) {
                        caretPos--;
                    }

                    // Make sure caret is within min and max position limits
                    caretPos = caretPos > caretPosMax ? caretPosMax : caretPos < caretPosMin ? caretPosMin : caretPos;

                    // Scoot the caret back or forth until it's in a non-mask position and within min/max position limits
                    while (!isValidCaretPosition(caretPos) && caretPos > caretPosMin && caretPos < caretPosMax) {
                        caretPos += caretBumpBack ? -1 : 1;
                    }

                    if ((caretBumpBack && caretPos < caretPosMax) || (isAddition && !isValidCaretPosition(caretPosOld))) {
                        caretPos++;
                    }
                    oldCaretPosition = caretPos;
                    setCaretPosition(this, caretPos);
                }

                function isValidCaretPosition(pos) { return maskCaretMap.indexOf(pos) > -1; }

                function getCaretPosition(input) {
                    if (input.selectionStart !== undefined) {
                        return input.selectionStart;
                    } else if (document.selection) {
                        // Curse you IE
                        input.focus();
                        var selection = document.selection.createRange();
                        selection.moveStart('character', -input.value.length);
                        return selection.text.length;
                    }
                }

                function setCaretPosition(input, pos) {
                    if (input.offsetWidth === 0 || input.offsetHeight === 0) {
                        return true; // Input's hidden
                    }
                    if (input.setSelectionRange) {
                        input.focus();
                        input.setSelectionRange(pos, pos);
                    } else if (input.createTextRange) {
                        // Curse you IE
                        var range = input.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', pos);
                        range.moveStart('character', pos);
                        range.select();
                    }
                }

                function getSelectionLength(input) {
                    if (input.selectionStart !== undefined) {
                        return (input.selectionEnd - input.selectionStart);
                    }
                    if (document.selection) {
                        return (document.selection.createRange().text.length);
                    }
                }

                // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
                if (!Array.prototype.indexOf) {
                    Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
                        "use strict";
                        if (this === null) {
                            throw new TypeError();
                        }
                        var t = Object(this);
                        var len = t.length >>> 0;
                        if (len === 0) {
                            return -1;
                        }
                        var n = 0;
                        if (arguments.length > 1) {
                            n = Number(arguments[1]);
                            if (n !== n) { // shortcut for verifying if it's NaN
                                n = 0;
                            } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                                n = (n > 0 || -1) * Math.floor(Math.abs(n));
                            }
                        }
                        if (n >= len) {
                            return -1;
                        }
                        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
                        for (; k < len; k++) {
                            if (k in t && t[k] === searchElement) {
                                return k;
                            }
                        }
                        return -1;
                    };
                }

            }
        };
    }
]);
angular.module('TSM_ADMIN').directive('ngEnter', function () {
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

