/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 */
(function () {
    angular.module('SYNC')
        .controller("NotificationCtrl", NotificationCtrl);
    NotificationCtrl.$inject = [
        '$state',
        '$scope',
        '$localStorage',
        '$rootScope',
        '$uibModal',
        '$timeout',
        'Upload',
        '$http',
        '$filter',
        '$window',
        '$location',
        '$stateParams',
        'SweetAlert',
        'permissions',
        'APP_CONST',
        'Flash',
        'AlertService',
        'toastr',
        'blockUI',
        'blockUIConfig',
        '$anchorScroll',
        'notificationService'
    ];

    function NotificationCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AlertService, toastr, blockUI, blockUIConfig, $anchorScroll, notificationService) {
        //Get notifications
        $scope.notificationsData = [];
        $scope.pageChanged = function (page) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        $scope.getUserNotificationsList = function () {
            var obj = {};
            obj.user_id = $localStorage.loggedInUserId;
            $scope.imageUrl = baseUrl + '/user_image/';
            notificationService.userNotifications().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.notificationsData = response.data;

                    $scope.notificationsData.map(function (item) {
                        if (item.to_users) {
                            var unbold_count = 0;
                            item.to_users.map(function (user) {
                                if (user.is_read == false) {
                                    $scope.unread_count += 1;
                                }
                                else {
                                    unbold_count = 1;
                                }
                            });
                            if (unbold_count == 1) {
                                item.unbold = "yes";
                            } else {
                                item.unbold = "no";
                            }
                        }
                    });

                }
            });
        }
        //to mark notification as read & go to respective page
        $scope.goToNotificationDetailRelatedPage = function (notification) {

            var obj = {};
            obj.user_id = $localStorage.loggedInUserId;
            obj.notification_type = $localStorage.loggedInUserId;

            if (notification.module == 1) {
                obj.notification_type = 'tenants';
                obj.notification_type_id = notification.from_user._id;
            } else if (notification.module == 2) {
                obj.notification_type = 'maintenance';
                obj.notification_type_id = notification.maintenence_id;
            } else if (notification.module == 3) {
                obj.notification_type = 'agreements';
                obj.notification_type_id = notification.agreement_id;
            } else if (notification.module == 4) {
                obj.notification_type = 'noticeboard';
                obj.notification_type_id = notification.noticeboard_id;
            } else if (notification.module == 6) {
                obj.notification_type = 'dispute';
                obj.notification_type_id = notification.dispute_id;
            } else if (notification.module == 8) {
                obj.notification_type = 'application';
                obj.notification_type_id = notification.application_id;
            }

            notificationService.notificationRead().post(obj, function (response) {});

            if (notification.module == 1) {
                $location.path('/tenant_profile/' + notification.from_user._id);
                $rootScope.navBarOptionSelected = 'tenants_listing';
                $localStorage.userData.routeState = 'tenants_listing';

            } else if (notification.module == 2) {
                $location.path('/maintance_detail/' + notification.maintenence_id);
                $rootScope.navBarOptionSelected = 'Maintenance';
                $localStorage.userData.routeState = 'Maintenance';

            } else if (notification.module == 3) {
                $location.path('/detail_agreement/' + notification.agreement_id);
                $rootScope.navBarOptionSelected = 'Agreements';
                $localStorage.userData.routeState = 'Agreements';

            } else if (notification.module == 4) {
                $location.path('/dispute_details/' + notification.dispute_id);
                $rootScope.navBarOptionSelected = 'Disputes';
                $localStorage.userData.routeState = 'Disputes';

            } else if (notification.module == 6) {
                $location.path('/notice_board_detail/' + notification.noticeboard_id);
                $rootScope.navBarOptionSelected = 'noticeboard';
                $localStorage.userData.routeState = 'noticeboard';

            } else if (notification.module == 8) {
                $location.path('/view_application/' + notification.application_id);
                $rootScope.navBarOptionSelected = 'Properties';
                $localStorage.userData.routeState = 'Properties';

            }

        };
    }
}());
