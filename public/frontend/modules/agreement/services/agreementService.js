'use strict';
angular.module('SYNC').factory('agreementService', function ($resource, $rootScope) {
    return {
        getTenantForAgreement: function () {
            return $resource(webservices.getTenantForAgreement, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        maintenceProperty: function (data) {
            return $resource(webservices.maintenceProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getPropertyOwner: function (data) {
            return $resource(webservices.getPropertyOwnerForAgreement, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addAgreement: function (data) {
            return $resource(webservices.addAgreement, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        agreementBulkListing: function (data) {
            return $resource(webservices.agreementBulkListing, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        agreementListing: function (data) {
            return $resource(webservices.agreementListing, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAgreementDetail: function () {
            return $resource(webservices.getAgreementDetail, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        deleteAgreement: function () {
            return $resource(webservices.deleteAgreement, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        editAgreement: function () {
            return $resource(webservices.editAgreement, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getMyAgentList: function () {
            return $resource(webservices.getMyAgentList, null, {
                post: {
                    method: 'POST'
                }
            })
        },

    }

});