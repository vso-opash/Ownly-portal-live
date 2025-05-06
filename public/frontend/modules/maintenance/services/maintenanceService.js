'use strict';
angular.module('SYNC').factory('maintainService', function ($resource, $rootScope) {
    return {

        maintenanceList: function () {
            return $resource(webservices.maintenanceList, null, {
                post: {
                    method: 'POST'
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
        traderList: function () {
            return $resource(webservices.pickedTraderList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getTraderOptionList: function () {
            return $resource(webservices.getTraderOptionList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addReview: function () {
            return $resource(webservices.addReview, null, {
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
        removeWatcher: function () {
            return $resource(webservices.removeWatcher, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addMaintenance: function () {
            return $resource(webservices.addMaintenance, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        detailMaintenenace: function () {
            return $resource(webservices.detailMaintenenace, null, {
                get: {
                    method: 'get'
                }
            })
        },
        cancelRequest: function (maintenanceId) {
            return $resource(webservices.cancelRequest + '/' + maintenanceId, null, {
                get: {
                    method: 'get'
                }
            })
        },
        getWatchersList: function () {
            return $resource(webservices.getWatchersList, null, {
                get: {
                    method: 'get'
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
        approvedCounterProposal: function () {
            return $resource(webservices.approvedCounterProposal, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        declineCounterProposal: function () {
            return $resource(webservices.declineCounterProposal, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        declineJobConfirmation: function () {
            return $resource(webservices.declineJobConfirmation, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        approveJobConfirmation: function () {
            return $resource(webservices.approveJobConfirmation, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        acceptDenyMaintenanceReq: function () {
            return $resource(webservices.acceptDenyMaintenanceReq, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        counterProposal: function () {
            return $resource(webservices.counterProposal, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        completeMaintJob: function () {
            return $resource(webservices.completeMaintJob, null, {
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
        getTenantForwardList: function () {
            return $resource(webservices.getTenantForwardList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        forwardRequest: function () {
            return $resource(webservices.forwardRequest, null, {
                post: {
                    method: 'POST'
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
        addMR: function (data) {
            return $resource(webservices.addMR, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        provious_existing_traders: function (data) {
            return $resource(webservices.provious_existing_traders, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getCounterProposals: function (data) {
            return $resource(webservices.getCounterProposals, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        traderList: function (data) {
            return $resource(webservices.traderList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        traderList: function (data) {
            return $resource(webservices.traderList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        applyForQuote: function (data) {
            return $resource(webservices.applyForQuote, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        hire_decline_trader: function (data) {
            return $resource(webservices.hire_decline_trader, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getSavedTradersList: function (data) {
            return $resource(webservices.getSavedTradersList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        tradersListForMR: function (data) {
            return $resource(webservices.tradersListForMR, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        sendMailForChat: function (data) {
            return $resource(webservices.sendMailForChat, null, {
                post: {
                    method: 'POST'
                }
            })
        },
    }
});