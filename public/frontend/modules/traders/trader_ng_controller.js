/**
 * Super Angular Controller
 * @author
 * @created 10 August
 */
(function () {
    // 'ImageCropper'
    // 'ngImgCrop',
    angular.module('SYNC', ['uiCropper'])
        .controller("TraderCtrl", TraderCtrl);
    TraderCtrl.$inject = [
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
        'socket',
        'blockUI',
        'blockUIConfig',
        '$anchorScroll',
        'tradeService',
        'userService',
        'PropertyService',
        'maintainService',
    ];

    function TraderCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AlertService, toastr, socket, blockUI, blockUIConfig, $anchorScroll, tradeService, userService, PropertyService, maintainService) {
        /**
         * Here we are getting the default role id and others role ids in the system
         */
        $scope.allow_togive_review = true;
        $scope.isSearchedTrader = false;
        $scope.traderMsg;
        $rootScope.masterRoleId = $localStorage.defaultRoleId;
        $scope.logged_in_user_id = $localStorage.loggedInUserId;
        $scope.agent = roleId.agent;
        $scope.tenant = roleId.tenant;
        $scope.ownAgency = roleId.ownAgency;
        $scope.owner = roleId.owner;
        $scope.selected = 1;
        $scope.tenantpasswordStatus = false;
        $scope.display_less_number = true;
        $scope.pagination = {
            current: 1
        };
        $scope.limit = 8;
        $scope.number_of_pages = 8;

        $scope.tenantView = false;
        $scope.agentView = false;
        $scope.ownerView = false;
        $scope.isTenant = ($localStorage.role_id == roleId.tenant) ? true : false;

        if ($localStorage.role_id == roleId.tenant) {
            $scope.tenantView = true;
        }
        if ($localStorage.role_id == roleId.owner) {
            $scope.ownerView = true;
        }
        if ($localStorage.role_id == roleId.agent || $localStorage.role_id == roleId.ownAgency) {
            $scope.agentView = true;
        }

        $scope.signup_link = '';
        console.info('--------------------------')
        console.info('roleId =>',roleId)
        console.info('--------------------------')
        if ($localStorage.role_id == roleId.trader) {
            $scope.mail_content = 'Hi team,%0D%0A%0D%0APlease join using the url below.%0D%0A%0D%0A' + baseURL_for_site + '/#!/property_owner/' + $localStorage.userData._id + '?role=trader' + '%0D%0A%0D%0ABest Regards,%0D%0ASyncitt Team%0D%0A%0D%0A';
            $scope.signup_link = 'mailto:?body=' + $scope.mail_content + '&subject=Sign Up to become Syncitt Owner';
        }

        $scope.filterMatch = 'By best match';
        $scope.TodayDate = moment().format("YYYY MM DD");
        /* Rating section start from here */
        $scope.rate = 5;
        $scope.jobHistoryReview = [];
        $scope.jobHistoryReadOnly = true;
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
        //for gride and list view default settings
        $scope.listView = true;
        $scope.grideView = false;
        $scope.advanceSearchClass = "dropdown default-oder droplist";
        $scope.orderProperty = "";
        $scope.userImageUrl = baseUrl + '/user_image/';
        $scope.initailize = function () {

            $scope.imageCropResult = null;
            $scope.showImageCropper = false;

            $scope.provious_existing_traders();
            $scope.getUserDetails();
            $scope.getReview();
            $scope.showReview('all');

            if ($localStorage.setFocusonme && $localStorage.setFocusonme == true) {
                $location.hash('review_section');
                $anchorScroll();
                $localStorage.setFocusonme = false;
            } else {
                $location.hash('trader-prof');
                $anchorScroll();
            }
        }

        tradeService.getServiceCategoryList().get(function (response) {
            if (response.code == 200) {
                $scope.serviceList = response.data;

            } else {
                $scope.serviceList = [];
            }
        });

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

        $scope.showReview = function (selection) {
            if (selection == 'all') {
                $scope.isAll = true;
                $scope.tenantReview = false;
                $scope.ownerReview = false;
                /**
                 * get all user reviews
                 */
                var agentId = $stateParams.id;
                tradeService.getAllUSerReview(agentId).get(function (response) {
                    if (response.code == 200) {
                        $scope.allReviewList = response.data;
                        // console.log('$scope.allReviewList', $scope.allReviewList);
                        $scope.allReviewList.map(function (item) {
                            if (item.review_by._id == $localStorage.loggedInUserId) {
                                $scope.allow_togive_review = false;
                            }
                        });
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
                    "user_id": $stateParams.id,
                    "user_role": $scope.tenant
                }
                tradeService.getTenantUSerReview().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.tenantReviewList = response.data;
                        // console.log('$scope.tenantReviewList', $scope.tenantReviewList);
                        $scope.tenantReviewList.map(function (item) {
                            if (item.review_by._id == $localStorage.loggedInUserId) {
                                $scope.allow_togive_review = false;
                            }
                        });
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
                    "user_id": $stateParams.id,
                    "user_role": $scope.owner
                }
                tradeService.getTenantUSerReview().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.ownerReviewList = response.data;
                        $scope.ownerReviewList.map(function (item) {
                            if (item.review_by._id == $localStorage.loggedInUserId) {
                                $scope.allow_togive_review = false;
                            }
                        });
                    }
                });
            }
        }
        /**
         * Function is use to show property list view
         * @access private
         * @return json
         * Created
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.showListView = function () {
            $rootScope.isGride = false;
            $state.go('trader_listing');
            $scope.listView = true;
            $scope.grideView = false;
        };
        /**
         * Function is use to show property list view
         * @access private
         * @return json
         * Created
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.showGrideView = function () {
            $state.go('trader_listing');
            $scope.listView = false;
            $scope.grideView = true;
        };
        /**
         * Function is use to show property list view
         * @access private
         * @return json
         * Created
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.showGrideViewLoc = function () {
            //$state.go('propertyListing');
            $scope.showGrideView();
            $rootScope.isGride = true;
        };
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
                    "roleId": roleId.trader
                }
                if ($stateParams.id == $localStorage.loggedInUserId) {
                    $scope.viewEditBanner = true;
                } else {
                    $scope.viewEditBanner = false;
                }
                blockUI.start();
                userService.getUserById().post(userData, function (response) {
                    if (response.code == 200) {
                        $scope.name = response.data['firstname'];
                        $scope.userInfo = response.data;

                        $scope.traderView = true;
                        $scope.newArray2 = [];
                        userService.getServiceCategoryList().get(function (response) {
                            if (response.code == 200) {
                                $scope.serviceList1 = response.data;
                                if ($scope.serviceList1) {
                                    var new_week_list = [];
                                    angular.forEach($scope.serviceList1, function (value, key) {
                                        if ($scope.userInfo && $scope.userInfo.categories_id && $scope.userInfo.categories_id.indexOf(value._id) === -1) { }
                                        else
                                            $scope.newArray2.push({ name: value.name });
                                    });
                                }
                            } else {
                                $scope.newArray2 = [];
                            }
                        });


                        $scope.getTraderReview();
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });

            }
        };
        /**
     * Function is to get trader list
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */

        // $scope.getTraderList = function () {
        $scope.getTraderList = function (page_number) {
            blockUI.start();
            $scope.traderList = [];
            if ($rootScope.isGride == true) {
                $scope.listView = false;
                $scope.grideView = true;
            }
            $scope.savedTradersList = false;

            // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
            $scope.imageUrl = baseUrl + '/user_image/';
            var obj = {};
            obj.user_id = $localStorage.userData._id;
            obj.page_number = page_number;
            obj.limit = $scope.limit;
            obj.number_of_pages = $scope.number_of_pages;
            if ($localStorage.userData.agency_id) {
                obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            tradeService.traderList().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.selected = 1;
                    $scope.isSearchedTrader = false;
                    $scope.traderList = response.data;
                    $scope.totalRecord = response.totalCount;
                    $scope.mapInit(response.data);
                    blockUI.stop();
                } else {
                    $scope.traderList = [];
                    blockUI.stop();
                }
            });
            // } else {
            //     $scope.traderList = [];
            //     blockUI.stop();
            // }
        }
        $scope.pageChanged = function (page) {
            console.log('page :: current page => ', page);
            document.body.scrollTop = document.documentElement.scrollTop = 0;

            $scope.getTraderList(page);
        }

        //get current data functionality
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
     * Created Date 22-Nov-2017
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
                        tradeService.sendMessage().post(obj, function (response) {
                            if (response.code == 200) {
                                toastr.success('Successfully sent message to trader');
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
         * Function is to trader profile
         * @access private
         * @return json
         * Created
         * @smartData Enterprises (I) Ltd
         * Created Date
         */
        $scope.goToTraderProfile = function (id) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $location.path('trader_profile/' + id);
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
        * Function is to sort trader listing
        * @access private
        * @return json
        * Created
        * @smartData Enterprises (I) Ltd
        * Created Date
        */
        $scope.setOrderTrader = function (sortBy) {
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
            * Function is used to add to fav list
            * @access private
            * @return json
            * Created
            * @smartData Enterprises (I) Ltd
            * Created Date
        */
        $scope.addToFav = function (traderId, status, selected) {
            blockUI.start();
            if (selected == 2) {
                status = true;
            }
            var userId = $localStorage.loggedInUserId;
            status = (status == true) ? 2 : 1;
            if (traderId && userId) {
                var postData = {
                    "fav_by": userId,
                    "fav_to": traderId,
                    "fav_status": status
                }
                tradeService.addToFavTrader().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.ownerList = response.data;
                        if (selected == 1) {
                            // $scope.getTraderList();
                            $scope.getTraderList(1);
                        } else if (selected == 2) {
                            $scope.getSavedTraders();
                        }
                        if (status == 2) {
                            toastr.success('Successfully removed trader from favourites');
                        } else {
                            toastr.success('Successfully marked trader as favourites');
                        }
                    }
                });
            }
            blockUI.stop();
        }
        /**
         * Function is use to load map on show traders map locations
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 14-Dec-2017
         */
        $scope.showMapLocation = function (id) {
            // id = (id==1)?'All':'Saved'
            // $location.path('/trader_location/'+id);
            $state.go('trader_location');
        }
        /**
         * Function is used for trader search
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 04-Jan-2017
         */
        $scope.traderSearch = function (traderData) {
            if ($scope.trader.name || traderData.service_selection || traderData.city || traderData.city || traderData.state || traderData.zipCode) {
                blockUI.start();
                $scope.traderList;
                if ($rootScope.isGride == true) {
                    $scope.listView = false;
                    $scope.grideView = true;
                }
                // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
                $scope.imageUrl = baseUrl + '/user_image/';
                var obj = {};
                obj.user_id = $localStorage.userData._id;
                obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                // obj.firstname = (traderData.name) ? traderData.name : '';
                obj.state = (traderData.state) ? traderData.state : '';
                obj.city = (traderData.city) ? traderData.city : '';
                obj.zip_code = (traderData.zipCode) ? traderData.zipCode : '';
                obj.categories_id = (traderData.service_selection) ? traderData.service_selection : '';
                obj.page_number = 1;
                obj.limit = $scope.limit;
                obj.number_of_pages = $scope.number_of_pages;
                if ($scope.trader.name) {
                    obj.searchtext = $scope.trader.name
                }
                tradeService.traderList().post(obj, function (response) {
                    $scope.isSearchedTrader = true;
                    // $scope.searchTraderForm.name = '';
                    // $scope.trader.name = '';
                    // $scope.searchTraderForm.city = '';
                    // $scope.searchTraderForm.state = '';
                    // $scope.searchTraderForm.zipCode = '';
                    if (response.code == 200) {
                        $scope.traderList = response.data;
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                        angular.element('#traderSearchPopUp').hide();
                        $scope.advanceSearchClass = "dropdown default-oder droplist";
                        blockUI.stop();
                    } else {
                        $scope.traderList = [];
                        blockUI.stop();
                    }
                });
                // } else {
                //     $scope.traderList = [];
                //     blockUI.stop();
                // }
            } else {
                toastr.warning('Atleast fill one field for searching');
            }
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
            $scope.trader.name = '';
            $scope.trader.city = '';
            $scope.trader.state = '';
            $scope.trader.zipCode = '';
            $scope.traderList;
            // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
            $scope.imageUrl = baseUrl + '/user_image/';
            var obj = {};
            obj.user_id = $localStorage.userData._id;
            obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            tradeService.traderList().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.traderList = response.data;
                    $scope.mapInit(response.data);
                    blockUI.stop();
                } else {
                    $scope.traderList = [];
                    blockUI.stop();
                }
            });
            // } else {
            //     $scope.traderList = [];
            //     blockUI.stop();
            // }
            $scope.advanceSearchClass = "dropdown default-oder droplist";
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
                            "review_to": $stateParams.id,
                            "comments": reviewData.review_comments,
                            "quality_of_work": $scope.qualityOfWorkValue,
                            "punctaulity": $scope.punctualityValue,
                            "communication": $scope.communicationValue,
                            "review_by_role": $localStorage.role_id
                        };
                        tradeService.addReview().post(postData, function (response) {
                            if (response.code == 200) {
                                toastr.success('Review added successfully');
                                $scope.getTraderReview();
                                $scope.isAll = true;
                                $scope.tenantReview = false;
                                $scope.ownerReview = false;
                                $scope.showReview('all');
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
                        var agentId = $stateParams.id;
                        tradeService.getReviewForUser(agentId).get(function (response) {
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
            * Function is use to load map on property detail page
            * @return json
            * Created by
            * @smartData Enterprises (I) Ltd
            * Created Date 14-Dec-2017
            */
        $scope.getSavedTraders = function () {
            blockUI.start();
            $scope.traderList;
            if ($rootScope.isGride == true) {
                $scope.listView = false;
                $scope.grideView = true;
            }
            // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
            $scope.imageUrl = baseUrl + '/user_image/';
            var obj = {};
            obj.user_id = $localStorage.userData._id;
            tradeService.getSavedTradersList().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.traderMsg = "Saved";
                    $scope.selected = 2;
                    $scope.traderList = response.data;
                    $scope.totalRecord = response.total_count;
                    $scope.savedTradersList = true;
                    $scope.mapInit(response.data);
                    blockUI.stop();
                } else {
                    $scope.traderList = [];
                    blockUI.stop();
                }
            });
            // } else {
            //     $scope.traderList = [];
            //     blockUI.stop();
            // }
        }
        $scope.getTraderReview = function () {
            $scope.id = $stateParams.id
            $scope.createdByRate = {};
            PropertyService.getReviewForUser($scope.id).get(function (response) {
                if (response.code == 200) {
                    $scope.createdByRate = response;
                    $scope.userRate = ($scope.createdByRate.data > 0) ? $scope.createdByRate.data : 0;
                    $scope.outOFReviewer = ($scope.createdByRate.total_review) ? $scope.createdByRate.total_review : 0;
                } else {
                    $scope.userRate = 0;
                    $scope.outOFReviewer = 0;
                }
            });

        };
        /**
         * Function is use to load map on property detail page
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 14-Dec-2017
         */
        $scope.mapInit = function (traderData) {
            // console.log('traderData traderData', traderData);
            var iconURLPrefix = 'http://maps.google.com/mapfiles/ms/icons/';

            var icons = [
                iconURLPrefix + 'red-dot.png',
                iconURLPrefix + 'green-dot.png',
                iconURLPrefix + 'blue-dot.png',
                iconURLPrefix + 'orange-dot.png',
                iconURLPrefix + 'purple-dot.png',
                iconURLPrefix + 'pink-dot.png',
                iconURLPrefix + 'yellow-dot.png'
            ]
            var iconsLength = icons.length;
            var map = new google.maps.Map(document.getElementById('googleMap'), {
                //zoom: 10,
                //center: new google.maps.LatLng(-37.92, 151.25),
                //mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                panControl: false,
            });
            var infowindow = new google.maps.InfoWindow({
                maxWidth: 200
            });
            var markers = new Array();
            var iconCounter = 0;
            // Add the markers and infowindows to the map
            var serviceArea = [''];
            for (var i = 0; i < traderData.length; i++) {
                if (traderData[i].categories_id) {
                    for (var j = 0; j < traderData[i].categories_id.length; j++) {
                        if (serviceArea[i]) {
                            serviceArea[i] = serviceArea[i] + '<li><a href="javascript:void(0);" class="ng-binding ng-scope">' + traderData[i].categories_id[j].name + '</a></li>';
                        } else {
                            serviceArea[i] = '<li><a href="javascript:void(0);" class="ng-binding ng-scope">' + traderData[i].categories_id[j].name + '</a></li>';
                        }

                    }
                }
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(traderData[i].latitude, traderData[i].longitude),
                    map: map,
                    icon: icons[iconCounter]
                });
                markers.push(marker);
                // serviceArea[i] = _.without(serviceArea[i],"undefined");
                // traderData[i].about_user = _.without(traderData[i].about_user,"undefined");

                serviceArea[i] = (serviceArea[i] === undefined) ? "" : serviceArea[i];
                traderData[i].about_user = (traderData[i].about_user === undefined) ? "" : traderData[i].about_user;

                // document.getElementById('star1').hidden = "hidden";

                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        //traderData[i].address
                        infowindow.setContent(`<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 ng-scope" current-page="pagination.current" ng-repeat="trader in traderList| itemsPerPage:8| orderBy:orderProperty">
                        <div class=" marT20 clearfix inspection">
                          <div class="contact_info">
                            <div class="img-width inspection">
                              <a href="/#!/trader_profile/`+ traderData[i]._id + `">
                                <img class="img-circle" src="`+ baseUrl + `/user_image/` + traderData[i].image + `" alt="">
                              </a>
                              <span class="colorGreen_tenant"></span>
                            </div>
                            <h5 class="text-capitalize ng-binding">`+ traderData[i].firstname + ` ` + traderData[i].lastname + `</h5>
                            <div class="rating">
                              <ul>
                                <li  hidden="hidden">
                                  <i class="fa fa-star"></i>
                                </li>
                                <li>
                                  <i class="fa fa-star"></i>
                                </li>
                                <li >
                                  <i class="fa fa-star"></i>
                                </li>
                                <li>
                                  <i class="fa fa-star"></i>
                                </li>
                                <li>
                                  <i class="fa fa-star"></i>
                                </li>
                              </ul>
                            </div>
                            <div class="clearfix"></div>
                            <p class="ng-binding trader_map_view">`+ traderData[i].about_user + `</p>
                            <ul class="ser_cate" ng-show="trader.categories_id.length
                                          &amp;&amp; trader.hasOwnProperty('categories_id')">
                                `+ serviceArea[i] + `
                            </ul>
                            <button class="btn btn-property" ng-click="openSendMessage(`+ traderData[i].about_user + `)">Send message</button>
                          </div>

                              <a href="javascript:void(0)" ng-click="addToFav(`+ traderData[i].about_user + `)">

                              </a>
                        </div>
                      </div>`);
                        infowindow.open(map, marker);
                    }
                })(marker, i));

                iconCounter++;
                // We only have a limited number of possible icon colors, so we may have to restart the counter
                if (iconCounter >= iconsLength) {
                    iconCounter = 0;
                }
            }

            function autoCenter() {
                //  Create a new viewpoint bound
                var bounds = new google.maps.LatLngBounds();
                //  Go through each...
                for (var i = 0; i < markers.length; i++) {
                    bounds.extend(markers[i].position);
                }
                //  Fit these bounds to the map
                map.fitBounds(bounds);
            }
            autoCenter();
        }
        $scope.jobHistory = [];
        $scope.getTraderJobHistory = function () {
            if ($stateParams.id) {
                var postData = {
                    "trader_id": $stateParams.id,
                    "page_number": 0,
                    "number_of_pages": 0
                }
                tradeService.getTraderJobHistoryList().post(postData, function (response) {
                    if (response.code == 200) {
                        angular.forEach(response.data, function (value, key) {
                            var diff1 = moment(value.due_date).format("YYYY MM DD");
                            value.difference = Math.abs(moment(diff1).diff(moment($scope.TodayDate), 'days'));
                        });
                        $scope.jobHistory = response.data;
                    } else {
                        $scope.jobHistory = [];
                        toastr.warning('Server is busy please try a while');
                    }
                });
            }
        }
        $scope.reviewData = {};
        $scope.isRatingFractional = false;
        $scope.frationalArray = [];
        $scope.userMax = 5;
        $scope.getReview = function () {
            var agentId = $stateParams.id;
            tradeService.getReviewForUser(agentId).get(function (response) {
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
        }
        $scope.showPopup = function () {
            angular.element('#traderSearchPopUp').show();
        }
        $scope.hideSearchFilter = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            angular.element('#traderSearchPopUp').hide();
        }
        //Get traders according to tab selection on map
        // $scope.tradersOnMap = function(){
        //     var tab;
        //     tab = $stateParams.id;
        //     if(tab=="All"){
        //         $scope.getTraderList();
        //     }else if(tab=="Saved"){
        //         $scope.getSavedTraders();
        //     }
        // }

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
                        $scope.ownerReview = false;
                        $scope.showReview('all');
                    } else if (section_name == 'tanent') {
                        $scope.isAll = false;
                        $scope.tenantReview = true;
                        $scope.ownerReview = false;
                        $scope.showReview('tenant_review');
                    } else if (section_name == 'owner') {
                        $scope.isAll = false;
                        $scope.tenantReview = false;
                        $scope.ownerReview = true;
                        $scope.showReview('owner_review');
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

        $scope.openAddMaintenance = function (user_id) {
            // $scope.getTraderList();
            $scope.getTraderList(1);
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/maintenance/views/add.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.getSelectedTrader = function (fullname, id) {
                        if (fullname && id && fullname != '' && id != '') {
                            $scope.query = fullname;
                            console.log("$scope.query   ", $scope.query);
                            $scope.maintenance.trader_id = id;
                            $scope.showTraderSearch = false;
                        }
                    }

                    $scope.fromTraderProfile = true;
                    $scope.getAgencyProperty = function () {
                        blockUI.start();
                        var obj = {};
                        obj.request_by_id = $localStorage.loggedInUserId;
                        obj.request_by_role = $localStorage.role_id;
                        if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                            if ($localStorage.userData.agency_id) {
                                obj.agency_id = $localStorage.userData.agency_id
                            } else if ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) {
                                obj.agency_id = $localStorage.userData.agency_id._id;;
                            }
                        }
                        maintainService.maintenceProperty().post(obj, function (response) {
                            if (response.code == 200) {
                                $scope.propertyList = response.data;
                                blockUI.stop();
                            } else {
                                $scope.propertyList = [];
                                blockUI.stop();
                            }
                        });
                        blockUI.stop();
                    };
                    $scope.ngModelOptionsSelected = function (value) {
                        if (arguments.length) {
                            _selected = value;
                        } else {
                            return _selected;
                        }
                    };
                    $scope.modelOptions = {
                        debounce: {
                            default: 500,
                            blur: 250
                        },
                        getterSetter: true
                    };
                    $scope.maintenance = {};
                    $scope.newArray2 = [];
                    $scope.onSelect = function ($item, $model, $label) {
                        $scope.maintenance.trader_id = $item._id;
                        $model = $item._id;
                    };

                    $scope.traderOnSelect = function (traderId) {
                        //console.log('traderId',traderId);
                        $scope.maintenance.trader_id = traderId;
                        $model = traderId;
                    };

                    $scope.watcherInfo = function () {
                        blockUI.start();
                        var obj1 = {};
                        // if ($localStorage.role_id == roleId.agent && $localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                        if (($localStorage.userData.agency_id).hasOwnProperty('_id') == true && $localStorage.userData.agency_id && $localStorage.userData.agency_id._id) {
                            obj1.id = $localStorage.userData.agency_id._id;
                        } else {
                            obj1.id = $localStorage.userData.agency_id;
                        };
                        maintainService.getWatchersList().get(obj1, function (response) {
                            if (response.code == 200) {
                                $scope.watcher = response.data;
                                angular.forEach($scope.watcher, function (value, key) {
                                    value.fullName = value.firstname + " " + value.lastname;
                                });
                                blockUI.stop();
                            } else {
                                $scope.watcher = [];
                                blockUI.stop();
                            }
                        });
                        // }
                        blockUI.stop();
                    }

                    $scope.newArray3 = [];
                    $scope.getPropertyAgreement = function (property_id) {
                        if (property_id) {
                            PropertyService.getPropertyAgreementDetails(property_id).get(function (response) {
                                if (response.code == 200) {
                                    $scope.agreementDetails = response.data;
                                    if ($scope.agreementDetails && $scope.agreementDetails.tenants) {
                                        $scope.default_watchers = _.map($scope.agreementDetails.tenants, function (o) { return _.pick(o, 'users_id'); });
                                        if ($scope.default_watchers) {
                                            $scope.default_watchers.map(function (item) {
                                                $scope.newArray3.push({ "_id": item.users_id._id });
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    };

                    $scope.get_default_watchers = function (property_data) {
                        var user_obj = {};
                        user_obj.user_id = property_data.created_by._id;
                        userService.getUserActiveRole().post(user_obj, function (response) {
                            if (response.code == 200) {
                                $scope.roleInformation = response.data;
                                $scope.roleInformation.map(function (item) {
                                    if (item.role_id && item.role_id._id) {
                                        if (item.role_id._id == roleId.agent) {
                                            $scope.newArray3.push({ "_id": property_data.created_by._id });
                                        }
                                    }
                                });
                            }
                        });
                        $scope.getPropertyAgreement(property_data._id);
                    }

                    $scope.debounce = function (func, wait, immediate) {
                        var timeout;
                        return function() {
                          var context = this,
                            args = arguments;
                          var callNow = immediate && !timeout;
                          clearTimeout(timeout);
                          timeout = setTimeout(function() {
                            timeout = null;
                            if (!immediate) {
                              func.apply(context, args);
                            }
                          }, wait);
                          if (callNow) func.apply(context, args);
                        }
                      }
                      
            
                    $scope.callAPI = function (search) {
                        blockUI.start();
                        if (search && search !== "" && $scope.maintenance.category_id && $scope.maintenance.category_id != '') {
                            let obj2 = {
                                categories_id: $scope.maintenance.category_id,
                                searchtext: search
                            }
                            maintainService.tradersListForMR().post(obj2, function (trader_list) {
                                $scope.allTradersList = trader_list.data;
                                console.log("$scope.allTradersList    ", $scope.allTradersList);
                            });
                        } else {
                            $scope.allTradersList = []
                        }
                        blockUI.stop();
                    }
                      $scope.searchTextbox = $scope.debounce($scope.callAPI,1000)

                    $scope.addMR = function (data) {
                        // if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                        $scope.loginLoading = true;
                        // console.log('$scope.createMaintenanceForm.$invalid',$scope.createMaintenanceForm.$invalid);
                        if ($scope.createMaintenanceForm.$invalid == false) {
                            var obj = {};
                            obj = data;
                            obj.email = $localStorage.userData.email;
                            console.log("obj.email  ", obj.email);
                            obj.budget = (obj.budget > 0) ? obj.budget : 0;
                            obj.created_by = $localStorage.loggedInUserId;
                            obj.created_by_role = $localStorage.role_id;
                            obj.forwarded_by = $scope.forwardId;
                            obj.budget = parseInt(obj.budget);
                            obj.request_type = parseInt(0);
                            obj.trader_id = user_id;

                            // obj.due_date = new Date(data.due_date);

                            if (data.dt != "") {
                                obj.due_date = new Date(data.dt);
                            }
                            else {
                                obj.due_date = ' ';
                            }
                            if ($localStorage.userData.agency_id && (($localStorage.userData.agency_id).hasOwnProperty('_id') == true)) {
                                obj.agency_id = $localStorage.userData.agency_id._id;
                            } else {
                                obj.agency_id = $localStorage.userData.agency_id;
                            }

                            $scope.getPropertyAgreement(data.property_id);

                            // obj.watchers_list = _.map($scope.newArray2, function (o) { return _.pick(o, '_id'); });
                            // $scope.watchers_list = obj.watchers_list.concat($scope.newArray3);
                            // obj.watchers_list = $scope.watchers_list;

                            obj.watchers_list = [];
                            obj.watchers_list.push({ "_id": $localStorage.loggedInUserId });

                            // if ((obj.watchers_list).length == $scope.newArray2.length) {
                            var images = obj.images;
                            obj.images = [];

                            if (data.latitude && data.longitude && data.latitude != '' && data.longitude != '') {

                            } else {
                                obj.latitude = 0;
                                obj.longitude = 0;
                            }

                            // maintainService.addMaintenance().post(obj, function (response) {
                            maintainService.addMR().post(obj, function (response) {
                                if (response.code == 200) {
                                    // if($localStorage.role_id != roleId.tenant)
                                    var message = {
                                        from: $localStorage.loggedInUserId,
                                        to: response.data._id,
                                        textMsg: 'Sent',
                                        time: $scope.getDate(),
                                        maintenanceId: response.data._id,
                                        is_status: true
                                    }

                                    socket.emit('maintenanceGroupMessageSent', message);

                                    obj.images = images;
                                    $scope.isTaderPickFromSave = false;
                                    $scope.maintenance.property_id = undefined;
                                    $scope.uploadFiles(obj, response.data._id);
                                    $scope.loginLoading = false;

                                } else {
                                    $scope.traderList = [];
                                    $scope.loginLoading = false;

                                }
                            });
                            // }

                        } else {
                            toastr.error("Please fill the form completely");
                            $scope.loginLoading = false;

                        }
                        // } else {
                        //     toastr.error("First associate yourself with any agency");
                        // }
                    };
                    $scope.uploadFiles = function (files, data) {
                        if (files.images && files.images.length) {
                            blockUI.start();
                            for (var i = 0; i < files.images.length; i++) {
                                var file = files.images[i];
                                if (!file.$error) {
                                    Upload.upload({
                                        url: baseUrl + '/api/uploadMaintenanceImages',
                                        data: {
                                            _id: data,
                                            file: file,
                                        }
                                    }).then(function (response) {
                                        if (response && response.status == 200) {
                                            toastr.success("Successfully added maintenance request");
                                            $scope.cancel();
                                            blockUI.stop();
                                        } else if (response.data.code == 400) {
                                            toastr.error("Failed to upload images");
                                            blockUI.stop();
                                        }
                                    }, null, function (evt) {
                                    });
                                }
                            }
                        } else {
                            toastr.success("Successfully added maintenance request");
                            $scope.cancel();
                            blockUI.stop();
                        }
                    };
                    $scope.RemovePhoto = function (index) {
                        //Find the record using Index from Array.
                        var name = $scope.maintenance.images[index];
                        $scope.maintenance.images.splice(index, 1);
                        if ($scope.maintenance.images.length == 0) {
                            delete $scope.maintenance.images;
                        }
                    };
                    $scope.removeWatcher = function (key) {
                        $scope.newArray2.splice(key, 1);

                    };
                    /**
* Function is for maintenance req calender
* @access private
* @return json
* Created
* @smartData Enterprises (I) Ltd
* Created Date
*/

                    $scope.clear = function () {
                        $scope.dt = null;
                    };

                    $scope.inlineOptions = {
                        customClass: getDayClass,
                        minDate: new Date(),
                        showWeeks: true
                    };

                    $scope.dateOptions = {
                        // dateDisabled: disabled,
                        formatYear: 'yy',
                        maxDate: new Date(2050, 5, 22),
                        minDate: new Date(),
                        startingDay: 1
                    };

                    // Disable weekend selection
                    function disabled(data) {
                        var date = data.date,
                            mode = data.mode;
                        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
                    }

                    $scope.toggleMin = function () {
                        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
                    };

                    $scope.toggleMin();

                    $scope.open1 = function () {
                        // console.log("called");
                        $scope.popup1.opened = true;
                    };
                    $scope.setDate = function (year, month, day) {
                        $scope.dt = new Date(year, month, day);
                    };

                    $scope.formats = ['dd-MMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                    $scope.format = $scope.formats[0];
                    $scope.altInputFormats = ['M!/d!/yyyy'];

                    $scope.popup1 = {
                        opened: false
                    };
                    function getDayClass(data) {
                        var date = data.date,
                            mode = data.mode;
                        if (mode === 'day') {
                            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                            for (var i = 0; i < $scope.events.length; i++) {
                                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                                if (dayToCheck === currentDay) {
                                    return $scope.events[i].status;
                                }
                            }
                        }
                    }
                    $scope.toggleMin = function () {
                        $scope.dateOptions.minDate = $scope.dateOptions.minDate ? null : new Date();
                    };

                    $scope.toggleMin();

                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
        };

        $scope.maintenanceInit = function () {
            // $scope.getTraderList();
            $scope.getTraderList(1);
            $scope.category_list();
        }

        $scope.category_list = function () {
            userService.getServiceCategoryList().get(function (response) {
                if (response.code == 200) {
                    $scope.category_listing = response.data;
                }
            });
        }

        $scope.addressInitialize = function () {
            $scope.maintenance.latitude = parseFloat(angular.element("#latitude").val());
            $scope.maintenance.longitude = parseFloat(angular.element("#longitude").val());
            $scope.getTraders();
        }

        $scope.getTraders = function () {
            console.log("getTraders    focus  ", $scope.maintenance);
            if ($scope.maintenance.address && $scope.maintenance.category_id && $scope.maintenance.address != '' && $scope.maintenance.request_type == 0 && $scope.maintenance.category_id != '') {
                $scope.showTraderSearch = true;
                var obj = {};
                if ($scope.maintenance.address && $scope.maintenance.address != '')
                    obj.address = $scope.maintenance.address;
                if ($scope.maintenance.category_id && $scope.maintenance.category_id != '')
                    obj.categories_id = $scope.maintenance.category_id;
                // var obj = {
                // "address": maintenance.address,
                // "address": $scope.maintenance.address,
                // "categories_id": $scope.maintenance.category_id,
                // "categories_id": "5d3e9b6ce7406a34c8160748",
                // "search_text" : 'ra'
                // };
                if (obj) {
                    maintainService.provious_existing_traders().post(obj, function (response) {
                        if (response.code == 200 && response.data) {
                            $scope.traderData = response.data;
                            console.log("$scope.traderData   ", $scope.traderData);
                        }
                    });
                }
            }
        }

        $scope.watcherInfo = function () {
            var obj1 = {};
            // if ($localStorage.role_id == roleId.agent && $localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                obj1.id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                maintainService.getWatchersList().get(obj1, function (response) {
                    if (response.code == 200) {
                        $scope.watcher = response.data;
                        angular.forEach($scope.watcher, function (value, key) {
                            value.fullName = value.firstname + " " + value.lastname;
                            value.fullName = $scope.capitalizeName(value.fullName) + "-" + value.email;
                        });

                    } else {
                        $scope.watcher = [];

                    }
                });
            }
            // console.log("$scope.watcher   ", $scope.watcher);
        }

        $scope.capitalizeName = function (name) {
            return name.replace(/\b(\w)/g, s => s.toUpperCase());
        }

        $scope.goToMaintDetail = function (id) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $location.path('maintance_detail/' + id);
        }

        $scope.show_full_number = function () {
            $scope.display_less_number = false;
            var user_id = $localStorage.loggedInUserId;
            var postData = {
                "user_id": $stateParams.id,
                "reveal_contact_number": 1
            }
            tradeService.updateRevealContactNumber().post(postData, function (response) {
                if (response.code == 200) {

                }
            });
        }

        $scope.provious_existing_traders = function () {
            var obj = {
                "address": "609/89 High St, Kew VIC 3101, Australia",
                "categories_id": "5bb366021ef59b3239a0dab8"
            };
            tradeService.provious_existing_traders().post(obj, function (response) {

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


                    $scope.myImage = '';
                    $scope.myCroppedImage = '';
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
