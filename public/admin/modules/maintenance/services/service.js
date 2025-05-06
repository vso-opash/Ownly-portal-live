'use strict';
angular.module('TSM_ADMIN').factory('MaintenanceService', function ($resource, $rootScope) {
    return {
        maintenanceList: function () {
            return $resource(webservices.maintenanceList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAdminMRcounts: function () {
            return $resource(webservices.getAdminMRcounts, null, {
                post: {
                    method: 'POST'
                }
            })
        },
    }
});