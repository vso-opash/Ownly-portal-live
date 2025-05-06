'use strict';
angular.module('SYNC').factory('StrataUserService', function($resource, $rootScope) {
    return {
       
        getAgencyAgentList: function() {
            return $resource(webservices.getAgencyAgentList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getMyAgentList: function() {
            return $resource(webservices.getMyAgentList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        sendMessage: function() {
            return $resource(webservices.sendMessage, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        maintenceProperty: function(data) {
            return $resource(webservices.maintenceProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        agentRemoval: function(data) {
            return $resource(webservices.agentRemoval, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getStartaList: function() {
            return $resource(webservices.getStartaList, null, {
                get: {
                    method: 'GET'
                }
            })
        },
    }
});