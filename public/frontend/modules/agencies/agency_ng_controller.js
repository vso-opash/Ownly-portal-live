
/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 * test
 */
(function () {
    // 'ngImgCrop', 'ImageCropper'	
    angular.module('SYNC', ['uiCropper'])
        .controller("AgencyCtrl", AgencyCtrl);
    AgencyCtrl.$inject = [
        '$state',
        '$scope',
        '$localStorage',
        '$rootScope',
        '$timeout',
        'Upload',
        '$http',
        '$filter',
        '$window',
        '$location',
        '$stateParams',
        'permissions',
        'Flash',
        'toastr',
        'blockUI',
        'userService',
        'AgencyService',
        '$uibModal',
        'PropertyService',
        'TenantService',
        'StrataUserService'
    ];

    function AgencyCtrl($state, $scope, $localStorage, $rootScope, $timeout, Upload, $http, $filter, $window, $location, $stateParams, permissions, Flash, toastr, blockUI, userService, AgencyService, $uibModal, PropertyService, TenantService, StrataUserService) {
        $scope.emojiMessage = {};

        var agencyId;
        $scope.allow_togive_review = true;
        $scope.fileImageUrl = baseUrl + '/document/';

        if ($localStorage.userData.agency_id) {
            agencyId = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
        }
        else if ($stateParams.id) {
            agencyId = $stateParams.id;
        }

        $scope.signup_link = '';
        if ($localStorage.role_id == roleId.ownAgency) {
            $scope.mail_content = 'Hi team,%0D%0A%0D%0APlease join using the url below.%0D%0A%0D%0A' + baseURL_for_site + '#!/property_manager/' + $localStorage.userData._id + '%0D%0A%0D%0ABest Regards,%0D%0ASyncitt Team%0D%0A%0D%0A';
            $scope.signup_link = 'mailto:?body=' + $scope.mail_content + '&subject=Sign Up to become Syncitt Agent';
        } else if ($localStorage.role_id == roleId.runStrataManagementCompany) {
            $scope.mail_content = 'Hi team,%0D%0A%0D%0APlease join using the url below.%0D%0A%0D%0A' + baseURL_for_site + '#!/strata_manager/' + $localStorage.userData._id + '%0D%0A%0D%0ABest Regards,%0D%0ASyncitt Team%0D%0A%0D%0A';
            $scope.signup_link = 'mailto:?body=' + $scope.mail_content + '&subject=Sign Up to become Syncitt Strata Manager';
        }


        $scope.logged_in_user_id = $localStorage.loggedInUserId;
        // console.log("agencyId",agencyId);
        $scope.propertyManager1 = {};
        $scope.userImageUrl = '';
        $scope.agency = {};
        $scope.propertyList = [];
        $scope.pagination = {
            current: 1
        };
        $scope.tenant = roleId.tenant;
        $scope.owner = roleId.owner;
        $scope.propertyCount = 0;
        $scope.propertyImage = baseUrl + '/property_image/';
        $scope.imageUrl = baseUrl + '/user_image/';
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        $scope.userInfo = {};
        //Angular carousel start from here
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;

        $scope.addSlide = function () {
            var newWidth = 600 + slides.length + 1;
            slides.push({
                image: '//unsplash.it/' + newWidth + '/300',
                text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
                id: currIndex++
            });
        };

        $scope.randomize = function () {
            var indexes = generateIndexesArray();
            assignNewIndexesToSlides(indexes);
        };

        for (var i = 0; i < 4; i++) {
            $scope.addSlide();
        }

        // Randomize logic below

        function assignNewIndexesToSlides(indexes) {
            for (var i = 0, l = slides.length; i < l; i++) {
                slides[i].id = indexes.pop();
            }
        }

        function generateIndexesArray() {
            var indexes = [];
            for (var i = 0; i < currIndex; ++i) {
                indexes[i] = i;
            }
            return shuffle(indexes);
        }

        // http://stackoverflow.com/questions/962802#962890
        function shuffle(array) {
            var tmp, current, top = array.length;

            if (top) {
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }

            return array;
        }
        //ends here

        $scope.initialize = function () {

            $scope.imageCropResult = null;
            $scope.showImageCropper = false;

            $scope.allroleId = roleId;
            $scope.logged_in_role_id = $localStorage.role_id;

            if (agencyId) {
                $scope.getAgencyByAgentId();
                $scope.getAgencyProperty();
                $scope.getAgencyAgent();
            } else {
                // toastr.info("You are a not associated with any agency yet");
                $state.go('dashboard');
            }

        }
        $scope.getAgencyByAgentId = function () {
            $scope.view;
            var postData = {
                "agency_id": agencyId,
                "role_id": roleId.ownAgency
                // "role_id": $localStorage.role_id
            };

            if (agencyId) {
                AgencyService.agencyProfileData().post(postData, function (response) {
                    // console.log("response", response);
                    if (response.code == 200) {
                        $scope.agency = response.data[0];
                        $scope.totalManagerCount = response.total_manager;
                        $scope.userInfo = (response.data[0]) ? response.data[0].users : '';

                        if (response.data && response.data[1] && response.data[1].value)
                            $scope.propertyCount = response.data[1].value;

                        if ($scope.userInfo && $scope.userInfo._id && $scope.userInfo._id == $localStorage.loggedInUserId) {
                            $scope.view = true;
                        } else {
                            $scope.view = false;
                        }
                        $scope.isAll = true;
                        $scope.tenantReview = false;
                        $scope.ownerReview = false;
                        $scope.showReview('all', $scope.userInfo._id);
                        $scope.userImageUrl = baseUrl + '/user_image/';
                        $scope.getAgencyReview($scope.userInfo._id);
                    }
                });
            }
        }
        $scope.getAgencyProperty = function () {
            var postData = {
                "agency_id": agencyId,
                "user_id": $localStorage.loggedInUserId
            }
            if (agencyId && $localStorage.loggedInUserId) {
                AgencyService.getAgencyProperties().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.propertyList = response.data;
                    }
                });
            }
        }
        $scope.getAgencyAgent = function () {
            blockUI.start();
            var loggedInUserId = $localStorage.loggedInUserId;
            var postData = {
                "agency_id": agencyId,
                "user_id": loggedInUserId
            };
            if (loggedInUserId && agencyId) {
                if ($localStorage.role_id == roleId.runStrataManagementCompany) {
                    StrataUserService.getStartaList().post(postData, function (response) {
                        if (response.code == 200) {
                            $scope.agentList = response.data;
                            $scope.userImage = baseUrl + '/user_image/';
                        }
                        blockUI.stop();
                    });
                } else {
                    AgencyService.getAgencyAgentList().post(postData, function (response) {
                        if (response.code == 200) {
                            $scope.agentList = response.data;
                            $scope.userImage = baseUrl + '/user_image/';
                        }
                        blockUI.stop();
                    });
                }
            }
        }
        $scope.goToAgent = function (agentId) {
            $location.path('profile/' + agentId);
        }
        $scope.goToPropertyList = function () {
            $location.path('property_listing');
            $localStorage.userData.routeState = "Properties";
            $rootScope.navBarOptionSelected = "Properties";
        }
        /**
 * Function is to upload banner image
 * @access private
 * @return json
 * Created 
 * @smartData Enterprises (I) Ltd
 * Created Date 
 */
        $scope.uploadBanner = function (files) {
            // console.log("files",files);
            if (files && files.length) {
                blockUI.start();
                // for (var i = 0; i < files.length; i++) {
                var file = files[0];
                if (!file.$error) {

                    Upload.upload({
                        url: baseUrl + '/api/updateAgencyBannerPic',
                        data: {
                            _id: agencyId,
                            file: file,
                        }
                    }).then(function (response) {
                        if (response.status == 200) {
                            toastr.success('Successfully changed banner image');
                            $scope.initialize();
                            blockUI.stop();
                        } else {
                            toastr.error($scope.errorMsg = response.message + ': missing field ' + response.paramName);
                            blockUI.stop();
                        }
                    }, null, function (evt) {
                        $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                    });
                } else {
                    toastr.error("Max allowed size for banner image is 10MB");
                    blockUI.stop();

                }
                // }
            }
        };
        /**
  * Function is to upload logo image
  * @access private
  * @return json
  * Created 
  * @smartData Enterprises (I) Ltd
  * Created Date 
  */
        $scope.uploadLogo = function (files) {
            if (files && files.length) {
                blockUI.start();
                // for (var i = 0; i < files.length; i++) {
                var file = files[0];
                // console.log("file", file.$error);
                if (!file.$error) {
                    Upload.upload({
                        url: baseUrl + '/api/updateAgencyLogoPic',
                        data: {
                            _id: agencyId,
                            file: file,
                        }
                    }).then(function (response) {
                        if (response.status == 200) {
                            toastr.success('Successfully changed your agency logo');
                            $scope.initialize();
                            blockUI.stop();

                        } else {
                            toastr.error($scope.errorMsg = response.message + ': missing field ' + response.paramName);
                            blockUI.stop();
                        }
                    }, null, function (evt) {
                        $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                    });
                } else {
                    toastr.error("Max allowed size for agency logo is 10MB");
                    blockUI.stop();

                }
                // }
            } else {
                toastr.error("Max allowed size for agency logo is 10MB");
                blockUI.stop();

            }
        };

        $scope.getDate = function () {
            var d = moment().format('YYYY-MM-DD h:mm:ss a');
            var n = moment().format("MMM Do") + ', ' + moment().format('LT');
            return n;
        }

        /**
    * Function is to open send message
    * @access private
    * @return json
    * Created 
    * @smartData Enterprises (I) Ltd
    * Created Date 
    */
        $scope.openAgencySendMessage = function (id, name) {
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
                        AgencyService.sendMessage().post(obj, function (response) {
                            if (response.code == 200) {
                                toastr.success('Successfully sent message to agent');
                                //    console.log("response",response);
                                $scope.cancel();
                                blockUI.stop();
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
        * Function is to open add property manager
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 
        */
        $scope.addPropertyManager = function () {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/agencies/views/addPropertyManager.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.initializeAddManager = function () {
                        //$scope.originForm = angular.copy($scope.propertyManager1);
                        // console.log("propertyManager1", $scope.propertyManager1);
                        $scope.property = {};
                        $scope.propertyManager1 = {};
                    }
                    $scope.addManager = function (propertyData) {
                        blockUI.start();
                        $scope.loginLoading = true;
                        var obj = {};
                        var agencyId;
                        if ($localStorage.userData.agency_id) {
                            agencyId = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                        }
                        var postData = {
                            "email": propertyData.email,
                            "password": propertyData.pwd,
                            "firstname": propertyData.firstname,
                            "lastname": propertyData.lastname,
                            "mobile_no": propertyData.mobile_no,
                            "agency_id": agencyId
                        }
                        AgencyService.addPropertyManager().post(postData, function (response) {
                            if (response.code == 200) {
                                $scope.propertyManager1 = {};
                                toastr.success('Property manager added successfully');
                                $scope.loginLoading = false;
                                $scope.cancel();
                                $scope.getAgencyByAgentId();
                                //    $scope.getAgencyAgent();
                                blockUI.stop();
                            } else if (response.code == 201) {
                                toastr.warning('Already user exist with this email id');
                                $scope.loginLoading = false;
                                blockUI.stop();

                            } else {
                                toastr.warning('Server is busy please try a while');
                                $scope.loginLoading = false;
                                blockUI.stop();
                            }
                        });
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });

        };
        $scope.openAgencyEdit = function () {
            $localStorage.userData.routeState = "Settings";
            $rootScope.navBarOptionSelected = "Settings";
            $state.go('setting');
        }

        /**
         * Used to get agency review
         * Date
         * @smartData Enterprises (I) Ltd
         * @access private
         * @return json
         */
        $scope.getAgencyReview = function (id) {
            $scope.id = id;
            $scope.createdByRate = {};
            TenantService.getReviewForUser($scope.id).get(function (response) {
                if (response.code == 200) {
                    $scope.createdByRate = response;
                    $scope.createdByRate.data = ($scope.createdByRate.data > 0) ? $scope.createdByRate.data : 0;
                    $scope.createdByRate.total_review = ($scope.createdByRate.total_review) ? $scope.createdByRate.total_review : 0;
                } else {
                    $scope.createdByRate.data = 0;
                    $scope.createdByRate.total_review = 0;
                }
            });

        };
        /**
             * Used to open review pop up
             * Date
             * @smartData Enterprises (I) Ltd
             * @access private
             * @return json
             */
        $scope.openReviewPopup = function (id) {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/agencies/views/add_review.html',
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
                            agencyId = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                        }
                        var postData = {
                            "review_by": $localStorage.loggedInUserId,
                            "review_to": id,
                            "comments": reviewData.review_comments,
                            "quality_of_work": $scope.qualityOfWorkValue,
                            "punctaulity": $scope.punctualityValue,
                            "communication": $scope.communicationValue,
                            "review_by_role": $localStorage.role_id
                        };
                        TenantService.addReview().post(postData, function (response) {
                            if (response.code == 200) {
                                toastr.success('Review added successfully');
                                $scope.getAgencyReview(id);
                                $scope.isAll = true;
                                $scope.tenantReview = false;
                                $scope.ownerReview = false;
                                $scope.showReview('all', id);
                                $scope.loginLoading = false;
                                $scope.cancel();
                                blockUI.stop();
                            } else {
                                toastr.warning('Server is busy please try a while');
                                $scope.loginLoading = false;
                                blockUI.stop();
                                $scope.cancel();
                            }
                        });
                    }
                    $scope.reviewData = {};
                    $scope.isRatingFractional = false;
                    $scope.frationalArray = [];
                    $scope.getReview = function () {
                        var agentId = id;
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
        $scope.tenantReview = false;
        $scope.ownerReview = false;
        $scope.allReviewList = [];
        $scope.tenantReviewList = [];
        $scope.ownerReviewList = [];
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
            } else if (tab == "tenant") {
                $scope.diff = (($scope.tenantReviewList.length / $scope.vm.numRecords) - Math.floor($scope.tenantReviewList.length / $scope.vm.numRecords) == 0) ? ($scope.tenantReviewList.length / $scope.vm.numRecords) : (Math.floor($scope.tenantReviewList.length / $scope.vm.numRecords) + 1);
                if ($scope.vm.page > $scope.diff) {
                    $scope.vm.page = 1;
                }
            } else {
                $scope.diff = (($scope.ownerReviewList.length / $scope.vm.numRecords) - Math.floor($scope.ownerReviewList.length / $scope.vm.numRecords) == 0) ? ($scope.ownerReviewList.length / $scope.vm.numRecords) : (Math.floor($scope.ownerReviewList.length / $scope.vm.numRecords) + 1);
                if ($scope.vm.page > $scope.diff) {
                    $scope.vm.page = 1;
                }
            }

        };
        $scope.tenant = roleId.tenant;
        $scope.owner = roleId.owner;

        $scope.showReview = function (selection, id) {
            if (selection == 'all') {
                $scope.isAll = true;
                $scope.tenantReview = false;
                $scope.ownerReview = false;
                /**
                 * get all user reviews
                 */
                var agentId = id;
                TenantService.getAllUSerReview(id).get(function (response) {
                    if (response.code == 200) {
                        $scope.allReviewList = response.data;
                        $scope.allReviewList.map(function (item) {
                            if (item.review_by._id == $localStorage.loggedInUserId) {
                                $scope.allow_togive_review = false;
                            }
                        });
                    } else {
                        $scope.allReviewList = [];
                    }
                });
            } else if (selection == 'tenant_review') {
                $scope.isAll = false;
                $scope.tenantReview = true;
                $scope.ownerReview = false;
                /**
                 * get tenant user reviews
                 */
                var postData = {
                    "user_id": id,
                    "user_role": $scope.tenant
                }
                TenantService.getTenantUSerReview().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.tenantReviewList = response.data;
                        $scope.tenantReviewList.map(function (item) {
                            if (item.review_by._id == $localStorage.loggedInUserId) {
                                $scope.allow_togive_review = false;
                            }
                        });
                    } else {
                        $scope.tenantReviewList = [];
                    }
                });
            } else if (selection == 'owner_review') {
                $scope.isAll = false;
                $scope.tenantReview = false;
                $scope.ownerReview = true;
                /**
                 * get tenant user reviews
                 */
                var postData = {
                    "user_id": id,
                    "user_role": $scope.owner
                }
                TenantService.getTenantUSerReview().post(postData, function (response) {
                    if (response.code == 200) {
                        // console.log("$scope.ownerReviewList", $scope.ownerReviewList);
                        $scope.ownerReviewList = response.data;
                        $scope.ownerReviewList.map(function (item) {
                            if (item.review_by._id == $localStorage.loggedInUserId) {
                                $scope.allow_togive_review = false;
                            }
                        });
                    } else {
                        $scope.ownerReviewList = [];
                    }
                });
            }
        }
        // console.log("propertyManager1",$scope.propertyManager1);
        //Initalize add mananger object

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
                    $scope.getAgencyReview($scope.userInfo._id);

                    if (section_name == 'all') {
                        $scope.isAll = true;
                        $scope.tenantReview = false;
                        $scope.ownerReview = false;
                        $scope.showReview('all', $scope.userInfo._id);
                    } else if (section_name == 'tanent') {
                        $scope.isAll = false;
                        $scope.tenantReview = true;
                        $scope.ownerReview = false;
                        $scope.showReview('tenant_review', $scope.userInfo._id);
                    } else if (section_name == 'owner') {
                        $scope.isAll = false;
                        $scope.tenantReview = false;
                        $scope.ownerReview = true;
                        $scope.showReview('owner_review', $scope.userInfo._id);
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

                    var agencyId;

                    if ($localStorage.userData.agency_id) {
                        agencyId = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                    }
                    else if ($stateParams.id) {
                        agencyId = $stateParams.id;
                    }

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
                                _id: agencyId,
                                file: $scope.myCroppedImage
                            };
                            AgencyService.updateAgencyBannerImage().post(data, function (response) {
                                if (response.code == 200) {
                                    blockUI.stop();
                                    $uibModalInstance.dismiss('cancel');
                                    toastr.success('Banner is changed successfully.');
                                    $scope.getAgencyByAgentId();
                                    $scope.getAgencyProperty();
                                    $scope.getAgencyAgent();
                                    // $scope.property.files = [];
                                    setTimeout(() => {
                                        location.reload();
                                    }, 3000);
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
