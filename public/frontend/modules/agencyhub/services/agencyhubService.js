'use strict';
angular.module('SYNC').factory('AgencyhubService', function ($resource, $rootScope) {
    return {
        agencyhub: function () {
            return $resource(webservices.agencyhub, null, {
                post: {
                    method: 'POST'
                }
            })
        }
    }
});