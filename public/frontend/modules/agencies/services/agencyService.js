'use strict';
angular.module('SYNC').factory('AgencyService', function($resource, $rootScope) {
    return {
        getAgencyById: function() {
            return $resource(webservices.getAgencyByAgentId, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAgencyProperties: function() {
            return $resource(webservices.getAgencyProperties, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAllAgencies: function() {
            return $resource(webservices.getAllAgencies, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getAgencyAgentList: function() {
            return $resource(webservices.getAgencyAgentList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addPropertyManager: function() {
            return $resource(webservices.addPropertyManager, null, {
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
        agencyProfileData:  function() {
            return $resource(webservices.agencyProfileData, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateAgencyBannerImage:  function() {
            return $resource(webservices.updateAgencyBannerImage, null, {
                post: {
                    method: 'POST'
                }
            })
        }
    }
});