'use strict';
angular.module('SYNC').factory('notificationService', function($resource, $rootScope) {
    return {
    
        userNotifications: function() {
            return $resource(webservices.userNotifications, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        notificationRead: function() {
            return $resource(webservices.notificationRead, null, {
                post: {
                    method: 'POST'
                }
            })
        }
    }

});