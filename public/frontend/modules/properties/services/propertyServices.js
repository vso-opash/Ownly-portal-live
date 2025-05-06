'use strict';
angular.module('SYNC').factory('PropertyService', function ($resource, $rootScope) {
    return {
        userLogOut: function () {
            return $resource(webservices.userLogOut, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        propertySaveAsDraft: function () {
            return $resource(webservices.savePropertyAsDraft, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        createProperty: function () {
            return $resource(webservices.createProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        createPropertyApplication: function () {
            return $resource(webservices.createPropertyApplication, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updatePropertyById: function () {
            return $resource(webservices.updatePropertyById, null, {
                post: {
                    method: 'POST'
                }
            })
        },

        getDatabaseProperty: function () {
            return $resource(webservices.getDatabaseProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAmenities: function () {
            return $resource(webservices.getAmenities, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getPropertyAgreementDetails: function (propertyId) {
            return $resource(webservices.getPropertyAgreementDetails + '/' + propertyId, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getPropertytenantHistoryDetails: function (propertyId) {
            return $resource(webservices.getPropertyTenantHistory + '/' + propertyId, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getPropertyMaintenanceHistoryDetails: function (propertyId) {
            return $resource(webservices.getPropertyMaintenanceHistory + '/' + propertyId, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getPropertyListing: function (data) {
            return $resource(webservices.getPropertyListing, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getPropertyById: function (data) {
            return $resource(webservices.getPropertyById, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getpropertyApplicationByPropertyid: function (data) {
            return $resource(webservices.getpropertyApplicationByPropertyid, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getpropertyApplicationByid: function (data) {
            return $resource(webservices.getpropertyApplicationByid, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateapplicationStatus: function (data) {
            return $resource(webservices.updateapplicationStatus, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getPropertyListingBySearch: function (data) {
            return $resource(webservices.getPropertyListingBySearch, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        lastRoleLogged: function (data) {
            return $resource(webservices.lastRoleLogged, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getUserRoleId: function () {
            return $resource(webservices.getUserRoleId, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getPropertyOwner: function () {
            return $resource(webservices.getPropertyOwner, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        createPropertyOwner: function (data) {
            return $resource(webservices.createPropertyOwner, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAgencyProperty: function (data) {
            return $resource(webservices.getAgencyProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addToFavProperty: function (data) {
            return $resource(webservices.addToFavProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getFavPropertyListing: function (data) {
            return $resource(webservices.getFavPropertyListing, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        maintenanceList: function () {
            return $resource(webservices.maintenanceList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getTenantedProperty: function () {
            return $resource(webservices.getTenantedProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getPropertySales: function () {
            return $resource(webservices.getPropertySales, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getDocumentList: function () {
            return $resource(webservices.getDocumentList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getTenantNameOnPropertyDetail: function () {
            return $resource(webservices.getTenantNameOnPropertyDetail, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getReviewForUser: function (id) {
            return $resource(webservices.getReviewForUser + '/' + id, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        advanceSearch: function () {
            return $resource(webservices.globalSearch, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        deleteProperty: function () {
            return $resource(webservices.deleteProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getTenantForAgreement: function () {
            return $resource(webservices.getTenantForAgreement, null, {
                get: {
                    method: 'GET'
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
        uploadPropertyDocs: function (data) {
            return $resource(webservices.uploadPropertyDocs, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        checkUserPropertyRelation: function (data) {
            return $resource(webservices.checkUserPropertyRelation, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        sendMessage: function () {
            return $resource(webservices.sendMessage, null, {
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