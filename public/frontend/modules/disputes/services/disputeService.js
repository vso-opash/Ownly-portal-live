'use strict';
angular.module('SYNC').factory('DisputeService', function($resource, $rootScope) {
    return {
        addDisputes: function(data) {
            return $resource(webservices.addDisputes, null, {
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
        getDisputes: function(data) {
            return $resource(webservices.getDisputes, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getDisputesById: function(data) {
            return $resource(webservices.getDisputesById, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateDisputeStatus: function(data) {
            return $resource(webservices.updateDisputeStatus, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getTenantForAgreement :  function() {
            return $resource(webservices.getTenantForAgreement, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        searchDispute:  function(data) {
            return $resource(webservices.searchDispute, null, {
                post: {
                    method: 'POST'
                }
            })
        }
    }
});