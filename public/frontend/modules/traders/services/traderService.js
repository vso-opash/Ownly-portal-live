'use strict';
angular.module('SYNC').factory('tradeService', function ($resource, $rootScope) {
    return {

        traderList: function () {
            return $resource(webservices.traderList, null, {
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
        addReview: function () {
            return $resource(webservices.addReview, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getTraderJobHistoryList: function () {
            return $resource(webservices.getTraderJobHistoryList, null, {
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
        updateUserBannerImage: function () {
            return $resource(webservices.updateUserBannerImage, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAllUSerReview: function (userId) {
            return $resource(webservices.getAllUSerReview + '/' + userId, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addToFavTrader: function (data) {
            return $resource(webservices.addToFavTrader, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getTenantUSerReview: function (data) {
            return $resource(webservices.getTenantUSerReview, null, {
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
        getServiceCategoryList: function (data) {
            return $resource(webservices.getServiceCategoryList, null, {
                post: {
                    method: 'GET'
                }
            })
        },
        updateRevealContactNumber: function (data) {
            return $resource(webservices.updateRevealContactNumber, null, {
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
        }
    }
});