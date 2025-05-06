/**
 * Super Angular Controller
 * @author Mohammad H.
 * @created 10 June, 16
 */
(function () {

    'use strict';
    angular.module('TSM_ADMIN')
        .controller("SuperCntrl", SuperCntrl);

    SuperCntrl.$inject = [
        '$state',
        '$route',
        '$scope',
        '$rootScope',
        '$http',
        '$filter',
        '$window',
        '$location',
        '$stateParams',
        'localStorageService',
        'blockUI',
        '$localStorage'
    ];

    function SuperCntrl($state, $route, $scope, $rootScope, $http, $filter, $window, $location, $stateParams, localStorageService, blockUI, $localStorage) {
        $rootScope.global_patients = {};
        $rootScope.processingLoading = false;
        $rootScope.__active_menu__ = null;
        $rootScope.userlogin = ($localStorage.token) ? true : false;
        /**
         * Function is used to add user name on header & side bar
         * @access private
         * @return json
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 26-Sep-2017
         */
        $scope.userName = function () {
            $scope.imageUrl = baseUrl + '/user_image/';
            if ($localStorage.adminData) {
                $rootScope.loginUserName = $localStorage.adminData.firstname + " " + $localStorage.adminData.lastname;
                $rootScope.profileImage = $localStorage.adminData.image;
            }

        }
    }

    angular.module('TSM_ADMIN')
        .controller("LandingCtrl", LandingCtrl);

    LandingCtrl.$inject = [
        '$state',
        '$route',
        'Upload',
        '$scope',
        '$rootScope',
        '$http',
        '$filter',
        '$window',
        '$location',
        '$stateParams',
        'localStorageService',
        'BASE_URL',
        'toastr',
        '$localStorage',
        '$anchorScroll',
        'blockUI',
        'UserService'
    ];

    function LandingCtrl($state, $route, Upload, $scope, $rootScope, $http, $filter, $window, $location, $stateParams, localStorageService, BASE_URL, toastr, $localStorage, $anchorScroll, blockUI, UserService) {
        var typesOfChartersArr = [];
        $rootScope.searchdata = {};


        /**
      * Function is used for back
      * Created by 
      * @smartData Enterprises (I) Ltd
      * Created Date 01-Feb-2018
      */
        $scope.goBack = function () {
            $window.history.back();
        }

        /**
         * Function is used to find update admin password
         * @access private
         * @return json
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Oct-2017
         */
        $scope.adminPasswordUpdate = function (password) {
            if (password.new === password.confirm) {
                if (password.new === password.current) {
                    toastr.warning("Current & new password are same");
                } else {
                    var passwordData = {
                        "userId": $localStorage.adminData._id,
                        "oldPassword": password.current,
                        "newPassword": password.new
                    };
                    UserService.updateAdminPassword().post(passwordData, function (response) {
                        if (response.code == 200) {
                            toastr.success('Password updated successfully');
                            UserService.adminLogout().post(passwordData, function (response) {
                                if (response.code == 200) {
                                    $scope.userLogin = ' ';
                                    $localStorage.adminData = ' ';
                                    $localStorage.adminuserloggedIn = false;
                                    $rootScope.userlogin = false;
                                    $localStorage.token = ' ';
                                    $state.go('Login')
                                }
                            });
                            blockUI.stop();
                        } else if (response.code == 400) {
                            blockUI.stop();
                            toastr.info(response.message);
                        } else {
                            blockUI.stop();
                            toastr.error('Server Busy please try again latter.');
                        }
                    });

                }

            } else {
                toastr.error("New password & confirm password are not same");
            }

        }
        $scope.activeDashboard = function () {
            if ($state.current.name === "profileEdit") {
                $rootScope.userManagementActive = " ";
                $rootScope.dashboardActive = " ";
                $rootScope.dashboardStatus = " ";
                $rootScope.userStatus = " ";
                $rootScope.traderUserStatus = "";
                $rootScope.agencyStatus = " ";
                $rootScope.proepertyStatus = " ";
                $rootScope.userManagementActive = " ";
                $rootScope.agecnyManagementActive = " ";
                $rootScope.propertyManagementActive = " ";
                $rootScope.profileActive = "aciveProfile";
                $rootScope.profileStatus = "active";
            }
        }();

        $scope.adminProfile = function () {
            $state.go("profileEdit");
        }
        /**
         * Function is used to cancel profile modification of admin  profile
         * @access private
         * @return json
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 26-Sep-2017
         */
        $scope.cancelProfileUpdation = function () {
            toastr.info('Profile data unchanged');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $state.go("home");
        }

        /**
         * Function is used to find user admin  data
         * @access private
         * @return json
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.userDetailViewForEdit = function () {
            $scope.imageUrl = baseUrl + '/user_image/';
            blockUI.start();
            var obj = {};
            obj.userId = $localStorage.adminData._id;
            UserService.adminDetail().post(obj, function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    $scope.user = response.data;
                    $rootScope.profileImage = $scope.user[0].image;
                    $localStorage.adminData.image = $scope.user[0].image;
                } else {
                    $state.go("noUserFound");
                }
            })
        };
        $scope.upload = function (files) {
            console.log("inside upload");
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: baseUrl + '/api/updateAdminPic',
                            data: {
                                _id: $localStorage.adminData._id,
                                file: file,
                            }
                        }).then(function (response) {
                            if (response.status == 200) {
                                toastr.success('Profile image is changed successfully');
                                $scope.userDetailViewForEdit();
                            } else {
                                toastr.error($scope.errorMsg = response.message + ': missing field ' + response.paramName);
                            }
                        }, null, function (evt) {
                            $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                        });
                    }
                }
            }
        };
        /**
         * Function is used to edit user data
         * @access private
         * @return json
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.editUserInfo = function (updateData) {
            $scope.imageUrl = baseUrl + '/user_image/';
            blockUI.start();
            var userData = {
                "userId": $localStorage.adminData._id,
                "firstname": updateData[0].firstname,
                "lastname": updateData[0].lastname,
                "gender": parseInt(updateData[0].gender),
                "email": updateData[0].email,
                "mobile_no": updateData[0].mobile_no,
                "image": updateData[0].image,
                "address": updateData[0].address,
                "city": updateData[0].city,
                "state": updateData[0].state,
                "zipcode": updateData[0].zipcode,
                "country": updateData[0].country
            }
            UserService.adminUpdateOwnProfile().post(userData, function (response) {
                if (response.code == 200) {
                    toastr.success('Profile updated successfully');
                    blockUI.stop();
                } else if (response.code == 404) {
                    toastr.warning('This email not exist');
                    blockUI.stop();
                } else {
                    if (response.message == "already exist user") {
                        blockUI.stop();
                        toastr.warning('Email is already associated with some other profile');
                    } else {
                        toastr.warning('Server Busy please try again latter.');
                        blockUI.stop();
                    }

                }

            });
        }
        /**
         * Function is use to logout
         * @access private
         * @return json
         * Created by Minakshi
         * @smartData Enterprises (I) Ltd
         * Created Date 3-Aug-2017
         */
        $scope.logOut = function () {
            var obj = {};
            obj.user_id = $localStorage.adminData._id;
            swal({
                title: "Are you sure?",
                text: "Are you sure you want to logout?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#0099ff",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: true
            }, function () {
                UserService.adminLogout().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.userLogin = ' ';
                        $localStorage.adminData = ' ';
                        $localStorage.adminuserloggedIn = false;
                        $rootScope.userlogin = false;
                        $localStorage.token = ' ';
                        toastr.success("Successfully logged out");
                        $state.go('Login')
                    } else {
                        toastr.info('Server is busy to process this request');

                    }
                });
            });
        };
    }

    /*
     * Footer Controller
     */
    angular.module('TSM_ADMIN')
        .controller('FooterCtrl', FooterCtrl);
    FooterCtrl.$inject = [
        '$scope',
        '$stateParams',
        '$rootScope',
        '$http',
        '$timeout',
        '$window',
        '$location',
        '$sce',
        'localStorageService',
        '$uibModal',
        'blockUI'
    ];

    function FooterCtrl($scope, $stateParams, $rootScope, $http, $timeout, $window, $location, $sce, localStorageService, $uibModal, blockUI) {
        blockUI.stop();
        $scope.$watch("$viewContentLoaded", function (event, next, current) {
            $rootScope.loaded = true;
        });
        $rootScope.loaded = false;
        $rootScope.currrent_year = moment().format('YYYY');
        $scope.scrollToTop = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    }
}());