'use strict';
angular.module('SYNC').factory('fileService', function($resource, $rootScope) {
    return {
        getDocumentList: function() {
            return $resource(webservices.getDocumentList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addToFav: function() {
            return $resource(webservices.addToFav, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        deleteDocument: function() {
            return $resource(webservices.deleteDocument, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getFavDocumentList: function() {
            return $resource(webservices.getFavDocumentList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getUsersList: function() {
            return $resource(webservices.getChatUserList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        fileSearch:  function() {
            return $resource(webservices.fileSearch, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addUserToTag:  function() {
            return $resource(webservices.addUserToTag, null, {
                post: {
                    method: 'POST'
                }
            })
        }
    }

});