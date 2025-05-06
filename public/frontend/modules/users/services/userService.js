'use strict';
angular.module('SYNC').factory('userService', function ($resource, $rootScope) {
    return {
        saveProperty: function () {
            return $resource('/properties/save_properties/', null, {
                post: {
                    method: 'POST',
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }
            })
        },
        getUserById: function () {
            return $resource(webservices.getUserById, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateUserProfile: function () {
            return $resource(webservices.updateUserProfile, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateAvailability: function () {
            return $resource(webservices.updateAvailability, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateOccupacy: function () {
            return $resource(webservices.updateOccupacy, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateUserPassword: function () {
            return $resource(webservices.updateUserPassword, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateNotification: function () {
            return $resource(webservices.updateNotification, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getNotification: function () {
            return $resource(webservices.getNotification, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        uploadUserImage: function () {
            return $resource(webservices.uploadUserImage, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateAvatarPic: function () {
            return $resource(webservices.updateAvatarPic, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        userNotificationStatus: function () {
            return $resource(webservices.userNotificationStatus, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        contactUs: function () {
            return $resource(webservices.contactUs, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAgentProperty: function () {
            return $resource(webservices.getAgentProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getRoleList: function () {
            return $resource(webservices.getRoleList, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        getuserNotificationStatus: function () {
            return $resource(webservices.getuserNotificationStatus, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        saveUserNotificationStatus: function () {
            return $resource(webservices.saveUserNotificationStatus, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        userPermission: function () {
            return $resource(webservices.userPermission, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        directLogin: function () {
            return $resource(webservices.directLogin, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        userRoles: function () {
            return $resource(webservices.userRoles, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        saveRoles: function () {
            return $resource(webservices.saveRoles, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getUserNoticeBoard: function () {
            return $resource(webservices.getUserNoticeBoard, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        userAssociationWithAgency: function () {
            return $resource(webservices.userAssociationWithAgency, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        userNotifications: function () {
            return $resource(webservices.userNotifications, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getUserMessage: function () {
            return $resource(webservices.getUserMessage, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getInspectionDate: function () {
            return $resource(webservices.getInspectionDate, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getServiceCategoryList: function () {
            return $resource(webservices.getServiceCategoryList, null, {
                get: {
                    method: 'GET'
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
        getUnreadDashboardMessages: function (id) {
            return $resource(webservices.getUnreadDashboardMessages + '/' + id, null, {
                get: {
                    method: 'GET'
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
        getAllUSerReview: function (userId) {
            return $resource(webservices.getAllUSerReview + '/' + userId, null, {
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
        getActiveMaintenanceList: function () {
            return $resource(webservices.getActiveMaintenanceList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAllnGeneralThread: function () {
            return $resource(webservices.getAllnGeneralThread, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getMaintenanceThread: function () {
            return $resource(webservices.getMaintenanceThread, null, {
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
        getUserActiveRole: function () {
            return $resource(webservices.getUserActiveRole, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateAgentExistingPropertyImg: function () {
            return $resource(webservices.updateAgentExistingPropertyImg, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        agentProfileData: function () {
            return $resource(webservices.agentProfileData, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        checkResetPasswordLink: function () {
            return $resource(webservices.checkResetPasswordLink, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        notificationRead: function () {
            return $resource(webservices.notificationRead, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        messageList: function () {
            return $resource(webservices.messageList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        check_user_valid: function () {
            return $resource(webservices.check_user_valid, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        update_tanent_status: function () {
            return $resource(webservices.update_tanent_status, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        addResponse: function () {
            return $resource(webservices.addResponse, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getDocumentList: function () {
            return $resource(webservices.getIdentificationDocumentList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        deleteDocument: function () {
            return $resource(webservices.deleteIdentificationDocument, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateDocumentationStatus: function () {
            return $resource(webservices.updateDocumentationStatus, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        notificationRead: function () {
            return $resource(webservices.notificationRead, null, {
                post: {
                    method: 'POST'
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
        subscription_plan_list: function (data) {
            return $resource(webservices.subscription_plan_list, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        subscribePlan: function (data) {
            return $resource(webservices.subscribe_plan, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        cancelSubscription: function (data) {
            return $resource(webservices.cancelSubscription, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        updateCreditCard: function (data) {
            return $resource(webservices.update_credit_card, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        send_customer_enquiry: function (data) {
            return $resource(webservices.send_customer_enquiry, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getCategoriesBusinessnamesList: function (data) {
            return $resource(webservices.getCategoriesBusinessnamesList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        validate_account_activation_code: function (data) {
            return $resource(webservices.validate_account_activation_code, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        activate_account: function (data) {
            return $resource(webservices.activate_account, null, {
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
        forgotPassword: function () {
            return $resource(webservices.forgot_password, null, {
                post: {
                    method: 'POST'
                }
            })
        },
    }
});
