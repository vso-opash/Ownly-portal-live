'use strict';
angular.module('SYNC').factory('TenantService', function($resource, $rootScope) {
    return {
       
        newTenant: function() {
            return $resource(webservices.newTenant, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        singleAgencyProperty: function() {
            return $resource(webservices.singleAgencyProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        tenantList: function() {
            return $resource(webservices.tenantList, null, {
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
        sendMessage: function() {
            return $resource(webservices.sendMessage, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getFavTenantList: function() {
            return $resource(webservices.getFavTenantList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addToFavTrader: function(data) {
            return $resource(webservices.addToFavTrader, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getStatisticsCount: function(data) {
            return $resource(webservices.getStatisticsCount, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        tenantDatabaseList: function(data) {
            return $resource(webservices.tenantDatabaseList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        agreementListing: function(data) {
            return $resource(webservices.agreementListing, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        propertyListingInAddTenant:  function(data) {
            return $resource(webservices.propertyListingInAddTenant, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        agreementListInAddTenant:  function() {
            return $resource(webservices.agreementListInAddTenant, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getReviewForUser: function(id) {
            return $resource(webservices.getReviewForUser+'/'+id, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        addReview: function() {
            return $resource(webservices.addReview, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAllUSerReview: function(userId) {
            return $resource(webservices.getAllUSerReview+'/'+userId, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getTenantUSerReview: function(data) {
            return $resource(webservices.getTenantUSerReview, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAgreementOnTenantProfile:  function(id) {
            return $resource(webservices.getAgreementOnTenantProfile+'/'+id, null, {
                get: {
                    method: 'GET'
                }
            })
        }
    }
});