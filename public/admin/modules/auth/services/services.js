'use strict';
angular.module('TSM_ADMIN').factory('AdminService', function($resource, $rootScope) {
    return {
        adminLogin: function() {
            return $resource(webservices.adminLogin, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        AdminForgotPassword: function() {
            return $resource(webservices.AdminForgotPassword, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        AdminResetPassword: function() {
            return $resource(webservices.AdminResetPassword, null, {
                post: {
                    method: 'POST'
                }
            })
        }
    }
});