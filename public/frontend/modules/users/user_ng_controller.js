/**
 * Super Angular Controller
 * @author Ankur A.
 * @author Minakshi kumar
 * @created 04 Nov, 16
 */

(function () {
    // 'ngImgCrop', 'ImageCropper',
    angular.module('SYNC', ['uiCropper', 'angularPayments'])
        .directive('lightboxDirective', function () {
            return {
                restrict: 'E', // applied on 'element'
                transclude: true, // re-use the inner HTML of the directive
                template: '<section ng-transclude></section>', // need this so that inner HTML will be used
            }
        })
        .controller("UserCtrl", UserCtrl);
    UserCtrl.$inject = [
        '$scope',
        '$rootScope',
        '$timeout',
        'Upload',
        '$http',
        '$filter',
        '$window',
        '$location',
        '$stateParams',
        'Crud',
        '$uibModal',
        'SweetAlert',
        'permissions',
        'APP_CONST',
        'Flash',
        'AlertService',
        'toastr',
        '$localStorage',
        '$state',
        'userService',
        'blockUI',
        'blockUIConfig',
        'PropertyService',
        'AgencyService',
        'FileUploader',
        '$route',
        '$auth',
    ];
    function UserCtrl($scope, $rootScope, $timeout, Upload, $http, $filter, $window, $location, $stateParams, Crud, $uibModal, SweetAlert, permissions, APP_CONST, Flash, userService, toastr, $localStorage, $state, userService, blockUI, blockUIConfig, PropertyService, AgencyService, FileUploader, $route, $auth) {

        // var dateString = new Date(moment(1572265486).format('YYYY-MM-DD h:mm:ss a'));
        // console.log("Date : ", dateString.toISOString());
        $scope.page = 7;
        $scope.logged_in_user_id = $localStorage.loggedInUserId;
        $scope.allow_togive_review = true;
        $scope.country = country;
        $scope.filePopup = [false];
        $scope.editAcive = "active";
        $scope.notifiStatus;
        $scope.passwordAcive = " ";
        $scope.subscriptionActive = " ";
        $scope.isAgentTenant = ($localStorage.role_id == roleId.agent || $localStorage.role_id == roleId.tenant) ? true : false;
        $scope.notificationAcive = " ";
        $scope.propertyImageUrl = baseUrl + '/property_image/';
        $scope.roleSettingActive = " ";
        $scope.userImageActive = " ";
        $scope.traderAvailability = "";
        $scope.occupacy_section = "";
        $scope.identification_section = "";
        $scope.imageUrl = baseUrl + '/user_image/';
        $scope.property = {};
        $scope.listView = true;
        $scope.grideView = false;
        $scope.fileImageUrl = baseUrl + '/document/';
        $scope.user_edit_form = {};
        $scope.weekdays_list = weekdays;
        $scope.original_weekdays_list = weekdays;
        $scope.day_options_list = day_options;
        $scope.age_groups_list = age_groups;
        $scope.age_number_list = age_numbers;
        $scope.relationships_list = relationships;
        $scope.vehicle_types_list = vehicle_types;
        $scope.pet_types_list = pet_types;
        $scope.displayDaysOffOptions = false;
        $scope.display_less_number = true;
        $scope.subscribeModel = [];
        // $scope.display_occupants_section = 1;
        // $scope.display_vehicles_section = 1;
        // $scope.display_pets_section = 1;

        $scope.display_occupants_section1 = 0;
        $scope.display_vehicles_section1 = 0;
        $scope.display_pets_section1 = 0;

        if ($localStorage.role_id == roleId.trader && $localStorage.subscription_not_done && $localStorage.subscription_not_done == 'yes') {
            $scope.subscriptionActive = 'active';
            $scope.editAcive = '';
        }

        /* Rating section start from here */
        $scope.rate = 5;
        $scope.jobHistoryReview = [];
        $scope.jobHistoryReadOnly = true;
        $scope.max = 5;
        $scope.isReadonly = false;
        $scope.userActiveRoleId = $localStorage.role_id;
        $scope.agent = roleId.agent;
        $scope.tenant = roleId.tenant;
        $scope.owner = roleId.owner;
        $scope.trader = roleId.trader;
        $scope.owner = roleId.owner;
        $scope.ownAgency = roleId.ownAgency;
        $scope.startaAgency = roleId.runStrataManagementCompany;
        $scope.startaCompany = roleId.workForStrataManagementCompany;
        $scope.hoveringOver = function (value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };
        $scope.rolesList = {};

        $scope.clear = function () {
            $scope.imageCropStep = 1;
            delete $scope.imgSrc;
            delete $scope.result;
            delete $scope.resultBlob;
        };

        $scope.initailize = function () {
            $scope.imageCropResult = null;
            $scope.showImageCropper = false;

            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.showReview('all');

            $scope.initializeStripe();
        }

        $scope.documentList = [];

        $scope.agencyData = {};

        console.info('--------------------------')
        console.info('roleId =>',roleId)
        console.info('--------------------------')

        $scope.sendForgotPasswordInstruction = function(email) {
            console.info('--------------------------')
            console.info('FORGOT_EMAIL =>',email)
            console.info('--------------------------')
            $scope.loginLoading = true;
            if (typeof email != 'undefined') {
                blockUI.start();
                $rootScope.userEmail = {};
                var str = email;
                let forgot = {}
                forgot.email = str.toLowerCase();
                // $rootScope.userEmail.email = str;
                userService.forgotPassword().post(forgot, function (response) {
                    if (response.code == 200) {
                        // $state.go('reGeneratePassword');
                        $scope.loginLoading = false;
                        blockUI.stop();
                        response.message && toastr.success(response.message);
                    } else {
                        var err = (response.message) ? response.message : 'Something went wrong. Please try again later.';
                        toastr.error(err);
                        $scope.loginLoading = false;
                        blockUI.stop();
                    }
                });
                blockUI.stop();
            } else {
                $scope.loginLoading = false;
                toastr.error("Please enter your email address");
            }
        }

        $scope.signup_link = '';
        if ($localStorage.role_id == roleId.agent) {
            $scope.mail_content = 'Hi team,%0D%0A%0D%0APlease join using the url below.%0D%0A%0D%0A' + baseURL_for_site + '/#!/property_owner/' + $localStorage.userData._id + '%0D%0A%0D%0ABest Regards,%0D%0ASyncitt Team%0D%0A%0D%0A';
            $scope.signup_link = 'mailto:?body=' + $scope.mail_content + '&subject=Sign Up to become Syncitt Owner';
        }

        $scope.load_subscription_plans = function () {

            if ($scope.userActiveRoleId == $scope.trader) {
                $scope.subscription_plan_list = [];
                userService.subscription_plan_list().get(function (response) {
                    if (response.code == 200) {
                        $scope.subscription_plan_list = response.data;
                    }
                });
            }
        }

        $scope.initializeStripe = function () {
            var script = document.createElement('script');
            script.src = 'https://checkout.stripe.com/checkout.js';
            document.body.appendChild(script);
            script.onload = function () {
                var stripe = Stripe(stripe_key);
            };
        }

        /**
         * Subscribe Plan starts here
         */
        $scope.subscribePlan = function () {
            var handler = '';

            var plan_price = '';
            var plan_id = '';
            console.log('stripe_key :: check here => ', stripe_key);
            handler = StripeCheckout.configure(
                {
                    key: stripe_key,
                    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
                    locale: 'auto',
                    zipCode: false,
                    allowRememberMe: true,
                    token: function (token) {
                        if (token && token.id && token.email && token.card && token.card.id) {
                            console.log('stripe_plan_id ======  => ', $scope.subscription_plan_list[0].stripe_plan_id);
                            userService.subscribePlan().get({
                                stripe_token: token.id,
                                card_id: token.card.id,
                                email: token.email,
                                selected_plan_id: $scope.subscription_plan_list[0].stripe_plan_id,
                                exp_month: token.card.exp_month,
                                exp_year: token.card.exp_year,
                                last4: token.card.last4,
                                brand: token.card.brand
                            }, function (response) {
                                if (response.message && response.message == 'success') {
                                    $(document).find('subscribe_me').hide();
                                    $(document).find('#subscription_create').val("OK");
                                    angular.element(document.getElementById('subscription_create')).triggerHandler('change');
                                } else {
                                    $(document).find('#subscription_create').val("NOT_OK");
                                }
                            });
                        }
                    }
                }
            );

            $(document).find('#subscription_create').val("");
            angular.element(document.getElementById('subscription_create')).triggerHandler('change');

            plan_price = $(this).attr('data-price');
            plan_id = $(this).attr('data-plan_id');
            $(document).find('#selected_plan').val(plan_id);

            handler.open({
                name: 'Stripe',
                description: 'Standard Subscription',
                amount: Math.round(plan_price * 100),
                currency: 'usd',
                image: '/assets/images/subscription/symbol.svg'
            });
            // e.preventDefault();
        }
        /**
         * Subscribe Plan ends here
         */

        /**
         * Update Credit card starts here
         */
        $scope.updateCreditCard = function () {
            var handler1 = '';


            handler1 = StripeCheckout.configure(
                {
                    key: stripe_key,
                    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
                    locale: 'auto',
                    zipCode: false,
                    allowRememberMe: false,
                    panelLabel: "Update Card Details",
                    token: function (token) {
                        if (token && token.card && token.card.id) {
                            console.log("i m inside....");
                            var stripe_customer_id = $(document).find('#stripe_customer_id').val();
                            userService.updateCreditCard().get({
                                stripe_token: token.id,
                                card_id: token.card.id,
                                stripe_customer_id: stripe_customer_id,
                                exp_month: token.card.exp_month,
                                exp_year: token.card.exp_year,
                                last4: token.card.last4,
                                brand: token.card.brand
                            }, function (response) {
                                console.log('Update credit card api called => ', response);
                                if (response.message && response.message == 'success') {
                                    $(document).find('#subscription_update').val("OK");
                                    console.log("change event called");
                                    angular.element(document.getElementById('subscription_update')).triggerHandler('change');
                                } else {
                                    $(document).find('#subscription_update').val("NOT_OK");
                                }
                            });
                        }
                    }
                }
            );

            $(document).find('#subscription_update').val("");
            angular.element(document.getElementById('subscription_update')).triggerHandler('change');
            handler1.open({
                name: 'Stripe',
                description: 'Update Card Details',
                image: '/assets/images/subscription/symbol.svg'
            });
            // e.preventDefault();
        }
        /**
         * Update Credit card ends here
         */

        /*
            User roles settings are done here
        */
        $scope.setRoles = function () {
            $scope.agent = roleId.agent;
            $scope.tenant = roleId.tenant;
            $scope.owner = roleId.owner;
            $scope.trader = roleId.trader;
            $scope.owner = roleId.owner;
            $scope.ownAgency = roleId.ownAgency;
            $scope.startaAgency = roleId.runStrataManagementCompany;
            $scope.startaCompany = roleId.workForStrataManagementCompany;
            if ($localStorage.defaultRoleId == $scope.ownAgency) {
                $scope.rolesList = [
                    'Agent',
                    'Tenant',
                    'Trader',
                    'Owner',
                    'Agency Owner'
                ]
            } else if ($localStorage.defaultRoleId == $scope.agent) {
                $scope.rolesList = [
                    'Agent',
                    'Tenant',
                    'Trader',
                    'Owner'
                ]
            } else if ($localStorage.defaultRoleId == $scope.owner || $localStorage.defaultRoleId == $scope.trader || $localStorage.defaultRoleId == $scope.tenant) {
                $scope.rolesList = [
                    // Removed user role for now - Tenant role
                    // 'Tenant',
                    'Trader',
                    'Owner'
                ]
            } else if ($localStorage.defaultRoleId == $scope.startaCompany) {
                $scope.rolesList = [
                    'Tenant',
                    'Trader',
                    'Owner',
                    'Strata staff'
                ]
            } else if ($localStorage.defaultRoleId == $scope.startaAgency) {
                $scope.rolesList = [
                    'Tenant',
                    'Trader',
                    'Owner',
                    'Strata Principle',
                    'Strata staff'
                ]
            }
            console.log('$scope.rolesList :: static => ', $scope.rolesList);
        }
        $scope.ratingStates = [
            { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
            { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' }
        ];
        /* Rating section start from here */
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
                userService.getAllUSerReview(agentId).get(function (response) {
                    if (response.code == 200) {
                        $scope.allReviewList = response.data;
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
                userService.getTenantUSerReview().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.tenantReviewList = response.data;
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
                userService.getTenantUSerReview().post(postData, function (response) {
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
         * Here we are getting the default role id and others role ids in the system
         */
        $rootScope.masterRoleId = $localStorage.defaultRoleId;
        $scope.agent = roleId.agent;
        $scope.ownAgency = roleId.ownAgency;

        var image = ['http://placehold.it/600x400'];
        $scope.property.files = image;
        $scope.user = {
            roles: []
        };
        $scope.pagination = {
            current: 1
        };
        $scope.newArray2 = [];
        $scope.userData = {};
        $scope.propertyImage = baseUrl + '/property_image/';
        $scope.userImageUrl = baseUrl + '/user_image/';
        /**
         * Function is use to set edit profile setting nav-personnel data
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 17-Nov-2017
         */
        $scope.editProfile = function () {
            $scope.editAcive = "active";
            $scope.passwordAcive = " ";
            $scope.notificationAcive = " ";
            $scope.roleSettingActive = " ";
            $scope.userImageActive = " ";
            $scope.traderAvailability = " ";
            $scope.occupacy_section = " ";
            $scope.identification_section = " ";
            $scope.subscriptionActive = " ";
        }
        /**
             * Function is use to set edit profile setting nav-change Password
             * @access private
             * @return json
             * Created by
             * @smartData Enterprises (I) Ltd
             * Created Date 17-Nov-2017
         */
        $scope.changePassword = function () {
            $scope.passwordAcive = "active";
            $scope.notificationAcive = " ";
            $scope.editAcive = " ";
            $scope.roleSettingActive = " ";
            $scope.userImageActive = " ";
            $scope.traderAvailability = " ";
            $scope.occupacy_section = " ";
            $scope.identification_section = " ";
            $scope.subscriptionActive = " ";
        }
        /**
            * Function is use to set edit profile setting nav-change role
            * @access private
            * @return json
            * Created by getRol
            * @smartData Enterprises (I) Ltd
            * Created Date 17-Nov-2017
            */
        $scope.roleSetting = function () {
            $scope.passwordAcive = " ";
            $scope.notificationAcive = " ";
            $scope.editAcive = " ";
            $scope.roleSettingActive = "active";
            $scope.userImageActive = " ";
            $scope.traderAvailability = " ";
            $scope.occupacy_section = " ";
            $scope.identification_section = " ";
            $scope.subscriptionActive = " ";
        }
        $scope.userImageSetting = function () {
            $scope.passwordAcive = " ";
            $scope.notificationAcive = " ";
            $scope.editAcive = " ";
            $scope.roleSettingActive = "";
            $scope.userImageActive = "active";
            $scope.traderAvailability = " ";
            $scope.occupacy_section = " ";
            $scope.identification_section = " ";
            $scope.subscriptionActive = " ";
        }
        $scope.showtraderAvailability = function () {
            $scope.passwordAcive = " ";
            $scope.notificationAcive = " ";
            $scope.editAcive = " ";
            $scope.roleSettingActive = "";
            $scope.userImageActive = "";
            $scope.traderAvailability = "active";
            $scope.occupacy_section = " ";
            $scope.identification_section = " ";
            $scope.subscriptionActive = " ";
        }
        $scope.showOccupacySection = function () {
            $scope.passwordAcive = " ";
            $scope.notificationAcive = " ";
            $scope.editAcive = " ";
            $scope.roleSettingActive = "";
            $scope.userImageActive = "";
            $scope.traderAvailability = "";
            $scope.occupacy_section = "active";
            $scope.identification_section = " ";
            $scope.subscriptionActive = " ";
        }
        $scope.showIdentificationSection = function () {
            $scope.passwordAcive = " ";
            $scope.notificationAcive = " ";
            $scope.editAcive = " ";
            $scope.roleSettingActive = "";
            $scope.userImageActive = "";
            $scope.traderAvailability = "";
            $scope.occupacy_section = "";
            $scope.identification_section = "active";
            $scope.subscriptionActive = " ";
        }

        /**
         * Function is use to set edit profile setting nav-notification setting
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 17-Nov-2017
         */
        $scope.notificationActiveStatus = function () {
            $scope.notificationAcive = "active";
            $scope.passwordAcive = " ";
            $scope.editAcive = " ";
            $scope.roleSettingActive = " ";
            $scope.userImageActive = " ";
            $scope.traderAvailability = "";
            $scope.occupacy_section = "";
            $scope.identification_section = " ";
            $scope.subscriptionActive = " ";

        }

        $scope.subscriptionSection = function () {
            $scope.notificationAcive = " ";
            $scope.passwordAcive = " ";
            $scope.editAcive = " ";
            $scope.roleSettingActive = " ";
            $scope.userImageActive = " ";
            $scope.traderAvailability = "";
            $scope.occupacy_section = "";
            $scope.identification_section = " ";
            $scope.subscriptionActive = "active";
        }

        // $scope.traderAvailability = "active";
        $scope.getRoleList = function () {
            blockUI.start();
            $scope.roleList;
            var obj = {};
            obj.user_id = $localStorage.loggedInUserId;
            userService.getRoleList().get(function (response) {
                if (response.code == 200) {
                    $scope.roleList = response.data;
                    console.log('roleList ::  api => ', $scope.roleList);
                    userService.userRoles().post(obj, function (response) {
                        if (response.code == 200) {
                            $scope.userRole = response.data.finalArr;
                            if (roleId.runStrataManagementCompany == $scope.userRole[0]._id) {
                                $scope.view = false;
                            }
                            // $scope.roleList = _.difference($scope.roleList, $scope.userRole);
                            $scope.roleList = _.differenceBy($scope.roleList, $scope.userRole, '_id');
                            console.log('roleList :: differenceby => ', $scope.roleList);
                        }
                    });
                }
            });
            blockUI.stop();

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
            $scope.listView = false;
            $scope.grideView = true;
        };
        /**
         * Function is use to filter property
         * @access private
         * @return json
         * Created
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.sortText = '';
        $scope.filterBy = function (sortBy) {
            $scope.sortText = sortBy;
        }

        $scope.checkAll = function () {
            $scope.user.roles = $scope.roles.map(function (item) { return item.id; });
        };
        $scope.uncheckAll = function () {
            $scope.user.roles = [];
        };
        $scope.checkFirst = function () {
            $scope.user.roles.splice(0, $scope.user.roles.length);
            $scope.user.roles.push(1);
        };
        /**
     * Used to get user details & update local storage
     * Date:- 11-sep-2017
     * @smartData Enterprises (I) Ltd
     * @access private
     * @return json
     */
        $scope.agentPropertyCount = 0;
        $scope.getUserDetails = function () {
            $scope.stateList = austriliaState;
            $scope.allowaccessforSubscribe = true;
            $scope.isSubscriptionCanceled = false;
            $scope.view;
            $scope.traderView;
            $scope.roleChange;
            var role = $localStorage.role_id;
            if (role == roleId.agent || role == roleId.ownAgency || role == roleId.owner) {
                $scope.roleChange = true;
            }
            else {
                $scope.roleChange = false;
            }
            if ($localStorage.userLoggedIn == true) {
                $scope.imageUrl = baseUrl + '/user_image/';
                var userData = {
                    "userId": $localStorage.loggedInUserId,
                    "roleId": $localStorage.role_id
                }
                blockUI.start();

                if ($localStorage.role_id == roleId.ownAgency) {
                    $scope.view = false;
                } else {
                    $scope.view = true;
                }
                userService.getUserById().post(userData, function (response) {
                    if (response.code == 200) {
                        $localStorage.userData = response.data;
                        $localStorage.loggedInfirstname = response.data.firstname;
                        $localStorage.loggedInlastname = response.data.lastname;
                        $scope.userModel = response.data;

                        if ($scope.userModel.subscription_id) {
                            $scope.allowaccessforSubscribe = false;

                            if ($scope.userModel.is_subscription_cancelled) {
                                $scope.isSubscriptionCanceled = true;
                            }
                        }

                        if (!$scope.userModel.members) {
                            $scope.userModel.members = [];
                        }

                        if ($scope.userModel.availability && $scope.userModel.availability.option && ($scope.userModel.availability.option == '3' || $scope.userModel.availability.option == 3)) {
                            $scope.displayDaysOffOptions = true;
                        }

                        if ($scope.userModel.members && $scope.userModel.members.length > 0)
                            $scope.display_occupants_section1 = $scope.userModel.members.length;

                        if ($scope.userModel.vehicles && $scope.userModel.vehicles.length > 0)
                            $scope.display_vehicles_section1 = $scope.userModel.vehicles.length;

                        if ($scope.userModel.pets && $scope.userModel.pets.length > 0)
                            $scope.display_pets_section1 = $scope.userModel.pets.length;

                        if (!$scope.userModel.availability) {
                            $scope.userModel.availability = {};
                            $scope.userModel.availability.status = false;
                            $scope.userModel.availability.option = '0';
                        } else {
                            // console.log("$scope.userModel.availability.status   ", $scope.userModel.availability.status);
                            if ($scope.userModel.availability.status == 1)
                                $scope.userModel.availability.status = true;
                            else
                                $scope.userModel.availability.status = false;
                            var new_week_list = [];
                            angular.forEach($scope.weekdays_list, function (value, key) {
                                if ($scope.userModel.availability && $scope.userModel.availability.days && $scope.userModel.availability.days.indexOf(value.value) === -1)
                                    new_week_list.push({ name: value.name, value: value.value });
                                else
                                    new_week_list.push({ name: value.name, value: value.value, ticked: true });
                            });

                            if (new_week_list)
                                $scope.weekdays_list = new_week_list;

                            var new_week_list = [];
                            if ($scope.userModel.availability.days) {
                                $scope.userModel.availability.days.map(function (item) {
                                    new_week_list.push({ name: $scope.weekdays_list[item].name, value: item, ticked: true });
                                });
                                if (new_week_list)
                                    $scope.userModel.availability.days = new_week_list;
                            }
                        }
                        // console.log($scope.userModel.availability);
                        $scope.agentPropertyCount = $scope.userModel.images.length;
                        //console.log("$scope.userModel.images",$scope.userModel.images);
                        $scope.property = response.data;
                        //if (typeof ($scope.userModel.agency_id) != 'object') {
                        AgencyService.getAllAgencies().get(function (response) {
                            if (response.code == 200) {
                                $scope.agencyList = response.data;
                            } else {
                                $scope.agencyList = [];
                            }
                        });
                        blockUI.stop();
                        $scope.serviceList = [];
                        // }
                        if ($localStorage.role_id == roleId.trader) {
                            $scope.traderView = true;
                            userService.getServiceCategoryList().get(function (response) {
                                if (response.code == 200) {
                                    $scope.serviceList1 = response.data;
                                    if ($scope.serviceList1) {
                                        // console.log("i m indise.....")
                                        angular.forEach($scope.serviceList1, function (value, key) {
                                            if ($scope.userModel && $scope.userModel.categories_id && $scope.userModel.categories_id.indexOf(value._id) === -1)
                                                $scope.serviceList.push({ name: value.name, value: value._id, ticked: false });
                                            else
                                                $scope.serviceList.push({ name: value.name, value: value._id, ticked: true });
                                        });
                                        // console.log("$scope.serviceList   ", $scope.serviceList);
                                    }
                                } else {
                                    $scope.serviceList = [];
                                }
                            });
                        } else {
                            $scope.traderView = false;
                        }
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });

            }
        };

        /**
        * Used to update user details
        * Date:- 11-sep-2017
        * @smartData Enterprises (I) Ltd
        * @access private
        * @return json
        */

        $scope.updateUserProfile = function (updateData) {
            blockUI.start();
            $scope.loginLoading = true;
            //console.log("scope.user_edit_form.$invalid",$scope.user_edit_form.$invalid);
            if ($scope.user_edit_form.$invalid == false) {
                var userData = {
                    "userId": $localStorage.loggedInUserId,
                    "firstname": updateData.firstname,
                    "lastname": updateData.lastname,
                    "email": updateData.email,
                    "mobile_no": updateData.mobile_no,
                    "about_user": updateData.groups.about_user,
                    "country": country,
                    "state": updateData.state,
                    "zipCode": updateData.zipCode,
                    "city": updateData.city,
                    "roleId": $localStorage.role_id
                }
                var selectedIds = [];
                // console.log($scope.newArray2);
                if ($scope.newArray2) {
                    angular.forEach($scope.newArray2, function (value, key) {
                        selectedIds.push(value.value);
                    });
                    userData.categories_id = selectedIds;
                }

                if ($scope.userActiveRoleId == $scope.trader) {

                    if (updateData.suburb_postcode)
                        userData.suburb_postcode = updateData.suburb_postcode.toString();

                    if (updateData.suburb_postcode && updateData.suburb_postcode != '') {
                        if (updateData.location_latitude)
                            userData.location_latitude = parseFloat(updateData.location_latitude);
                        else
                            userData.location_latitude = 0;

                        if (updateData.location_longitude)
                            userData.location_longitude = parseFloat(updateData.location_longitude);
                        else
                            userData.location_longitude = 0;

                        if (updateData.location_administrative_area_level_1)
                            userData.location_administrative_area_level_1 = updateData.location_administrative_area_level_1.toString();
                        else
                            userData.location_administrative_area_level_1 = '';

                        if (updateData.location_country)
                            userData.location_country = updateData.location_country.toString();
                        else
                            userData.location_country = '';

                        if (updateData.location_postal_code)
                            userData.location_postal_code = updateData.location_postal_code.toString();
                        else
                            userData.location_postal_code = '';

                        if (updateData.location_locality)
                            userData.location_locality = updateData.location_locality.toString();
                        else
                            userData.location_locality = '';

                        if (updateData.location_street_number)
                            userData.location_street_number = updateData.location_street_number.toString();
                        else
                            userData.location_street_number = '';
                    } else {
                        userData.location_latitude = 0;
                        userData.location_longitude = 0;
                    }

                    if (updateData.business_name)
                        userData.business_name = updateData.business_name.toString();
                    else
                        userData.business_name = '';

                    if (updateData.abn_number)
                        userData.abn_number = updateData.abn_number.toString();
                    else
                        userData.abn_number = '';

                    if (updateData.rate)
                        userData.rate = (parseInt(updateData.rate) > 0) ? parseInt(updateData.rate) : 0;
                    else
                        userData.rate = 0;
                    console.log("updateData     ", updateData);
                }
                if ($scope.userActiveRoleId == $scope.ownAgency) {
                    userData.agency_id = updateData.agency_id
                }
                userService.updateUserProfile().post(userData, function (response) {
                    if (response.code == 200) {
                        toastr.success('Profile updated successfully');
                        $scope.loginLoading = false;

                    } else {

                        toastr.warning('Server Busy please try again latter.');
                        $scope.loginLoading = false;
                    }
                });
                blockUI.stop();
            } else {
                toastr.error('Please fill the form completely');
                $scope.loginLoading = false;
                blockUI.stop();
            }
        };
        /**
    * Used to upload user image
    * Date
    * @smartData Enterprises (I) Ltd
    * @access private
    * @return json
    */
        $scope.upload = function (files) {
            if (files && files.length) {
                blockUI.start();
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: baseUrl + '/api/updateUserPic',
                            data: {
                                _id: $localStorage.loggedInUserId,
                                file: file,
                            }
                        }).then(function (response) {
                            if (response.status == 200) {
                                toastr.success('Profile image is changed successfully');
                                $scope.getUserDetails();
                                blockUI.stop();
                            } else {
                                toastr.error($scope.errorMsg = response.message + ': missing field ' + response.paramName);
                                blockUI.stop();

                            }
                        }, null, function (evt) {
                            $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                        });
                    }
                }
            }
        };
        /**
         * Used to to update user password
         * Date
         * @smartData Enterprises (I) Ltd
         * @access private
         * @return json
         */
        $scope.account_setting = {};
        $scope.updatePassword = function (userPassword) {
            $scope.loginLoading = true;
            if (typeof userPassword != 'undefined' && (userPassword.hasOwnProperty('oldPassword') && userPassword.hasOwnProperty('newPassword') && userPassword.hasOwnProperty('confirmPassword')) && userPassword.oldPassword != "" && userPassword.newPassword != "" && userPassword.confirmPassword != '') {
                blockUI.start();
                if (userPassword.newPassword === userPassword.confirmPassword) {
                    var passwordData = {
                        "userId": $localStorage.loggedInUserId,
                        "oldPassword": userPassword.oldPassword,
                        "newPassword": userPassword.newPassword
                    };
                    if (userPassword.oldPassword == userPassword.confirmPassword) {
                        toastr.warning('Your current password & new password are same');
                        // $scope.userData.oldPassword = '';
                        $scope.userData.newPassword = '';
                        $scope.userData.confirmPassword = '';
                        // $scope.account_setting.oldpassword.$touched = false;
                        $scope.account_setting.password.$touched = false;
                        $scope.account_setting.confirmPassword.$touched = false;
                        $scope.loginLoading = false;
                        blockUI.stop();
                    } else {
                        userService.updateUserPassword().post(passwordData, function (response) {
                            if (response.code == 200) {
                                toastr.success('Password updated successfully');
                                PropertyService.userLogOut().post(passwordData, function (response) {
                                    if (response.code == 200) {
                                        $rootScope.isLoggedIn = false;
                                        toastr.success("Successfully sign out");
                                        $localStorage.userLoggedIn = false;
                                        $localStorage.loggedInUserId = '';
                                        $localStorage.loggedInfirstname = '';
                                        $localStorage.loggedInlastname = '';
                                        $localStorage.token = '';
                                        $localStorage.role_id = '';
                                        $localStorage.userData = ' ';
                                        $scope.loginLoading = false;
                                        $state.go('home');
                                    }
                                });
                                blockUI.stop();
                            } else if (response.code == 400) {
                                toastr.error('Please provide correct current password.');
                                $scope.userData.oldPassword = '';
                                $scope.userData.newPassword = '';
                                $scope.userData.confirmPassword = '';
                                $scope.account_setting.oldpassword.$touched = false;
                                $scope.account_setting.password.$touched = false;
                                $scope.account_setting.confirmPassword.$touched = false;
                                $scope.loginLoading = false;
                                blockUI.stop();

                            } else {
                                blockUI.stop();
                                $scope.userData.oldPassword = '';
                                $scope.userData.newPassword = '';
                                $scope.userData.confirmPassword = '';
                                $scope.account_setting.oldpassword.$touched = false;
                                $scope.account_setting.password.$touched = false;
                                $scope.account_setting.confirmPassword.$touched = false;
                                toastr.warning('Server Busy please try again latter.');
                                $scope.loginLoading = false;

                            }
                        });
                    }

                } else {
                    toastr.error('New Password & Confirm Password are not same.');
                    // $scope.userData.oldPassword = '';
                    $scope.userData.newPassword = '';
                    $scope.userData.confirmPassword = '';
                    // $scope.account_setting.oldpassword.$touched = false;
                    $scope.account_setting.password.$touched = false;
                    $scope.account_setting.confirmPassword.$touched = false;
                    $scope.loginLoading = false;
                    blockUI.stop();
                }
            } else {
                toastr.error("Please fill the form completely");
                $scope.loginLoading = false;

            }
        };
        /**
         * Used to cancel user edit
         * Date
         * @smartData Enterprises (I) Ltd
         * @access private
         * @return json
         */
        $scope.cancelUserEdit = function () {
            $state.go('dashboard');
        };
        /**
       * Used to get back to the account secirity section
       * Date
       * @smartData Enterprises (I) Ltd
       * @access private
       * @return json
       */
        $scope.cancelAccountSetting = function () {
            //toastr.success('Your password is not changed');
            var elmnt = document.getElementById("changepass");
            elmnt.scrollIntoView();
            $scope.userData.oldPassword = '';
            $scope.userData.newPassword = '';
            $scope.userData.confirmPassword = '';
            $scope.account_setting.oldpassword.$touched = false;
            $scope.account_setting.password.$touched = false;
            $scope.account_setting.confirmPassword.$touched = false;
        };
        /**
       * Used to get the notification status
       * Date
       * @smartData Enterprises (I) Ltd
       * @access private
       * @return json
       */
        $scope.notificationStatus = function (user) {
            var user = {};
            user.user_id = $localStorage.loggedInUserId;
            userService.getuserNotificationStatus().post(user, function (response) {
                if (response && response.data && response.data.status)
                    $scope.notification = response.data.status;
            });

        }

        /**
         * Used to change notification stauts
         * Date
         * @smartData Enterprises (I) Ltd
         * @access private
         * @return json
         */
        $scope.changeNotification = function (status) {
            $scope.notifiStatus = true;
            $scope.class = 'disable';
            blockUI.start();
            var user = {};
            user.user_id = $localStorage.loggedInUserId;
            user.status = status;
            userService.saveUserNotificationStatus().post(user, function (response) {
                if (response.code == 200) {
                    if (user.status == true) {
                        toastr.success('Successfully enabled notification alerts');
                    } else {
                        toastr.success('Successfully disabled notification alerts');
                    }
                    blockUI.stop();
                    setTimeout(function () {
                        $scope.notifiStatus = false; $scope.class = '';
                    }, 5000);
                } else {
                    toastr.warning('Server is busy, try after some time');
                    blockUI.stop();
                    setTimeout(function () { $scope.notifiStatus = false; $scope.class = ''; }, 6000);

                }
            });

        }
        /**
         * Used to save new user role
         * Date
         * @smartData Enterprises (I) Ltd
         * @access private
         * @return json
         */
        $scope.saveUserRoles = function (roles) {
            blockUI.start();
            var obj = {};
            obj.user_id = $localStorage.loggedInUserId;
            obj.roles = roles;
            if (roles && roles.length > 0) {
                userService.saveRoles().post(obj, function (response) {
                    if (response.code == 200) {
                        toastr.success('Successfully added roles');
                        $scope.user = [];
                        $scope.getRoleList();
                        //document.body.scrollTop = document.documentElement.scrollTop = 0;
                        var elmnt = document.getElementById("rolesetting");
                        elmnt.scrollIntoView();
                        blockUI.stop();
                    } else {
                        toastr.warning('Server is busy, try after some time');
                        blockUI.stop();
                    }
                });
            } else {
                toastr.warning('Already these roles are associated with your account');
                blockUI.stop();
            }
            blockUI.stop();

        }
        /**
         * Used to get user details & update local storage
         * Date:- 11-sep-2017
         * @smartData Enterprises (I) Ltd
         * @access private
         * @return json
         */
        $scope.propertyList = [];
        $scope.propertyCount = 0;
        $scope.agentAgencyId;
        $scope.isReviewedAllowed = false;
        $scope.getUserInfo = function () {
            $scope.viewEditBanner;
            $scope.imageUrl = baseUrl + '/user_image/';
            var obj = {
                "user_id": ($stateParams.id) ? $stateParams.id : $localStorage.loggedInUserId
            }

            if ($localStorage.role_id == roleId.agent || $localStorage.role_id == roleId.owner || $localStorage.role_id == roleId.tenant || $localStorage.role_id == roleId.trader || $localStorage.role_id == roleId.ownAgency) {
                obj.role_id = roleId.ownAgency;
            } else {
                obj.role_id = roleId.runStrataManagementCompany;
            }


            if ($stateParams.id == $localStorage.loggedInUserId) {
                $scope.viewEditBanner = true;
            } else {
                $scope.viewEditBanner = false;
            }
            blockUI.start();
            userService.agentProfileData().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.userInfo = response.data[0];
                    $scope.name = response.data[0]['firstname'];
                    $scope.propertyCount = response.data[1].value;
                    if ($scope.userInfo.agency_id) {
                        // var id = ($scope.userInfo.agency_id.principle_id._id) ? $scope.userInfo.agency_id.principle_id._id : $scope.userInfo.agency_id.principle_id;
                        var id = ($scope.userInfo.agency_id.principle_id._id) ? $scope.userInfo.agency_id.principle_id._id : ($scope.userInfo.agency_id.principle_id && $scope.userInfo.agency_id.principle_id[0] && $scope.userInfo.agency_id.principle_id[0].agency_id) ? $scope.userInfo.agency_id.principle_id[0].agency_id : '';

                        $scope.agentAgencyId = id;

                        $scope.getAgencyReview(id);
                        var agentObj = {
                            "agency_id": $scope.agentAgencyId,
                            "request_by_role": roleId.agent,
                            "user_id": $stateParams.id
                        }
                        // service to call property listing of this agent
                        PropertyService.getPropertyListing().post(agentObj, function (response) {
                            if (response.code == 200) {
                                $scope.propertyList1 = response.data;
                                if ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id && response.data.agency_id == $localStorage.userData.agency_id._id) {
                                    $scope.isReviewedAllowed = true;
                                }
                                $scope.propertyList = _.reject($scope.propertyList1, function (obj) {
                                    return obj.save_as_draft === true;
                                });
                            }
                        });
                    }
                    blockUI.stop();
                } else {
                    blockUI.stop();
                }
            });
        };
        $scope.uploadUserImages = function (userData) {
            blockUI.start();
            $scope.loginLoading = true;
            var filesLength = (userData.files) ? userData.files.length : 0;
            var imageLength = (userData.images) ? userData.images.length : 0;
            if (($scope.agentPropertyCount > imageLength || $scope.agentPropertyCount < imageLength && $scope.agentPropertyCount != imageLength) || filesLength > 0) {

                var obj = {};
                obj.user_id = $localStorage.loggedInUserId;
                obj.images = userData.images;
                if (imageLength > 0 && filesLength == 0) {
                    userService.updateAgentExistingPropertyImg().post(obj, function (response) {
                        if (response.code == 200) {
                            toastr.success('Successfully uploaded images');
                        }
                        //$scope.loginLoading = false;
                    });
                }
                else if (filesLength > 0 && imageLength == 0) {
                    var user_id = $localStorage.loggedInUserId;
                    $scope.upload(userData, user_id);
                    //$scope.loginLoading = false;
                }
                else if (filesLength > 0 && userData.files[0] != 'http://placehold.it/600x400' || imageLength > 0) {
                    var user_id = $localStorage.loggedInUserId;
                    userService.updateAgentExistingPropertyImg().post(obj, function (response) {
                        if (response.code == 200) {
                            // toastr.success('Successfully uploaded images');
                            $scope.upload(userData, user_id);
                        }
                        //$scope.loginLoading = false;
                    });
                }
                $scope.loginLoading = false;
                blockUI.stop();
            } else {
                toastr.warning('Please select image using browse button before uploading');
                $scope.loginLoading = false;
                blockUI.stop();
            }
        }

        /**
         * Function is use to upload on file either on select or drop
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 3-Aug-2017
         */
        $scope.fileProgress = 0;
        $scope.upload = function (files, data) {
            if (files.files && files.files.length) {
                blockUI.start();
                for (var i = 0; i < files.files.length; i++) {
                    var file = files.files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: baseUrl + '/api/uploadAgentImages',
                            data: {
                                _id: data,
                                file: file,
                            }
                        }).then(function (response) {
                            if (response && response.status == 200) {
                                toastr.success(response.data.message);
                                blockUI.stop();
                            } else if (response.data.code == 400) {
                                toastr.error(response.data.message);
                                blockUI.stop();
                            }
                        }, null, function (evt) {
                            //$scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                        });
                    }
                }
            }
        };

        $scope.uploadUserSingleImage = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: baseUrl + '/api/updateUserPic',
                            data: {
                                _id: $localStorage.loggedInUserId,
                                file: file,
                            }
                        }).then(function (response) {
                            if (response.data.code == 200) {
                                toastr.success('Profile image is changed successfully');
                                //$scope.getUserDetails();
                                $scope.userModel.image = response.data.data.image;
                                $rootScope.image = $scope.userModel.image;
                                $localStorage.userData.image = $scope.userModel.image;
                                $scope.property.files = [];

                            } else {
                                toastr.error('File format you have uploaded is not supported.Upload only (jpg,png,gif) extension file');
                            }
                        }, null, function (evt) {
                            $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                        });
                    }
                }
            }
        };
        /**
        * Used to get agent review
        * Date
        * @smartData Enterprises (I) Ltd
        * @access private
        * @return json
        */
        $scope.getAgentReview = function () {
            $scope.id = $stateParams.id;
            // console.log("hello   ", $scope.id);
            var agent_id_ = $scope.id;
            $scope.createdByRate = {};
            PropertyService.getReviewForUser(agent_id_).get(function (response) {
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
          * Used to get agency review
          * Date
          * @smartData Enterprises (I) Ltd
          * @access private
          * @return json
          */
        $scope.getAgencyReview = function (id) {
            // console.log(id,"id@@@@@@@@");
            $scope.id = id;
            $scope.agencyRate = {};
            var agent_id_ = id;
            PropertyService.getReviewForUser(agent_id_).get(function (response) {
                if (response.code == 200) {
                    $scope.agencyRate = response;
                    $scope.agencyRate.data = ($scope.agencyRate.data > 0) ? $scope.agencyRate.data : 0;
                    $scope.agencyRate.total_review = ($scope.agencyRate.total_review) ? $scope.agencyRate.total_review : 0;
                } else {
                    $scope.agencyRate.data = 0;
                    $scope.agencyRate.total_review = 0;
                }
            });

        };
        /**
         * Used to associate with the agency
         * Date
         * @smartData Enterprises (I) Ltd
         * @access private
         * @return json
         */
        $scope.associateAgency = function (data) {
            // console.log("data",data);
            if (typeof data != 'undefined') {
                var obj1 = {};
                // obj1 = JSON.parse(data);
                obj1 = data;
                var obj = {};
                obj.sender_id = $localStorage.userData._id;
                // obj.receiver_id = $scope.agencyList[data]._id;
                // obj.agencyName = $scope.agencyList[data].name;
                obj.receiver_id = data._id;
                obj.agencyName = data.name;
                // console.log("Obj",obj);
                obj.userName = $localStorage.userData.firstname + " " + $localStorage.userData.lastname;
                swal({
                    title: "Are you sure to sent agency association request to " + obj.agencyName + "?",
                    text: "once you are associated with the agency you cannot change it",
                    showCancelButton: true,
                    closeOnConfirm: true,
                    // imageUrl: '/assets/images/logo_color_blue.png',
                    imageUrl: '/assets/images/logo-dark.png',
                    imageWidth: 10,
                    imageHeight: 10,
                    maxHeight: 45,
                    confirmButtonColor: '#09f',
                    cancelButtonColor: '#09f',
                    imageAlt: 'Custom image',
                    showLoaderOnConfirm: true
                }, function () {
                    userService.userAssociationWithAgency().post(obj, function (response) {
                        blockUI.start()
                        if (response.code == 200) {
                            $rootScope.isAssociatedWithAgency = true;
                            $localStorage.userData.agency_id = (response.data._id) ? response.data._id : '';
                            // console.log("response", response);
                            toastr.success('Successfully sent request to agency');
                            $state.go('dashboard');
                            blockUI.stop();
                        } else {
                            blockUI.stop();
                            toastr.warning('Server is busy try after some time');

                        }
                    });
                });
            } else {
                toastr.warning('First associate yourself with one of the agency then send the request');
            }
        }
        /**
     * Function is to upload banner image
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */

        /**
         * Function is used to remove images
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.RemovePhoto = function (index) {
            //Find the record using Index from Array.
            var name = $scope.property.files[index];
            $scope.property.files.splice(index, 1);
            if ($scope.property.files.length == 0) {
                $scope.property.files = [];
            }
        };
        $scope.choosenFiles = [];
        $scope.RemovePhotoFromMyFiles = function (index) {
            //Find the record using Index from Array.
            var name = $scope.choosenFiles[index];
            $scope.choosenFiles.splice(index, 1);
            $scope.property.images.splice(index, 1);
            //console.log('property.files',$scope.property.files);
            // if ($scope.choosenFiles.length == 0) {
            //     $scope.choosenFiles = [];
            //     $scope.property.images = [];
            // }
        };

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
        * Created Date
        */
        $scope.openAgentSendMessage = function (id) {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/tenants/views/sendMessage.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
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
                        userService.sendMessage().post(obj, function (response) {
                            if (response.code == 200) {
                                toastr.success('Successfully sent message to agent');
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
                templateUrl: '/frontend/modules/users/views/addReview.html',
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
                        userService.addReview().post(postData, function (response) {
                            if (response.code == 200) {
                                toastr.success('Review added successfully');
                                $scope.getAgentReview();
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
                        userService.getReviewForUser(agentId).get(function (response) {
                            if (response.code == 200) {
                                $scope.outOFReviewer = response.total_review;
                                $scope.userRate = (response.data > 0) ? response.data : 0;
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
        $scope.showLogo = function (agencyKey) {
            // $scope.agencyImage = $scope.agencyList[agencyKey].logoImage;
            $scope.agencyImage = agencyKey.logoImage; // ui-select
            // console.log("agencyKey",agencyKey);

        }

        $scope.submitReview = function (response, review_id, section_name) {

            if (response && response != '' && response.length > 5) {
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
                        $scope.getAgentReview();
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
            } else {
                toastr.warning('Reply should be greater than 5 Characters.');
                $scope.loginLoading = false;
                blockUI.stop();
            }
        }

        $scope.myImage = '';
        $scope.myCroppedImage = '';
        $scope.dicssmissCromPopup = 0;

        $scope.openCropImage = function (event) {

            console.log("files", event);
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/users/views/crop_image.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.checkimage = false;
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

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
                            // console.log("myCroppedImage        ", myCroppedImage);
                            var selected_image_width = this.width;
                            var selected_image_height = this.height;

                            console.log(parseInt(selected_image_width) + " ============== " + parseInt(selected_image_height));

                            if (parseInt(selected_image_width) >= 400 && parseInt(selected_image_height) >= 400) {
                                // console.log("insize");
                                $scope.checkimage = true;
                            } else {
                                $scope.myCroppedImage = '';
                                $scope.myImage = '';
                                toastr.error('Image must be atleast 400px x 400px in size.');
                                $uibModalInstance.dismiss('cancel');
                            }
                        };
                        if ($scope.checkimage) {
                            toastr.error('Image must be with an extention of .jpg and .png only.');
                            $uibModalInstance.dismiss('cancel');
                        }
                    };

                    reader.readAsDataURL(file);

                    $scope.upload_crop_image = function (img) {
                        $scope.myCroppedImage = img;
                        // Call API and pass base64 data
                        var data = {
                            _id: $localStorage.loggedInUserId,
                            file: $scope.myCroppedImage
                        };
                        userService.updateAvatarPic().post(data, function (response) {
                            if (response.code == 200) {
                                // console.log("it goes Here");
                                $uibModalInstance.dismiss('cancel');
                                toastr.success('Profile image is changed successfully.');
                                $scope.getUserDetails();
                                // $scope.userModel.image = response.data.data.image;
                                $rootScope.image = $scope.userModel.image;
                                $localStorage.userData.image = $scope.userModel.image;
                                $scope.property.files = [];

                            } else {
                                toastr.error('File format you have uploaded is not supported.Upload only (jpg,png) extension file');
                                $uibModalInstance.dismiss('cancel');
                            }
                        });
                    }

                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
        };

        // $scope.upload_crop_image = function (img) {
        //     blockUI.start();
        //     $scope.myCroppedImage = img;
        //     // Call API and pass base64 data
        //     var data = {
        //         _id: $localStorage.loggedInUserId,
        //         file: $scope.myCroppedImage
        //     };
        //     userService.updateAvatarPic().post(data, function (response) {
        //         if (response.code == 200) {
        //             toastr.success('Profile image is changed successfully');
        //             $scope.getUserDetails();
        //             $scope.userModel.image = response.data.data.image;
        //             $rootScope.image = $scope.userModel.image;
        //             $localStorage.userData.image = $scope.userModel.image;
        //             $scope.property.files = [];
        //             $scope.cancel();
        //             blockUI.stop();
        //         } else {
        //             toastr.error('File format you have uploaded is not supported.Upload only (jpg,png) extension file');
        //             blockUI.stop();
        //         }
        //     });
        //     blockUI.stop();
        // }


        $scope.file_upload_change = function (evt) {

            var file = evt.currentTarget.files[0];
            // console.log("file ==== ", file);
            var reader = new FileReader();
            var image1 = new Image();
            reader.onload = function (evt) {
                // console.log("changing myImage: ", evt.target.result);
                // $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
                // });
                image1.src = $scope.myImage;

                image1.onload = function () {
                    $scope.checkimage = true;
                    var selected_image_width = this.width;
                    var selected_image_height = this.height;
                    if (selected_image_width >= 400 && selected_image_height >= 400) {

                    } else {
                        $scope.myCroppedImage = '';
                        $scope.myImage = '';
                        toastr.error('Image must be atleast 400px x 400px with an extention of .jpg and .png only.');
                        $uibModal.open();
                    }
                    // console.log("hello :   ", this.width + "  " + this.height);
                };
                if ($scope.checkimage == false) {
                    toastr.error('Image must be with an extention of .jpg and .png only.');
                    $uibModal.open();
                }

            };
            reader.readAsDataURL(file);
            // console.log("File read");
        }

        $scope.updateAvailability = function () {

            blockUI.start();
            var status = $scope.userModel.availability.status;
            var option = $scope.userModel.availability.option;
            var days = $scope.userModel.availability.days;

            // if (status) {
            $scope.loginLoading = true;

            if (status == true && (option == 3 || option == '3') && days) {
                var selectedIds = [];
                angular.forEach(days, function (value, key) {
                    if (value.value)
                        selectedIds.push(value.value.toString());
                });
            } else {
                days = [];
            }

            var data = {
                status: parseInt((status == true) ? '1' : '2'),
                option: parseInt(option) >= 0 ? parseInt(option) : 0,
                user_id: $localStorage.loggedInUserId
            }
            console.log("Option    ", data);
            if (status == true && (option == 3 || option == '3') && days && selectedIds)
                data.days = selectedIds;

            userService.updateAvailability().post(data, function (response) {
                if (response.code == 200) {
                    $scope.getUserDetails();
                    toastr.success('Availability updated successfully');
                    $scope.loginLoading = false;

                } else {
                    toastr.error('Availability not updated.');
                }
                blockUI.stop();
            });
            // } else {
            //     toastr.error('Please fill the form completely');
            //     $scope.loginLoading = false;
            //     blockUI.stop();
            // }
        }

        $scope.getAvailOption = function (key) {
            if (key == '3' || key == 3)
                $scope.displayDaysOffOptions = true;
            else
                $scope.displayDaysOffOptions = false;
        }

        $scope.updateMembers = function () {

            if ($scope.occupacy_form.$invalid == false) {
                blockUI.start();
                $scope.loginLoading = true;

                var data = {
                    user_id: $localStorage.loggedInUserId
                }

                if ($scope.userModel.members) {
                    if ($scope.display_occupants_section1 < $scope.userModel.members.length) {
                        $scope.userModel.members = $scope.userModel.members.slice(0, $scope.display_occupants_section1);
                    }
                    data.members = $scope.userModel.members;
                }

                if ($scope.userModel.vehicles) {
                    if ($scope.display_vehicles_section1 < $scope.userModel.vehicles.length) {
                        $scope.userModel.vehicles = $scope.userModel.vehicles.slice(0, $scope.display_vehicles_section1);
                    }
                    data.vehicles = $scope.userModel.vehicles;
                }

                if ($scope.userModel.pets) {
                    if ($scope.display_pets_section1 < $scope.userModel.pets.length) {
                        $scope.userModel.pets = $scope.userModel.pets.slice(0, $scope.display_pets_section1);
                    }
                    data.pets = $scope.userModel.pets;
                }
                if (data.members || data.vehicles || data.pets) {
                    userService.updateOccupacy().post(data, function (response) {
                        if (response.code == 200) {
                            toastr.success('Occupacy updated successfully.');
                            $scope.loginLoading = false;
                        } else {
                            toastr.error('Occupacy not updated.');
                        }
                        blockUI.stop();
                    });
                } else {
                    toastr.error('Occupacy not updated.');
                    blockUI.stop();
                }
            } else {
                toastr.error('Please fill the form completely');
                $scope.loginLoading = false;
                blockUI.stop();
            }
        }

        /**
        * multiple file upload
        * **/
        var uploader = $scope.uploader = new FileUploader({
            url: baseUrl + '/api/uploadIdentificationDocumentsFiles',
            headers: { authorization: $localStorage.token },
            formData: [{ 'created_by': $localStorage.loggedInUserId }]
        });

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        };
        uploader.onAfterAddingFile = function (fileItem) {
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            $scope.uploader.uploadAll()
        };
        uploader.onBeforeUploadItem = function (item) {
        };
        uploader.onProgressItem = function (fileItem, progress) {
        };
        uploader.onProgressAll = function (progress) {
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            toastr.error("Some error occured please try again latter");
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            toastr.success("Successfully cancelled this file from uploading");
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
        };
        uploader.onCompleteAll = function () {
            toastr.success("Successfully uploaded all files");
            $scope.getDocumentList();
            $uibModalInstance.dismiss('cancel');
        };

        /**
         * function is used to delete the document
         * created on 4-1-2019
         *
         */
        $scope.deleteDocument = function (documentId, index) {
            $scope.filePopup[index] = ($scope.filePopup[index] == false) ? true : false;
            if (documentId) {
                var userId = $localStorage.loggedInUserId;
                var obj = {
                    "created_by": userId,
                    "_id": documentId
                };
                swal({
                    title: "Are you sure?",
                    text: "You want to Delete the file?",
                    // imageUrl: '/assets/images/logo1.png',
                    imageUrl: '/assets/images/logo-dark.png',
                    imageWidth: 10,
                    imageHeight: 10,
                    maxHeight: 45,
                    showCancelButton: true,
                    // confirmButtonColor: "#0099ff",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    imageAlt: 'Custom image',
                    closeOnConfirm: true
                }, function () {
                    userService.deleteDocument().post(obj, function (response) {
                        if (response.code == 200) {
                            $scope.documentList = [];
                            $scope.getDocumentList();

                            toastr.success(response.message);
                            blockUI.stop();
                        } else {
                            toastr.error(response.message);
                            blockUI.stop();
                        }
                    });
                });
            }
        }

        /**
         * Function is use to show document list
         * @access private
         * @return json
         * Created
         * Narola Infortech - KEK
         * Created Date 4-1-2019
         */
        $scope.getDocumentList = function () {
            blockUI.start();
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            var userId = $localStorage.loggedInUserId;
            if (userId) {
                var obj = {
                    "created_by": userId
                };
                userService.getDocumentList().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.documentList = response.data;
                        angular.forEach($scope.documentList, function (value, key) {
                            if ((value.document_path).includes(".xlsx") || (value.document_path).includes(".xlsx")) {
                                value.document_type = "excel";
                            }
                            else if ((value.document_path).includes(".txt") || (value.document_path).includes(".doc")) {
                                value.document_type = "doc";
                            } else if ((value.document_path).includes(".pdf")) {
                                value.document_type = "pdf";
                            } else if ((value.document_path).includes(".ppt")) {
                                value.document_type = "ppt";
                            }
                        });

                        blockUI.stop();
                    } else {
                        $scope.documentList = [];
                        blockUI.stop();
                    }
                });
            }
        }

        /**
         * Function is used to view image
         * @access private
         * @return json
         * Created by
         * @sNarola Infortech - KEK
         * Created Date : 4-1-2019
         */
        $scope.openImages = function (document) {
            var modalInstance;
            $scope.path = document.document_path;
            $scope.document = document;
            modalInstance = $uibModal.open({
                templateUrl: '/frontend/modules/users/views/file_details.html',
                controller: "UserCtrl",
                scope: $scope
            });
            $scope.cancel = function () {
                modalInstance.dismiss('cancel');
            };
        }

        $scope.updateDocumentationStatus = function (status) {
            blockUI.start();
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            var userId = $localStorage.loggedInUserId;
            if (userId) {
                var obj = {
                    "user_id": userId,
                    "documentation_status": status
                };
                userService.updateDocumentationStatus().post(obj, function (response) {
                    if (response.code == 200) {
                        blockUI.stop();
                        toastr.success("Changes saved successfully.");
                    } else {
                        blockUI.stop();
                        toastr.error("Some error occured please try again latter");
                    }
                });
            }
        }

        $scope.displayAddOccupantSection = function () {
            $scope.display_occupants_section1 = $scope.display_occupants_section;
        }

        $scope.displayAddVehicleSection = function () {
            $scope.display_vehicles_section1 = $scope.display_vehicles_section;
        }

        $scope.displayAddPetsSection = function () {
            $scope.display_pets_section1 = $scope.display_pets_section;
        }

        $scope.show_full_number = function () {
            $scope.display_less_number = false;
            var user_id = $localStorage.loggedInUserId;
            var postData = {
                "user_id": $stateParams.id,
                "reveal_contact_number": 1
            }
            userService.updateRevealContactNumber().post(postData, function (response) {
                if (response.code == 200) {

                }
            });
        }

        $scope.onSubmit = function () {
            blockUI.start();
        };

        $scope.hideAlerts = function () {
            $scope.stripeError = null;
            $scope.stripeToken = null;
        }

        // $scope.do_update_credit_card = function () {

        //     console.log("do update creadit Card.....");
        //     // subscribeModel.
        // }

        $scope.do_update_credit_card = {
            submit: function () {
                console.log("do update creadit Card.....");
            }
        }

        $scope.cancelSubscription = function (subscription_id, customer_id) {
            if (subscription_id) {
                var userId = $localStorage.loggedInUserId;
                var obj = { "subscription_id": subscription_id, "customer_id": customer_id };
                swal({
                    title: "",
                    text: "Would you like to cancel your subscription?",
                    // imageUrl: '/assets/images/logo1.png',
                    imageUrl: '/assets/images/logo-dark.png',
                    imageWidth: 10,
                    imageHeight: 10,
                    maxHeight: 45,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    imageAlt: 'Custom image',
                    closeOnConfirm: true
                }, function () {
                    userService.cancelSubscription().post(obj, function (response) {
                        if (response.code == 200) {
                            $scope.getUserDetails();
                            toastr.success(response.message);
                            blockUI.stop();
                        } else {
                            toastr.error(response.message);
                            blockUI.stop();
                        }
                    });
                });
            }
        }

        $scope.createSubscription = function () {

            if ($scope.subscription_create && $scope.subscription_create == 'OK') {
                $scope.getUserDetails();
                toastr.success('Subscription created successfully.');
                blockUI.stop();
            } else if ($scope.subscription_create && $scope.subscription_create != '') {
                toastr.error('Not Updated Details. Please try again later.');
                blockUI.stop();
            }

        }
        $scope.updateSubscription = function () {
            if ($scope.subscription_update && $scope.subscription_update == 'OK') {
                $scope.getUserDetails();
                toastr.success('Card Details updated successfully.');
                blockUI.stop();
            } else if ($scope.subscription_update && $scope.subscription_update != '') {
                toastr.error('Not Updated Details. Please try again later.');
                blockUI.stop();
            }
        }

        $scope.addressInitialize = function () {
            $scope.userModel.location_latitude = parseFloat(angular.element("#latitude").val());
            $scope.userModel.location_longitude = parseFloat(angular.element("#longitude").val());
            $scope.userModel.location_administrative_area_level_1 = angular.element("#administrative_area_level_1").val();
            $scope.userModel.location_country = angular.element("#country").val();
            $scope.userModel.location_postal_code = angular.element("#postal_code").val();
            $scope.userModel.location_locality = angular.element("#locality").val();
            $scope.userModel.location_street_number = angular.element("#street_number").val();

            console.log($scope.userModel.location_latitude, "    ", $scope.userModel.location_longitude, "   ", $scope.userModel.location_administrative_area_level_1);
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

                    $scope.size = 'small';
                    $scope.type = 'circle';
                    $scope.imageDataURI = '';
                    $scope.resImageDataURI = '';
                    $scope.resBlob = {};
                    $scope.urlBlob = {};
                    $scope.resImgFormat = 'image/jpeg';


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
                                    $scope.getUserInfo();
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
