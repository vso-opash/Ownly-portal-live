/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 */
(function () {
    angular.module('SYNC', ['ngImgCrop', 'ImageCropper'])
        .controller("OwnerCtrl", OwnerCtrl);
    OwnerCtrl.$inject = [
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
        'userService',
        'PropertyService',
        'ownerService'
    ];

    function OwnerCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AlertService, toastr, blockUI, blockUIConfig, $anchorScroll, userService, PropertyService, ownerService) {
        $scope.allow_togive_review = true;
        $scope.logged_in_user_id = $localStorage.loggedInUserId;
        $scope.initialize = function () {

            $scope.imageCropResult = null;
            $scope.showImageCropper = false;

            $scope.getUserDetails();
            $scope.getReview();
            $scope.showReview('all');
            $scope.getAgentDashboardProperty();
        };
        $scope.agentId = roleId.agent;
        $scope.tenantId = roleId.tenant;
        $scope.propertyImage = baseUrl + '/property_image/';
        /**
    * Used to get user details & update local storage
    * Date:- 11-sep-2017
    * @smartData Enterprises (I) Ltd
    * @access private
    * @return json
    */
        $scope.imageUrl = baseUrl + '/user_image/';
        $scope.getUserDetails = function () {
            $scope.viewEditBanner;
            //   $scope.stateList = austriliaState;
            if ($localStorage.userLoggedIn == true) {
                $scope.imageUrl = baseUrl + '/user_image/';
                var userData = {
                    "userId": $stateParams.id,
                    "roleId": roleId.owner
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
                        // $scope.getTraderReview();
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });

            }
        };

        //get current data functionality 
        $scope.getDate = function () {
            var d = moment().format('YYYY-MM-DD h:mm:ss a');
            var n = moment().format("MMM Do") + ', ' + moment().format('LT');
            return n;
        }

        /**
   * Function is to open add rating popup
   * @access private
   * @return json
   * Created 
   * @smartData Enterprises (I) Ltd
   * Created Date 
   */
        $scope.openReviewPopup = function (id) {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/traders/views/addReview.html',
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
                    $scope.qualityOfWorkLabel = 'Average';
                    $scope.punctualityLabel = 'Average';
                    $scope.communicationLabel = 'Average';
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
                        ownerService.addReview().post(postData, function (response) {
                            if (response.code == 200) {
                                toastr.success('Review added successfully');
                                $scope.isAll = true;
                                $scope.agentReview = false;
                                $scope.tenantReview = false;
                                $scope.getReview();
                                $scope.showReview('all');
                                $scope.cancel();
                                blockUI.stop();
                            } else {
                                toastr.warning('Server is busy please try a while');
                                blockUI.stop();
                                $scope.cancel();
                            }
                        });
                    }
                    // $scope.reviewData = {};
                    // $scope.isRatingFractional = false;
                    // $scope.frationalArray = [];
                    // $scope.getReview = function () {
                    //     var agentId = $stateParams.id;
                    //     ownerService.getReviewForUser(agentId).get(function (response) {
                    //         if (response.code == 200) {
                    //             $scope.outOFReviewer = response.total_review;
                    //             $scope.userRate = (response.data>0)?response.data:0;
                    //             var i = $scope.userRate;
                    //             var integerPart = parseInt(i);
                    //             var frationalPart = Math.abs(integerPart - i);
                    //             if (Number.isInteger(i) && frationalPart < 0.5) {
                    //                 $scope.isRatingFractional = false;
                    //             } else {
                    //                 $scope.isRatingFractional = true;
                    //                 for (var j = 0; j < integerPart; j++) {
                    //                     if (j == integerPart - 1) {
                    //                         $scope.frationalArray[j] = 'fractional';
                    //                     } else {
                    //                         $scope.frationalArray[j] = 'integer';
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //     });
                    // }();
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
        };

        /**
         * Function is to upload banner image
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 
         */
        $scope.uploadBanner = function (files) {

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
        $scope.pagination = {
            current: 1
        };
        $scope.getAgentDashboardProperty = function () {
            var agencyId = '';
            // if ($localStorage.userData.agency_id) {
            //     agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            var userId;
            userRoleId = roleId.owner;
            userId = $stateParams.id;
            var postData = {
                "request_by_role": userRoleId,
                "user_id": userId
            };
            PropertyService.getPropertyListing().post(postData, function (response) {
                if (response.code == 200) {
                    $scope.propertyList1 = new Array();
                    $scope.propertyList1 = response.data;
                    $scope.propertyList = _.reject($scope.propertyList1, function (obj) {
                        return obj.save_as_draft === true;
                    });
                    blockUI.stop();
                } else {
                    $scope.propertyList = [];
                    blockUI.stop();
                }
            });
            // }

        }
        $scope.fileImageUrl = baseUrl + '/document/';
        $scope.reviewData = {};
        $scope.isRatingFractional = false;
        $scope.frationalArray = [];
        $scope.getReview = function () {
            var agentId = $stateParams.id;
            ownerService.getReviewForUser(agentId).get(function (response) {
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
        };

        $scope.openReviewPopup = function (id, oldCount) {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/tenants/views/add_review.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    /* Rating section start from here */
                    $scope.userRate = oldCount;
                    $scope.userMax = 5;
                    $scope.outOFReviewer = 5;
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
                        ownerService.addReview().post(postData, function (response) {
                            if (response.code == 200) {
                                toastr.success('Review added successfully');
                                $scope.reviewData.review_comments = ' ';
                                $scope.getReview();
                                $scope.showReview('all');
                                $scope.cancel();
                                blockUI.stop();
                            } else {
                                toastr.warning('Server is busy please try a while');
                                blockUI.stop();
                                $scope.cancel();
                            }
                        });
                    }

                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
        };

        $scope.showReview = function (selection) {
            if (selection == 'all') {
                $scope.isAll = true;
                $scope.agentReview = false;
                $scope.tenantReview = false;
                /**
                 * get all user reviews
                 */
                var agentId = $stateParams.id;
                ownerService.getAllUSerReview(agentId).get(function (response) {
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
                $scope.tenantReview = false;
                /**
                 * get tenant user reviews
                 */
                var postData = {
                    "user_id": $stateParams.id,
                    "user_role": $scope.agentId
                }
                ownerService.getTenantUSerReview().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.agentReviewList = response.data;
                        $scope.agentReviewList.map(function (item) {
                            if (item.review_by._id == $localStorage.loggedInUserId) {
                                $scope.allow_togive_review = false;
                            }
                        });
                    }
                });
            } else if (selection == 'tenant_review') {
                $scope.isAll = false;
                $scope.agentReview = false;
                $scope.tenantReview = true;
                /**
                 * get tenant user reviews
                 */
                var postData = {
                    "user_id": $stateParams.id,
                    "user_role": $scope.tenantId
                }
                ownerService.getTenantUSerReview().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.tenantReviewList = response.data;
                        $scope.tenantReviewList.map(function (item) {
                            if (item.review_by._id == $localStorage.loggedInUserId) {
                                $scope.allow_togive_review = false;
                            }
                        });
                    }
                });
            }
        }
        $scope.vm = {};
        $scope.vm.numRecords = 5;
        $scope.vm.page = 1;

        $scope.vm.next = function (tab) {
            $scope.vm.page = $scope.vm.page + 1;
            if (tab == "all") {
                $scope.diff = (($scope.allReviewList.length / $scope.vm.numRecords) - Math.floor($scope.allReviewList.length / $scope.vm.numRecords) == 0) ? ($scope.allReviewList.length / $scope.vm.numRecords) : (Math.floor($scope.allReviewList.length / $scope.vm.numRecords) + 1);
                if ($scope.vm.page > $scope.diff) {
                    $scope.vm.page = 1;
                }
            } else if (tab == "agent") {
                $scope.diff = (($scope.agentReviewList.length / $scope.vm.numRecords) - Math.floor($scope.agentReviewList.length / $scope.vm.numRecords) == 0) ? ($scope.agentReviewList.length / $scope.vm.numRecords) : (Math.floor($scope.agentReviewList.length / $scope.vm.numRecords) + 1);
                if ($scope.vm.page > $scope.diff) {
                    $scope.vm.page = 1;
                }
            } else {
                $scope.diff = (($scope.tenantReviewList.length / $scope.vm.numRecords) - Math.floor($scope.tenantReviewList.length / $scope.vm.numRecords) == 0) ? ($scope.tenantReviewList.length / $scope.vm.numRecords) : (Math.floor($scope.tenantReviewList.length / $scope.vm.numRecords) + 1);
                if ($scope.vm.page > $scope.diff) {
                    $scope.vm.page = 1;
                }
            }

        };

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
                        ownerService.sendMessage().post(obj, function (response) {
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
                    $scope.getReview();
                    if (section_name == 'all') {
                        $scope.isAll = true;
                        $scope.tenantReview = false;
                        $scope.agentReview = false;
                        $scope.showReview('all');
                    } else if (section_name == 'tanent') {
                        $scope.isAll = false;
                        $scope.tenantReview = true;
                        $scope.agentReview = false;
                        $scope.showReview('tenant_review');
                    } else if (section_name == 'agent') {
                        $scope.isAll = false;
                        $scope.tenantReview = false;
                        $scope.agentReview = true;
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