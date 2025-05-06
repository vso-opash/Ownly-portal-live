/** 
 *  Common services
 * @author Mohammad H
 * @created 2 June, 16
 */
(function() {
    'use strict';
    angular.module('SYNC').factory('Crud', function($http, $resource) {

        return {
            get: httpGet,
            post: httpPost,
            update: httpUpdate,
            delete: httpDelete
        };

        function httpGet(url) {

            var promise = $http.get(url).then(function(response) {
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }

        function httpPost(url, postData, h) {
            var request = {
                url: url,
                method: 'POST',
                data: postData
            };
            request.headers = h || request.headers;

            var promise = $http(request).then(function(response) {
                return response.data;
            });
            return promise;
        }

        function httpUpdate(url, postData) {
            var request = {
                url: url,
                method: 'PUT',
                data: postData,
                headers: {
                    //   'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            var promise = $http(request).then(function(response) {
                return response.data;
            });
            return promise;

        }

        function httpDelete(url, Id) {
            var request = {
                url: url,
                method: 'DELETE',
                data: { id: Id },
                headers: {
                    //   'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            var promise = $http(request).then(function(response) {
                return response.data;
            });
            return promise;
        }
    });
    angular.module('SYNC').service('AlertService', [
        '$http',
        '$q',
        'SweetAlert',
        'Crud',
        function($http, $q, SweetAlert, Crud) {
            var options = {
                title: "",
                text: "Are you sure you want to delete?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#539ff3",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false,
                html: true
            };
            var service = {
                url: "",
                post: {},
                callback: null,
                options: options,
                Alert: alert,
                confirm: confirm,
                info: info,
                swal: swal
            };
            return service;

            function alert(arg1, arg2, arg3, arg4) {
                var self = this;
                var deferred = $q.defer();
                if (typeof(arg1) === 'object') {
                    options = angular.merge(options, arg1);
                    service.url = arg2;
                    service.post = arg3;
                    if (typeof(arg4) === 'function')
                        var callback = arg4;
                } else {
                    service.url = arg1;
                    service.post = arg2;
                    if (typeof(arg3) === 'function')
                        var callback = arg3;
                }
                SweetAlert.swal(self.options,
                    function(isConfirm) {
                        if (isConfirm) {
                            Crud.post(service.url, service.post).then(function(results) {
                                if (results.status == '200') {
                                    SweetAlert.swal({
                                        title: "<span class='fa fa-info-circle' style='font-size: 16px;'></span> Deleted",
                                        text: "successfully!",
                                        html: true
                                    });
                                    deferred.resolve(results);
                                } else {
                                    deferred.resolve(results);
                                }
                            }, function(responce) {});
                        }
                    });
                return deferred.promise;
            }

            function confirm() {
                var deferred = $q.defer();
                var options = {
                    title: "Are you sure?",
                    text: "Do you really want to remove this section?",
                    type: "warning",
                    cancelButtonText: "Cancel",
                    showCancelButton: true,
                    confirmButtonColor: "#539ff3",
                    closeOnConfirm: true
                };
                if (arguments)
                    options = angular.extend(options, arguments[0]);
                SweetAlert.swal(options, function(isConfirm) {
                    deferred.resolve(isConfirm);
                });
                return deferred.promise;
            }

            function info() {
                var options = {
                    title: "Success",
                    text: "Saved Successfully!",
                    type: "info",
                    confirmButtonColor: "#539ff3",
                    closeOnConfirm: true
                };
                if (arguments)
                    options = angular.extend(options, arguments[0]);
                SweetAlert.swal(options);
            }

            function swal() {
                SweetAlert.swal.apply(this, arguments);
            };
        }
    ]);
    angular.module('SYNC').service('Utility', [
        '$rootScope',
        'Crud',
        function($rootScope, Crud) {
            return {
                serializeObj: serializeObj,
                split: split,
                getPermissions: getPermissions,
                getAllContractorList: getAllContractorList,
                joinArray: joinArray,
                findInArray: findInArray
            };

            function serializeObj(obj) {
                var result = [];
                for (var property in obj)
                    result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

                return result.join("&");
            }

            function split(s, separator) {
                separator = separator || ",";
                if (typeof(s) === 'string')
                    return s.split(separator);
                else
                    return s;
            }

            function joinArray(arr, separator, map) {
                var temp = [];
                angular.forEach(arr, function(v, i) {
                    if (map)
                        temp.push(v[map]);
                    else
                        temp.push(v);
                });
                return temp.join(separator);
            }

            function findInArray(arr, value, map) {
                var index = -1;
                angular.forEach(arr, function(v, i) {
                    if (v[map] === value)
                        index = i;
                });
                return index;
            }

            function getPermissions(userId) {
                Crud.get('/clinic/get_permission/?userId=' + userId).then(function(results) {
                    if (results.status === 'OK') {
                        $rootScope.global_role_permissions = results.data;
                        angular.forEach(results.data, function(p, index) {
                            $rootScope.role_permissions[p.id] = {};
                            $rootScope.role_permissions[p.id]['can_read'] = p['can_read'];
                            $rootScope.role_permissions[p.id]['can_write'] = p['can_write'];
                            $rootScope.role_permissions[p.id]['can_update'] = p['can_update'];
                            $rootScope.role_permissions[p.id]['can_delete'] = p['can_delete'];
                        });
                    }
                });
            }

            function getAllContractorList() {
                return Crud.get('/contractor/get_contractor_list').then(function(results) {
                    if (results.status === 200) {
                        return results.data;
                    }
                });
            }
        }
    ]);
    angular.module('SYNC').factory('authHttpResponseInterceptor', [
        '$q',
        '$location',
        '$injector',
        function($q, $location, $injector) {

            var path = $location.path().split("/");
            var allowed = [
                'activate_account'
            ];

            if (allowed.indexOf(path[1]) !== -1) {
                return true;
            }

            return {
                response: function(response) {
                    if (response.status === 401) {
                        $location.path('/');
                        return $q.reject(response);
                    }
                    return response || $q.when(response);
                },
                responseError: function(rejection) {
                    //var reservedPaths = ['/', '/login', '/];   
                    switch (rejection.status) {
                        case 401:
                            $location.path('/');
                            return $q.reject(rejection);
                            break;
                        case 403:
                            $location.path('/');
                            //                        var AlertService = $injector.get('AlertService');                  
                            //                        AlertService.swal(rejection.statusText,rejection.data);                
                            return $q.reject(rejection);
                            break;
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ]);
    angular.module('SYNC').factory('permissions', function($rootScope, $location) {
        var permissionList;
        return {
            setPermissions: setPermissions,
            hasPermission: hasPermission
        };

        function setPermissions(permissions) {
            permissionList = permissions;
            $rootScope.$broadcast('permissionsChanged');
        }

        function hasPermission(permission, aro) {
            return _.some(permissionList, function(item) {
                if (_.isString(item.aro)) {
                    return item.aro.trim() === aro && item[permission] === 1;
                }
            });
        }
    });
    angular.module('SYNC').filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i = 0; i < total; i++) {
                input.push(i);
            }
            return input;
        };
    });
    angular.module('SYNC').filter('capitalizeFirstLetter', function() {
        return function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
    });
    angular.module('SYNC').filter('tel', function() {
        return function(tel) {
            if (!tel) {
                return '';
            }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country,
                city,
                number;

            switch (value.length) {
                case 1:
                case 2:
                case 3:
                    city = value;
                    break;

                default:
                    city = value.slice(0, 3);
                    number = value.slice(3);
            }

            if (number) {
                if (number.length > 3) {
                    number = number.slice(0, 3) + '-' + number.slice(3, 7);
                } else {
                    number = number;
                }

                return ("(" + city + ") " + number).trim();
            } else {
                return "(" + city;
            }

        }
    });
    angular.module('SYNC').filter('sanitize_html', function($sce) {
        return $sce.trustAsHtml;
    });
    /**
     * AngularJS default filter with the following expression:
     * "person in people | filter: {name: $select.search, age: $select.search}"
     * performs an AND between 'name: $select.search' and 'age: $select.search'.
     * We want to perform an OR.
     */
    angular.module('SYNC').filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function(item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };


    });
    angular.module('SYNC').filter("break", function($sce) {
        return function(value) {
            if (!angular.isString(value))
                return value;
            return $sce.trustAsHtml(value.split(" ").join("<br/>"));
        };
    });
    angular.module('SYNC').filter('cut', function() {
        return function(value, wordwise, max, tail) {
            if (!value)
                return '';

            max = parseInt(max, 5);
            if (!max)
                return value;
            if (value.length <= max)
                return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    //Also remove . and , so its gives a cleaner result.
                    if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
                        lastspace = lastspace - 1;
                    }
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

    angular.module('SYNC').factory('BearerAuthInterceptor', function($window, $q, localStorageService) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if (localStorageService.get('token')) {
                    // may also use sessionStorage
                    config.headers.Authorization = 'Bearer ' + localStorageService.get('token');
                }
                return config || $q.when(config);
            },
            response: function(response) {
                if (response.status === 201) {
                    //  Redirect user to login page / signup Page.
                    $location.path('/');
                }
                return response || $q.when(response);
            }
        };
    });
}());