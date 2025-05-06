'use strict';
angular.module('TSM_ADMIN').factory('DashboardService', function($resource, $rootScope) {
    return {
        saveProperty: function() {
            return $resource(webservices.saveProperty, null, {
                post: {
                    method: 'POST',
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }
            })
        },
        getAmenities: function() {
            return $resource(webservices.getAmenities, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getAgentRemovalList: function() {
            return $resource(webservices.getAgentRemovalList, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getUnapprovedProperty: function() {
            return $resource(webservices.getUnapprovedProperty, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getSingleProperty: function() {
            return $resource(webservices.getSingleProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getRecentAddedProperty: function() {
            return $resource(webservices.getRecentAddedProperty, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getAdminStatisticsData: function() {
            return $resource(webservices.getAdminStatisticsData, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getTenantNameOnPropertyDetail:  function() {
            return $resource(webservices.getTenantNameOnPropertyDetail, null, {
                post: {
                    method: 'POST'
                }
            })
        },
    }
});