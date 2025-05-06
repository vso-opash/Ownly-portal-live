/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 */
(function () {
    angular.module('SYNC', ['ngImgCrop', 'ImageCropper'])
        .controller("TenantCtrl", TenantCtrl);
    TenantCtrl.$inject = [
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
        'TenantService',
        'PropertyService',
        'userService',
    ];

    function TenantCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AlertService, toastr, blockUI, blockUIConfig, $anchorScroll, TenantService, PropertyService, userService) {

        /**
         * Here we are getting the default role id and others role ids in the system
         */
        $scope.allow_togive_review = true;
        $scope.logged_in_user_id = $localStorage.loggedInUserId;
        $scope.tenatPropertyImageUrl = baseUrl + '/property_image/';
        $scope.tenatFileImageUrl = baseUrl + '/document/';
        $scope.propertyTenant = {};
        $scope.baseUrl_path = baseUrl;
        $scope.tenantMsg;
        $scope.isAgentAgency = ($localStorage.role_id == roleId.agent || $localStorage.role_id == roleId.ownAgency) ? true : false;
        $scope.userCurrentRold = $localStorage.role_id;
        $scope.isSearchedTenant = false;
        $rootScope.masterRoleId = $localStorage.defaultRoleId;
        $scope.agent = roleId.agent;
        $scope.ownAgency = roleId.ownAgency;
        $scope.agentId = roleId.agent;
        $scope.roles = roleId;

        $scope.tenantpasswordStatus = false;
        $scope.pagination = {
            current: 1
        };
        $scope.filterMatch = 'By best match';
        $scope.orderProperty = "";
        $scope.initailize = function () {

            $scope.imageCropResult = null;
            $scope.showImageCropper = false;

            $scope.getUserDetails();
            $scope.showReview('all');
        }
        $scope.selected = 1;
        /* Rating section start from here */
        $scope.rate = 1;
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function (value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
            { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' }
        ];
        /* Rating section start from here */

        /**
       * Used to get user details & update local storage
       * Date:- 11-sep-2017
       * @smartData Enterprises (I) Ltd
       * @access private
       * @return json
       */
        $scope.isReviewedAllowed = false;
        $scope.imageUrl = baseUrl + '/user_image/';
        $scope.getUserDetails = function () {
            // $scope.stateList = austriliaState;
            $scope.viewEditBanner;
            if ($localStorage.userLoggedIn == true) {
                $scope.imageUrl = baseUrl + '/user_image/';
                var userData = {
                    "userId": $stateParams.id,
                    "roleId": roleId.tenant
                }
                if ($stateParams.id == $localStorage.loggedInUserId) {
                    $scope.viewEditBanner = true;
                } else {
                    $scope.viewEditBanner = false;
                }
                blockUI.start();
                userService.getUserById().post(userData, function (response) {
                    if (response.code == 200) {
                        $scope.userInfo = response.data;
                        if (response.data.agency_id && response.data.agency_id._id && response.data.agency_id._id == $localStorage.userData.agency_id._id) {
                            $scope.isReviewedAllowed = true;
                        }
                        $scope.getTenantReview($scope.userInfo._id);
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });

            }
        };
        $scope.getTenantReview = function (id) {
            $scope.createdByRate = {};
            PropertyService.getReviewForUser(id).get(function (response) {
                if (response.code == 200) {
                    $scope.createdByRate = response;
                    $scope.createdByRate.data = ($scope.createdByRate.data > 0) ? $scope.createdByRate.data : 0;
                    $scope.createdByRate.total_review = ($scope.createdByRate.total_review) ? $scope.createdByRate.total_review : 0;
                    $scope.isAll = true;
                    $scope.agentReview = false;
                    $scope.showReview('all');
                } else {
                    $scope.createdByRate.data = 0;
                    $scope.createdByRate.total_review = 0;
                }
            });

        };

        $scope.pageChanged = function (page) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        /**
         * Function is to open add new tenant modal
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */

        $scope.openAddTenant = function () {
            var role = $localStorage.role_id;
            if (role == roleId.agent || role == roleId.ownAgency || role == roleId.owner) {
                var modalInstance = $scope.model = $uibModal.open({
                    animation: false,
                    templateUrl: '/frontend/modules/tenants/views/add.html',
                    scope: $scope,
                    controller: function ($uibModalInstance, $scope) {
                        // console.log("called add tenant");
                        $scope.ok = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        /*
                        $scope.getAgencyProperty = function () {
                            blockUI.start();
                            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                var obj = {};
                                obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                                obj.user_id = $localStorage.userData._id;
                                obj.request_by_role = ($localStorage.role_id) ? $localStorage.role_id : '';
                                TenantService.propertyListingInAddTenant().post(obj, function (response) {
                                    if (response.code == 200) {
                                        $scope.propertyList = response.data;
                                        if ($scope.propertyList.length == 0) {
                                            $scope.propertyList = [];

                                            toastr.warning("As you are not associated with any property.So,you are allowed to add new tenant");
                                            $scope.cancel();
                                            $scope.cancel();
                                        }
                                        blockUI.stop();
                                    } else {
                                        $scope.propertyList = [];
                                        toastr.warning("As you are not associated with any property.So,you are allowed to add new tenant");
                                        $scope.cancel();
                                        blockUI.stop();

                                    }
                                });
                                blockUI.stop();
                            } else {
                                toastr.warning("First associate yourself with any agency for making this request.");
                                $scope.cancel();
                                blockUI.stop();
                            }
                        } */
                        $scope.agreementListing = function (id) {
                            blockUI.start();
                            document.body.scrollTop = document.documentElement.scrollTop = 0;
                            var obj = {};
                            if ($localStorage.userData.agency_id) {
                                obj.id = id;
                                TenantService.agreementListInAddTenant().get(obj, function (response) {
                                    if (response.code == 200) {
                                        $scope.agreementList = response.data;
                                        blockUI.stop();
                                    } else {
                                        $scope.agreementList = [];
                                        blockUI.stop();
                                    }
                                });
                            } else {
                                toastr.error('You are not associated with any property');
                                $state.go('tenants_listing');
                                blockUI.stop();
                            }
                        };

                        // $scope.addTenant = function (tenant, check2, passwordStatus, propertyTenant) {
                        $scope.addTenant = function (tenant, passwordStatus) {
                            blockUI.start();
                            $scope.loginLoading = true;
                            tenant.passwordStatus = passwordStatus;
                            // tenant.property_id = propertyTenant.selected._id;
                            // console.log("tenant", tenant);
                            tenant.mobile_no = parseInt(tenant.mobile_no);
                            tenant.agentName = $localStorage.userData.firstname + " " + $localStorage.userData.lastname;
                            // tenant.agreement_id = (tenant.agreement_id)?tenant.agreement_id:'';
                            tenant.invited_by = $localStorage.loggedInUserId;
                            tenant.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                            // if (check2 == true) {
                            TenantService.newTenant().post(tenant, function (response) {
                                if (response.code == 200) {
                                    toastr.success('Successfully sent request to tenant');
                                    $scope.propertyTenant.selected = undefined;
                                    $scope.getTenantList();
                                    $scope.loginLoading = false;
                                    $scope.cancel();
                                    blockUI.stop();
                                } else if (response.code == 201) {
                                    toastr.warning(response.message);
                                    $scope.loginLoading = false;
                                    blockUI.stop();
                                }
                            });
                            // } else {
                            //     toastr.warning("Please agree to the property Insync terms ");
                            //     $scope.loginLoading = false;
                            //     blockUI.stop();
                            // }

                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {

                }, function () { });
            } else {
                toastr.warning("You do not have access permission");
                blockUI.stop();
            }
        };


        /**
        * Function is to get tenant list
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        $scope.getTenantList = function () {
            var obj = {};
            $scope.tenantMsg = "Active";
            // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
            blockUI.start();
            if ($localStorage.userData.agency_id) {
                obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            obj.user_id = $localStorage.userData._id;
            obj.request_by_role = ($localStorage.role_id) ? $localStorage.role_id : '';
            $scope.imageUrl = baseUrl + '/user_image/';
            TenantService.tenantList().post(obj, function (response) {
                $scope.isSearchedTenant = false;
                if (response.code == 200) {
                    $scope.tenantList = response.data;
                    blockUI.stop();
                } else {
                    $scope.tenantList = [];
                    blockUI.stop();
                }
            });
            // } else {
            //     $scope.tenantList = [];
            //     blockUI.stop();
            // }
        }

        //get current data functionality 
        $scope.getDate = function () {
            var d = moment().format('YYYY-MM-DD h:mm:ss a');
            var n = moment().format("MMM Do") + ', ' + moment().format('LT');
            return n;
        }

        /**
     * Function is to send message
     * @access private
     * @return json
     * Created 
     * @smartData Enterprises (I) Ltd
     * Created 
     */

        $scope.openSendMessage = function (id, name) {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/tenants/views/sendMessage.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.name;
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.getName = function () {
                        $scope.name = name;
                    };
                    $scope.sendMessage = function (message) {
                        blockUI.start();
                        var obj = {};
                        obj.sender_id = $localStorage.userData._id;
                        obj.receiver_id = id;
                        obj.firstname = $localStorage.userData.firstname;
                        obj.lastname = $localStorage.userData.lastname;
                        obj.message = message;
                        obj.time = $scope.getDate();
                        TenantService.sendMessage().post(obj, function (response) {
                            if (response.code == 200) {
                                toastr.success('Successfully sent message to tenant');
                                blockUI.stop();
                                $scope.cancel();
                            } else {
                                toastr.warning('Server is busy please try a while');
                                blockUI.stop();
                            }
                        });
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });

        };
        /**
        * Function is to tenant profile
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 
        */
        $scope.goToTenantProfile = function (id) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $location.path('tenant_profile/' + id);
        }
        /**
         * Function is to upload banner image
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 
         */

        $scope.uploadTenantBanner = function (files) {
            if (files && files.length) {
                blockUI.start();
                // for (var i = 0; i < files.length; i++) {
                var file = files[0];
                if (!file.$error) {
                    Upload.upload({
                        url: baseUrl + '/api/updateBannerPic',
                        data: {
                            _id: $localStorage.loggedInUserId,
                            file: file,
                        }
                    }).then(function (response) {
                        if (response.data.code == 200) {
                            toastr.success('Successfully changed banner image');
                            $scope.getUserDetails();
                            blockUI.stop();
                        } else {
                            toastr.error('File format you have uploaded is not supported.Upload only (jpg,png,gif) extension file');
                            blockUI.stop();
                        }
                    }, null, function (evt) {
                        $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                    });
                } else {
                    toastr.error("Max allowed size for banner is 10MB");
                    blockUI.stop();

                }
                // }
            } else {
                toastr.error("Max allowed size for banner is 10MB");
                blockUI.stop();

            }
        };
        /**
         * Function is to sort the tenant listing
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 
         */
        $scope.setOrderTenant = function (sortBy) {
            $scope.orderTenant = sortBy;
            if (sortBy == 'firstname') {
                $scope.filterMatch = 'Name';
            } else if (sortBy == 'city') {
                $scope.filterMatch = 'City';
            } else {
                $scope.filterMatch = 'Address';
            }
        };
        /**
         * Function is to get all tenant list
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 
         */
        $scope.getAllTenant = function () {
            $scope.getTenantList();
        };
        /**
            * Function is used to add to fav list
            * @access private
            * @return json
            * Created 
            * @smartData Enterprises (I) Ltd
            * Created Date 
        */
        $scope.addToFav = function (tenantId, status, selected) {
            if (selected == 2) {
                status = true;
            }
            var userId = $localStorage.loggedInUserId;
            status = (status == true) ? 2 : 1;
            if (tenantId && userId) {
                var postData = {
                    "fav_by": userId,
                    "fav_to": tenantId,
                    "fav_status": status
                }
                TenantService.addToFavTrader().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.ownerList = response.data;
                        if (selected == 1) {
                            $scope.getAllTenant();
                        } else if (selected == 2) {
                            $scope.getFavTenantList();
                        }
                        // else if(selected == 3){ 
                        //     $scope.getFavTenantList();
                        // }
                        else if (selected == 4) {
                            $scope.getAllTenantFromDatabase();
                        }
                        if (status == 2) {
                            toastr.success('Successfully removed tenant from favorite');
                        } else {
                            toastr.success('Successfully marked tenant as favorite');
                        }
                    }
                });
            }
        }
        /**
         * Function is to get all fav tenant list
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 
         */
        $scope.getFavTenantList = function () {
            var userId = $localStorage.loggedInUserId;
            if (userId) {
                var postData = {
                    "user_id": userId,
                    "fav_status": 1
                };
                TenantService.getFavTenantList().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.isSearchedTenant = false;
                        $scope.tenantList = response.data;
                        $scope.tenantMsg = "Favorite";
                        blockUI.stop();
                    } else {
                        $scope.tenantList = [];
                        blockUI.stop();
                    }
                });
            }
        };
        /**
        * Function is to get database tenant list
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 05-Jan-2018
        */
        $scope.getAllTenantFromDatabase = function () {
            var obj = {};
            // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
            blockUI.start();
            obj.page_number = '';
            obj.number_of_pages = '';
            obj.user_id = $localStorage.loggedInUserId;
            $scope.imageUrl = baseUrl + '/user_image/';
            TenantService.tenantDatabaseList().post(obj, function (response) {
                $scope.isSearchedTenant = false;
                $scope.tenantMsg = " ";
                if (response.code == 200) {
                    $scope.tenantMsg = " ";
                    $scope.tenantList = response.data;
                    // console.log($scope.tenantList);
                    blockUI.stop();
                } else {
                    $scope.tenantList = [];
                    blockUI.stop();
                }
            });
            // } else {
            //     $scope.tenantList = [];
            //     blockUI.stop();
            // }
        }
        /**
     * Function is used to clear search
     * @access private
     * @return json
     * Created by 
     * @smartData Enterprises (I) Ltd
     * Created Date 11-Dec-2017
     */
        $scope.clearSearch = function () {
            var obj = {};
            $scope.tenant.name = '';
            $scope.tenant.city = '';
            $scope.tenant.state = '';
            $scope.tenant.zipCode = '';
            // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
            blockUI.start();
            obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            obj.user_id = $localStorage.userData._id;
            obj.request_by_role = ($localStorage.role_id) ? $localStorage.role_id : '';
            $scope.imageUrl = baseUrl + '/user_image/';
            TenantService.tenantList().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.tenantList = response.data;
                    blockUI.stop();
                } else {
                    $scope.tenantList = [];
                    blockUI.stop();
                }
            });
            // } else {
            //     $scope.tenantList = [];
            //     blockUI.stop();
            // }
            $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
        }
        $scope.tenantSearch = function (tenantData) {
            if ($scope.tenant.name || tenantData.city || tenantData.city || tenantData.state || tenantData.zipCode) {
                var obj = {};
                // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
                blockUI.start();
                obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                obj.user_id = $localStorage.userData._id;
                obj.request_by_role = ($localStorage.role_id) ? $localStorage.role_id : '';
                obj.firstname = (tenantData.name) ? tenantData.name : '';
                obj.state = (tenantData.state) ? tenantData.state : '';
                obj.city = (tenantData.city) ? tenantData.city : '';
                obj.zip_code = (tenantData.zipCode) ? tenantData.zipCode : '';
                $scope.imageUrl = baseUrl + '/user_image/';
                TenantService.tenantList().post(obj, function (response) {
                    $scope.isSearchedTenant = true;
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                    angular.element('#tenantSearchPopUp').hide();
                    if (response.code == 200) {
                        $scope.tenantList = response.data;
                        blockUI.stop();
                    } else {
                        $scope.tenantList = [];
                        blockUI.stop();
                    }
                });
                // } else {
                //     $scope.tenantList = [];
                //     blockUI.stop();
                // }
                $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
            } else {
                toastr.warning('Atleast fill one field for searching');
            }
        }

        $scope.openReviewPopup = function (id) {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/tenants/views/add_review.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    /* Rating section start from here */
                    $scope.userRate = 0;
                    $scope.userMax = 5;
                    $scope.outOFReviewer = 0;
                    /*
                        Rate is default set to 3
                    */
                    $scope.qualityOfWorkRate = 0;
                    $scope.punctualityRate = 0;
                    $scope.communicationRate = 0;
                    /*
                        Max value is default set to 5
                    */
                    $scope.qualityOfWorkMax = 5;
                    $scope.punctualityMax = 5;
                    $scope.communicationMax = 5;

                    $scope.filterMatch = 'By best match';
                    $scope.isUserReadonly = true;
                    $scope.isReadonly = false;
                    /*
                        label default set to average
                    */
                    $scope.qualityOfWorkLabel = 'Bad';
                    $scope.punctualityLabel = 'Bad';
                    $scope.communicationLabel = 'Bad';
                    /*
                        value to be used 
                    */
                    $scope.qualityOfWorkValue = 0;
                    $scope.punctualityValue = 0;
                    $scope.communicationValue = 0;
                    /*
                       hover function for quality of work
                    */
                    $scope.qualityOfWorkOver = function (value) {
                        $scope.qualityOfWorkPercent = 100 * (value / $scope.qualityOfWorkMax);
                        $scope.qualityOfWorkValue = value;
                        if (value == 1) {
                            $scope.qualityOfWorkLabel = 'Bad';
                        } else if (value == 2) {
                            $scope.qualityOfWorkLabel = 'Poor';
                        } else if (value == 3) {
                            $scope.qualityOfWorkLabel = 'Average';
                        } else if (value == 4) {
                            $scope.qualityOfWorkLabel = 'Good';
                        } else if (value == 5) {
                            $scope.qualityOfWorkLabel = 'Excellent!';
                        }
                    }
                    /*
                       hover function for puntuality
                    */
                    $scope.punctualityOver = function (value) {
                        $scope.punctualityPercent = 100 * (value / $scope.qualityOfWorkMax);
                        $scope.punctualityValue = value;
                        if (value == 1) {
                            $scope.punctualityLabel = 'Bad';
                        } else if (value == 2) {
                            $scope.punctualityLabel = 'Poor';
                        } else if (value == 3) {
                            $scope.punctualityLabel = 'Average';
                        } else if (value == 4) {
                            $scope.punctualityLabel = 'Good';
                        } else if (value == 5) {
                            $scope.punctualityLabel = 'Excellent!';
                        }
                    }
                    /*
                       hover function for communication
                    */
                    $scope.communicationOver = function (value) {
                        $scope.communicationPercent = 100 * (value / $scope.qualityOfWorkMax);
                        $scope.communicationValue = value;
                        if (value == 1) {
                            $scope.communicationLabel = 'Bad';
                        } else if (value == 2) {
                            $scope.communicationLabel = 'Poor';
                        } else if (value == 3) {
                            $scope.communicationLabel = 'Average';
                        } else if (value == 4) {
                            $scope.communicationLabel = 'Good';
                        } else if (value == 5) {
                            $scope.communicationLabel = 'Excellent!';
                        }
                    }
                    $scope.ratingStates = [
                        { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
                        { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' }
                    ];
                    /* Rating section start from here */
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.addReview = function (reviewData) {
                        blockUI.start();
                        $scope.loginLoading = true;
                        var agencyId;
                        if ($localStorage.userData.agency_id) {
                            agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                        }
                        var postData = {
                            "review_by": $localStorage.loggedInUserId,
                            "review_to": $stateParams.id,
                            "comments": reviewData.review_comments,
                            "quality_of_work": $scope.qualityOfWorkValue,
                            "punctaulity": $scope.punctualityValue,
                            "communication": $scope.communicationValue,
                            "review_by_role": $localStorage.role_id
                        };
                        TenantService.addReview().post(postData, function (response) {
                            if (response.code == 200) {
                                toastr.success('Review added successfully');
                                $scope.getTenantReview($stateParams.id);
                                $scope.loginLoading = false;
                                $scope.cancel();
                                blockUI.stop();
                            } else {
                                toastr.warning('Server is busy please try a while');
                                blockUI.stop();
                                $scope.loginLoading = false;
                                $scope.cancel();
                            }
                        });
                    }
                    $scope.reviewData = {};
                    $scope.isRatingFractional = false;
                    $scope.frationalArray = [];
                    $scope.getReview = function () {
                        var agentId = $stateParams.id;
                        TenantService.getReviewForUser(agentId).get(function (response) {
                            if (response.code == 200) {
                                $scope.outOFReviewer = response.total_review;
                                $scope.userRate = (response.data.length > 0 || response.data > 0) ? response.data : 0;
                                var i = $scope.userRate;
                                var integerPart = parseInt(i);
                                var frationalPart = Math.abs(integerPart - i);
                                if (Number.isInteger(i) && frationalPart < 0.5) {
                                    $scope.isRatingFractional = false;
                                } else {
                                    $scope.isRatingFractional = true;
                                    for (var j = 0; j < integerPart; j++) {
                                        if (j == integerPart - 1) {
                                            $scope.frationalArray[j] = 'fractional';
                                        } else {
                                            $scope.frationalArray[j] = 'integer';
                                        }
                                    }
                                }
                            }
                        });
                    }();
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
        };
        /**
   * review section 
   */
        $scope.isAll = true;
        $scope.agentReview = false;
        $scope.vm = {};
        $scope.vm.numRecords = 5;
        $scope.vm.page = 1;

        $scope.vm.next = function (tab) {
            $scope.vm.page = $scope.vm.page + 1;
            if (tab == "agent") {
                $scope.diff = (($scope.agentReviewList.length / $scope.vm.numRecords) - Math.floor($scope.agentReviewList.length / $scope.vm.numRecords) == 0) ? ($scope.agentReviewList.length / $scope.vm.numRecords) : (Math.floor($scope.agentReviewList.length / $scope.vm.numRecords) + 1);
                if ($scope.vm.page > $scope.diff) {
                    $scope.vm.page = 1;
                }
            } else {
                $scope.diff = (($scope.allReviewList.length / $scope.vm.numRecords) - Math.floor($scope.allReviewList.length / $scope.vm.numRecords) == 0) ? ($scope.allReviewList.length / $scope.vm.numRecords) : (Math.floor($scope.allReviewList.length / $scope.vm.numRecords) + 1);
                if ($scope.vm.page > $scope.diff) {
                    $scope.vm.page = 1;
                }
            }

        };

        $scope.showReview = function (selection) {
            if (selection == 'all') {
                $scope.isAll = true;
                $scope.agentReview = false;
                /**
                 * get all user reviews
                 */
                var agentId = $stateParams.id;
                TenantService.getAllUSerReview(agentId).get(function (response) {
                    if (response.code == 200) {
                        $scope.allReviewList = response.data;
                        $scope.allReviewList.map(function (item) {
                            if (item.review_by._id == $localStorage.loggedInUserId) {
                                $scope.allow_togive_review = false;
                            }
                        });
                    }
                });
            } else if (selection == 'agent_review') {
                $scope.isAll = false;
                $scope.agentReview = true;
                /**
                 * get tenant user reviews
                 */
                var postData = {
                    "user_id": $stateParams.id,
                    "user_role": $scope.agentId
                }
                TenantService.getTenantUSerReview().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.agentReviewList = response.data;
                        $scope.agentReviewList.map(function (item) {
                            if (item.review_by._id == $localStorage.loggedInUserId) {
                                $scope.allow_togive_review = false;
                            }
                        });
                    }
                });
            }
        }
        //goto tenant profile
        $scope.goToTenantProfile = function (id) {
            $rootScope.navBarOptionSelected = 'tenants_listing';
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $location.path('/tenant_profile/' + id);
        }

        /**
       * Function is to get agreement list in tenant profile
       * @access private
       * @return json
       * Created 
       * @smartData Enterprises (I) Ltd
       * Created Date 
       */
        $scope.getTenantAgreementInProfile = function () {
            var id = $stateParams.id;
            TenantService.getAgreementOnTenantProfile(id).get(function (response) {
                if (response.code == 200) {
                    $scope.profileAgreementList = response.data;
                    $scope.userImage = baseUrl + '/user_image/';
                    // console.log("see here is data:::>", $scope.profileAgreementList);
                    blockUI.stop();
                } else {
                    $scope.profileAgreementList = [];
                    blockUI.stop();
                }
            });
        }
        $scope.showPopup = function () {
            angular.element('#tenantSearchPopUp').show();
        }
        $scope.hideSearchFilter = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            angular.element('#tenantSearchPopUp').hide();
        }

        $scope.submitReview = function (response, review_id, section_name) {

            blockUI.start();
            var user_id = $localStorage.loggedInUserId;
            $scope.loginLoading = true;
            var postData = {
                "review_id": review_id,
                "response": response,
                "response_by": user_id
            }

            userService.addResponse().post(postData, function (response) {
                if (response.code == 200) {
                    toastr.success('Response sent successfully');
                    $scope.getTenantReview($stateParams.id);
                    if (section_name == 'all') {
                        $scope.isAll = true;
                        $scope.tenantReview = false;
                        $scope.ownerReview = false;
                        $scope.showReview('all');
                    } else if (section_name == 'agent') {
                        $scope.isAll = false;
                        $scope.tenantReview = false;
                        $scope.ownerReview = true;
                        $scope.showReview('agent_review');
                    }
                    $scope.loginLoading = false;
                    blockUI.stop();
                } else {
                    toastr.warning('Server is busy please try a while');
                    $scope.loginLoading = false;
                    blockUI.stop();
                }
            });
        }

        /**
         * Function is use to upload on file either on select or drop
         * @access private
         * @return json
         * Created by  : KEK
         * @Narola Infotech
         * Created Date 25-1-2019
         */
        $scope.csvUpload = function (file, data, agencyId) {
            Upload.upload({
                url: baseUrl + '/api/importTenantCSV',
                data: {
                    _id: data,
                    file: file,
                    agency_id: agencyId
                }
            }).then(function (response) {
                if (response.data.code == 200) {
                    $scope.getTenantList();
                    toastr.success(response.data.message);
                } else {
                    toastr.error(response.data.message);
                }
            }, null, function (evt) {
                $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        /**
         * Function is used to upload csv
         * @access private
         * @return json
         * Created by : KEK
         * @Narola Infotech
         * Created Date 25-1-2019
         */
        $scope.uploadCsv = function (file) {
            var userId = $localStorage.loggedInUserId;
            var agencyId = $localStorage.userData.agency_id;
            $scope.csvUpload(file, userId, agencyId);
        }

        $scope.myImage = '';
        $scope.myCroppedImage = '';
        $scope.dicssmissCromPopup = 0;

        $scope.openCropBanner = function (event) {

            console.log("files", event);
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/users/views/crop_banner.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.checkimage = false;
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    // $scope.file_upload_change(event);

                    $scope.showImageCropper = true;
                    $scope.imageCropStep = 1;

                    var file = event.currentTarget.files[0];
                    console.log("file ==== ", file);
                    var reader = new FileReader();
                    var image1 = new Image();
                    reader.onload = function (evt) {

                        console.log("changing myImage: ", evt.target.result);

                        $scope.myImage = evt.target.result;

                        console.log("$scope.myImage     ", $scope.myImage);

                        image1.src = $scope.myImage;
                        $scope.$apply();

                        image1.onload = function () {

                            var selected_image_width = this.width;
                            var selected_image_height = this.height;

                            console.log(parseInt(selected_image_width) + " ============== " + parseInt(selected_image_height));

                            if (parseInt(selected_image_width) >= 1585 && parseInt(selected_image_height) >= 300) {
                                $scope.checkimage = true;
                            } else {
                                $scope.myCroppedImage = '';
                                $scope.myImage = '';
                                toastr.error('Image must be atleast 1585px x 300px in size.');
                                $uibModalInstance.dismiss('cancel');
                            }
                        };
                        if ($scope.checkimage) {
                            toastr.error('Image must be with an extention of .jpg and .png only.');
                            $uibModalInstance.dismiss('cancel');
                        }
                    };

                    reader.readAsDataURL(file);

                    $scope.upload_crop_image = function () {
                        blockUI.start();
                        $scope.initCrop = true;
                        $timeout(function () {

                            console.log("$scope.myCroppedImage    ", $scope.myCroppedImage);

                            // Call API and pass base64 data
                            var data = {
                                _id: $localStorage.loggedInUserId,
                                file: $scope.myCroppedImage
                            };
                            userService.updateUserBannerImage().post(data, function (response) {
                                if (response.code == 200) {
                                    blockUI.stop();
                                    $uibModalInstance.dismiss('cancel');
                                    toastr.success('Banner is changed successfully.');
                                    $scope.getUserDetails();
                                    // $scope.property.files = [];
                                } else {
                                    blockUI.stop();
                                    toastr.error('File format you have uploaded is not supported.Upload only (jpeg,jpg,png) extension file');
                                    $uibModalInstance.dismiss('cancel');
                                }
                            });
                        }, 3000);
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
        };

    }
}());