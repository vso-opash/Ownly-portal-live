'use strict';
angular.module('TSM_ADMIN').factory('TraderService', function ($resource, $rootScope) {
    return {
        tradersListForAdmin: function () {
            return $resource(webservices.tradersListForAdmin, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getServiceCategory: function () {
            return $resource(webservices.getServiceCategory, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        userDetail: function () {
            return $resource(webservices.userDetail, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        editUser: function () {
            return $resource(webservices.editUser, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        deleteUser: function () {
            return $resource(webservices.deleteUser, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addUser: function () {
            return $resource(webservices.addUser, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        searchUser: function () {
            return $resource(webservices.searchUser, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getFileListing: function () {
            return $resource(webservices.getFileListing, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        adminDetail: function () {
            return $resource(webservices.adminDetail, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        adminUpdateOwnProfile: function () {
            return $resource(webservices.adminUpdateOwnProfile, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        adminLogout: function () {
            return $resource(webservices.adminLogout, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        editUserByAdmin: function () {
            return $resource(webservices.editUserByAdmin, null, {
                post: {
                    method: 'POST'
                }
            })
        }, uploadUserImage: function () {
            return $resource(webservices.uploadUserImage, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateAdminPassword: function () {
            return $resource(webservices.updateAdminPassword, null, {
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
        deleteReview: function (reviewId) {
            return $resource(webservices.deleteReview + '/' + reviewId, null, {
                post: {
                    method: 'POST'
                }
            })
        }
    }
});