'use strict';
angular.module('TSM_ADMIN').factory('AgencyService', function ($resource, $rootScope) {
    return {
        AgencyList: function () {
            return $resource(webservices.AgencyList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAgentList: function () {
            return $resource(webservices.AgentList, null, {
                post: {
                    method: 'POST'
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
        addAgency: function () {
            return $resource(webservices.AddAgency, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        AgencyBulkImport: function () {
            return $resource(webservices.AgencyBulkImport, null, {
                post: {
                    method: 'POST'
                }
            })
        }
    }
});