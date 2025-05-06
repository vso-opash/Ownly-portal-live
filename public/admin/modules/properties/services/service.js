'use strict';
angular.module('TSM_ADMIN').factory('PropertyService', function($resource, $rootScope) {
    return {
        propertyList: function() {
            return $resource(webservices.propertyList, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        propertyMaintenanceList: function(propertyId) {
            return $resource(webservices.propertyMaintenanceList+'/'+propertyId, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        deleteProperty: function() {
            return $resource(webservices.deleteProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        searchProperty: function() {
            return $resource(webservices.searchProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAgentPropertyList: function() {
            return $resource(webservices.getAgentPropertyList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        setApprovalStatus: function() {
            return $resource(webservices.setApprovalStatus, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        setApprovalStatusToTrue: function() {
            return $resource(webservices.setApprovalStatusToTrue, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        featuredProperty: function() {
            return $resource(webservices.featuredProperty, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getPropertyMaintenanceDetails: function(maintenanceId) {
            return $resource(webservices.getPropertyMaintenanceDetails+'/'+maintenanceId, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        mailToSeller: function() {
            return $resource(webservices.mailToSeller, null, {
                post: {
                    method: 'POST'
                }
            })
        }
    }
});