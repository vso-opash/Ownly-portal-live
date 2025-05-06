'use strict';
angular.module('TSM_ADMIN').factory('AdvertiseService', function ($resource, $rootScope) {
    return {
        addAd: function () {
            return $resource(webservices.addAd, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        adList: function () {
            return $resource(webservices.adList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        adDetail: function () {
            return $resource(webservices.adDetail, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateAdStatus: function () {
            return $resource(webservices.updateAdStatus, null, {
                post: {
                    method: 'POST'
                }
            })
        },
    }
});