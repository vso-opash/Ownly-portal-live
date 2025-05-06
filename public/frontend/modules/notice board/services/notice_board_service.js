'use strict';
angular.module('SYNC').factory('noticeBoardService', function($resource, $rootScope) {
    return { 
        maintenceProperty: function(data) {
            return $resource(webservices.maintenceProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addNoticeBoard: function(data) {
            return $resource(webservices.addNoticeBoard, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        noticeBoardListing: function(data) {
            return $resource(webservices.noticeBoardListing, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addToFavourite: function(data) {
            return $resource(webservices.noticeBoardAddToFavourite, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getFavNoticeBoard: function(data) {
            return $resource(webservices.getFavNoticeBoard, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getInspectionDate:  function() {
            return $resource(webservices.getInspectionDate, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getUserCount:  function() {
            return $resource(webservices.getUserCount, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addNoticePost: function(data) {
            return $resource(webservices.addNoticePost, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getNoticeBoardDetail:  function() {
            return $resource(webservices.getNoticeBoardDetail, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getPropertyList: function() {
            return $resource(webservices.getPropertyListForstarta, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getPostDetail: function() {
            return $resource(webservices.getPostDetail, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        editPost: function() {
            return $resource(webservices.editPost, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        deletePost: function() {
            return $resource(webservices.deletePost, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        deleteNoticeBoard: function() {
            return $resource(webservices.deleteNoticeBoard, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getWatchersList:  function() {
            return $resource(webservices.getWatchersList, null, {
                get: {
                    method: 'get'
                }
            })
        },
        getStatisticsData : function() {
            return $resource(webservices.getStatisticsData, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        editNoticeboard: function(data) {
            return $resource(webservices.editNoticeboard, null, {
                post: {
                    method: 'POST'
                }
            })
        }
    }

});