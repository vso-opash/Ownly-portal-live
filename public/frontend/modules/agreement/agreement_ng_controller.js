/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 */
(function () {
    angular.module('SYNC',
        // ['ui.select', 'ui-select-infinity']
    )
        .controller("AgreementCtrl", AgreementCtrl);
    AgreementCtrl.$inject = [
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
        '$anchorScroll',
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
        'FileUploader',
        'agreementService',
        'socket',
        'TenantService',
        'maintainService',
        'userService',
        'PropertyService'
    ];

    function AgreementCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $anchorScroll, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AlertService, toastr, blockUI, blockUIConfig, $anchorScroll, FileUploader, agreementService, socket, TenantService, maintainService, userService, PropertyService) {
        // console.log("Agreement Controllll");
        $scope.pagination = {
            current: 1
        };
        $scope.isSearchedAgreement = false;
        $scope.searchAgree = {};
        // $scope.ownerData = {};
        $scope.agreementFileImageUrl = baseUrl + '/document/';
        $scope.bondError = false;
        $scope.maxBondPrice;
        $scope.filterMatch = 'By best match';
        $scope.$emit('$tinymce:refresh');
        $scope.isAgency = ($localStorage.role_id == roleId.ownAgency) ? true : false;
        $scope.isAgentAgencyOwner = ($localStorage.role_id == roleId.agent || $localStorage.role_id == roleId.owner || $localStorage.role_id == roleId.ownAgency) ? true : false;
        $scope.owner = {};
        $scope.filePopup = [false];
        $scope.propertyImageUrl = baseUrl + '/property_image/';
        $scope.userImageUrl = baseUrl + '/user_image/';
        $scope.agreementImageUrl = baseUrl + '/agreement/';
        $scope.maintenanceImageUrl = baseUrl + '/maintenance/';
        $scope.newArray2 = [];
        $scope.loggedUser = $localStorage.loggedInUserId;
        $scope.dateStatus;
        $scope.roles = roleId;
        $scope.userCurrentRold = $localStorage.role_id;
        $scope.userData = $localStorage.userData;
        $scope.agreement = {};
        // $scope.agreement.tenants = [];
        // $scope.agreement.water_usage = false;
        // $scope.agreement.strata_by_laws = false;
        $scope.tenantList = [];
        $scope.myAgentsList = [];
        $scope.todayDate = new moment().format('YYY-MM-DD');
        $scope.baseUrl = baseUrl;
        $scope.loggedInUserId = $localStorage.loggedInUserId;
        $scope.isAgencyUser = false;
        $scope.agreementDetail = ''
        $scope.maintenance = {};
        $scope.isTenant = ($localStorage.role_id == roleId.tenant) ? true : false;
        //tiny mce options configuration
        $scope.tinymceOptions = {
            resize: false,
            menubar: false,
            toolbar: " undo redo | styleselect | bold italic | alignleft aligncenter      alignright alignjustify | bullist numlist outdent indent"
        };
        $scope.reInitializeTinymce = function () {
            $scope.tinymceOptions = {
                resize: false,
                menubar: false,
                toolbar: " undo redo | styleselect | bold italic | alignleft aligncenter      alignright alignjustify | bullist numlist outdent indent"
            };
        };

        $scope.addressInitialize = function () {
            $scope.agreement.location_latitude = parseFloat(angular.element("#latitude").val());
            $scope.agreement.location_longitude = parseFloat(angular.element("#longitude").val());
        }

        /**
        * Function is to check date validation
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        // $scope.checkDueDate = function (date) {
        //     var toDay = moment().format('YYYY MM DD');
        //     var date = moment(date).format('YYYY MM DD')
        //     if (date < toDay) {
        //         $scope.dateStatus = true;
        //     } else {
        //         $scope.dateStatus = false;
        //     }
        // };
        /**
 * Function is to be called on page click
 * @access private
 * @return json
 * Created 
 * @smartData Enterprises (I) Ltd
 * Created Date 22-Nov-2017
 */
        $scope.pageChanged = function (page) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        /**
         * Function is to go to the add agreement page
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.addAgreement = function () {
            blockUI.start();
            var role = $localStorage.role_id;
            console.log('role == roleId.agent => ', role == roleId.agent);
            if (role == roleId.agent || role == roleId.owner || role == roleId.ownAgency) {
                if ($localStorage.userData.agency_id) {
                    $rootScope.navBarOptionSelected = 'Agreements';
                    $localStorage.userData.routeState = 'Agreements';
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                    $state.go('addAgreement');
                    blockUI.stop();
                } else {
                    toastr.error('You are not associated with any agency to create agreement ');
                    blockUI.stop();
                }

            } else {
                toastr.warning("You do not have access permission");
                blockUI.stop();
            }

        };
        /**
* Function is add greement init function
* @access private
* @return json
* Created 
* @smartData Enterprises (I) Ltd
* Created Date 22-Nov-2017
*/
        $scope.addAgreementInit = function () {
            blockUI.start();
            var role = $localStorage.role_id;
            if (role == roleId.agent || role == roleId.owner || role == roleId.ownAgency) {
                if ($localStorage.userData.agency_id) {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                    blockUI.stop();
                } else {
                    toastr.error('You are not associated with any agency to create agreement');
                    $state.go('dashboard');
                    blockUI.stop();
                }
            } else {
                toastr.warning("You do not have access permission");
                $state.go('dashboard');
                blockUI.stop();
            }
        }

        /**
         * Function is to get tenant listing in add maintenance page
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.capitalizeName = function (name) {
            return name.replace(/\b(\w)/g, s => s.toUpperCase());
        }
        $scope.getTenants = function (id) {
            blockUI.start();
            $scope.noTenant = false;
            // var id = JSON.parse($scope.agreement.property_id);

            var id = $scope.agreement.property_id;
            var obj = {};
            // if ($localStorage.role_id == roleId.agent && $localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                obj.id = id._id;
                agreementService.getTenantForAgreement().get(obj, function (response) {
                    if (response.code == 200) {
                        $scope.data = response.data;
                        // $scope.tenantList = [];
                        if ($scope.data.length > 0) {
                            angular.forEach($scope.data, function (value, key) {
                                var obj1 = [];
                                obj1 = _.values(_.pick(value, 'invited_to'));
                                // console.log(obj1, "obj1");
                                // console.log("_.isNull(null);",obj1[0]!=null);
                                // if (obj1 && obj1[0] != null) {
                                //     var fullname = obj1[0].firstname + " " + obj1[0].lastname;
                                //     var editedEmail = "(" + obj1[0].email + ")";
                                //     // obj1[0] = _.extend(obj1[0], { fullName: $scope.capitalizeName(fullname)});
                                //     obj1[0] = _.extend(obj1[0], { fullName: $scope.capitalizeName(fullname) + "-" + editedEmail });
                                //     $scope.tenantList[key] = obj1[0];
                                // }

                            });
                        } else {
                            $scope.tenantList = [];
                            $scope.noTenant = true;
                        }
                        blockUI.stop();
                    } else {
                        $scope.tenantList = [];
                        $scope.noTenant = true;
                        blockUI.stop();
                    }
                });
            }
            blockUI.stop();
        };
        /**
         * Function is to get property of a particular agency
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.getAgencyProperty = function () {

            console.log('get agency property function => ');
            blockUI.start();
            var obj = {};
            obj.request_by_id = $localStorage.loggedInUserId;
            obj.request_by_role = $localStorage.role_id;
            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            agreementService.maintenceProperty().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.propertyList = response.data;
                    // if ($scope.propertyList.length == 0 && response.data.length == $scope.propertyList.length) {
                    //     $state.go('agreement_listing');
                    //     toastr.warning("You are not associated with any property to add new agreement request");
                    //     $scope.cancel();
                    // }
                    blockUI.stop();
                } else {
                    $state.go('agreement_listing');
                    toastr.warning("You are not associated with any property to add new agreement request");
                    blockUI.stop();
                    $scope.cancel();
                }
            });
            blockUI.stop();
        };
        /**
         * Function is to get property owner detail in add agreement page
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.getPropertyOwner = function (id) {
            // var id = JSON.parse(id);
            var id = id;
            // $scope.ownerList =[];//new for ui-select
            //$scope.agreement.property_id = id._id;
            $scope.agreement.property_id;
            $scope.agreement.owner_id = id.owned_by._id;
            // console.log("id.owned_by", id.owned_by);
            var fullName = id.owned_by.firstname + " " + id.owned_by.lastname;
            $scope.owner = _.extend($scope.owner, { _id: $scope.agreement.owner_id });
            $scope.owner = _.extend($scope.owner, { fullname: fullName });
            console.log('$scope.owner :: check here =======> ', $scope.owner);
            // $scope.ownerList[0] = $scope.owner 

        };
        /**
         * Function is to remove tenant in add maintenance page
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.removeTenant = function (key) {
            $scope.tenantList[key].ticked = false;
            // console.log($scope.newArray2[key],"$scope.newArray2[key]");
            $scope.newArray2[key].ticked = false;
            $scope.newArray2.splice(key, 1);
            // console.log($scope.tenantList[key].ticked, "ticked status");

        };
        $scope.calledTenantList = function (id) {
            $scope.propertyAss = false;
            if (!id) {
                $scope.propertyAss = true;
            }
        };
        /**
         * Function is to save agreement
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.saveAgreement = function (agreement, images) {
            if ($scope.agreementForm.$invalid || ($scope.bondError == true)) {
                toastr.error("Please fill the form correctly before submitting it");
                $scope.loginLoading = false;
                blockUI.stop();
            } else {
                if (agreement.tenantArray && agreement.tenantArray.length > 0) {
                    let finalArray = [];
                    validEmail = 0;
                    invalidEmail = 0;
                    let emailPattern = new RegExp('^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$');
                    agreement.tenantArray.map(tenant_ => {
                        if (emailPattern.test(tenant_.text)) {
                            console.log('true :: valid email => ', tenant_.text);
                            validEmail++;
                        } else {
                            console.log('false :: not valid email => ', tenant_.text);
                            invalidEmail++;
                        }
                        finalArray.push(tenant_.text)
                    });
                    if (invalidEmail === 0) {
                        console.log('no invalid email => ');
                        if ((agreement.hasOwnProperty("rental_period") && !_.propertyOf(agreement)("rental_period") == "") && (agreement.hasOwnProperty("tenancy_start_date") && !_.propertyOf(agreement)("tenancy_start_date") == "") && (agreement.hasOwnProperty("rent_price") && !_.propertyOf(agreement)("rent_price") == "") && (agreement.hasOwnProperty("payable_advance_start_on") && !_.propertyOf(agreement)("payable_advance_start_on") == "") && finalArray.length > 0) {
                            // remove comments
                            blockUI.start();
                            $scope.loginLoading = true;
                            let obj = {
                                agency_id: ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id,
                                created_by: $localStorage.loggedInUserId,
                                created_by_role: $localStorage.role_id,
                                tenancy_length: agreement.tenancy_length,
                                rent_price: parseInt(agreement.rent_price),
                                rental_period: parseInt(agreement.rental_period),
                                property_address: agreement.property_add,
                                property_lat: agreement.location_latitude ? agreement.location_latitude : '',
                                property_lng: agreement.location_longitude ? agreement.location_longitude : '',
                                tenancy_start_date: agreement.tenancy_start_date,
                                payable_advance_start_on: agreement.payable_advance_start_on,
                                property_owner: agreement.property_owner,
                                detail: agreement.detail,
                                tenants: finalArray,
                                save_as_draft: false
                            }
                            // API - add agreement
                            agreementService.addAgreement().post(obj, function (response) {
                                if (response.code == 200) {
                                    // remove comments
                                    $scope.agreement = {};
                                    $scope.finalArray = [];
                                    $scope.owner = {};
                                    if (images) {
                                        obj.images = images;
                                        $scope.uploadAgreementFiles(obj, response.data._id);
                                    } else {
                                        // remove comments
                                        $state.go('agreement_listing');
                                    }
                                    $scope.loginLoading = false;
                                } else {
                                    $scope.propertyList = [];
                                    $scope.loginLoading = false;
                                    blockUI.stop();
                                }
                            });
                        }
                        else {
                            console.log('else :: Fill form => ');
                            toastr.error("Please fill all the mandatory fields");
                            $scope.loginLoading = false;
                            blockUI.stop();
                        }
                    } else {
                        console.log('invalidEmail :: count of invalid email => ', invalidEmail);
                        toastr.error("Please enter valid email address for Tenants");
                        blockUI.stop();
                    }
                } else {
                    console.log('else :: No tenants => ');
                    toastr.error("Please fill all the mandatory fields");
                    $scope.loginLoading = false;
                    blockUI.stop();
                }
            }
        };
        /**
         * Function is to save as draft-agreement
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.saveAsDraftAgreement = function (agreement, images) {
            console.log('agreement :: save as draft agreement => ', agreement);
            blockUI.start();
            if ($scope.agreementForm.$invalid || ($scope.bondError == true)) {
                toastr.error("Please fill the form correctly before submitting it");
                $scope.loginLoading = false;
                blockUI.stop();
            } else {
                $scope.agreement.save_as_draft = true;
                if (agreement.tenantArray && agreement.tenantArray.length > 0) {
                    let finalArray = [];
                    validEmail = 0;
                    invalidEmail = 0;
                    let emailPattern = new RegExp('^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$');
                    agreement.tenantArray.map(tenant_ => {
                        if (emailPattern.test(tenant_.text)) {
                            console.log('true :: valid email => ', tenant_.text);
                            validEmail++;
                        } else {
                            console.log('false :: not valid email => ', tenant_.text);
                            invalidEmail++;
                        }
                        finalArray.push(tenant_.text)
                    });
                    if (invalidEmail === 0) {
                        console.log('no invalid email => ');
                        if ((agreement.hasOwnProperty("property_owner") && !_.propertyOf(agreement)("property_owner") == "") && (agreement.hasOwnProperty("location_latitude") && !_.propertyOf(agreement)("location_latitude") == "") && (agreement.hasOwnProperty("location_longitude") && !_.propertyOf(agreement)("location_longitude") == "") && (agreement.hasOwnProperty("property_add") && !_.propertyOf(agreement)("property_add") == "") && finalArray.length > 0) {
                            blockUI.start();
                            $scope.loginLoading = true;
                            let obj = {
                                agency_id: ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id,
                                created_by: $localStorage.loggedInUserId,
                                created_by_role: $localStorage.role_id,
                                tenancy_length: agreement.tenancy_length ? agreement.tenancy_length : '',
                                rent_price: agreement.rent_price ? parseInt(agreement.rent_price) : '',
                                rental_period: agreement.rental_period ? parseInt(agreement.rental_period) : '',
                                property_address: agreement.property_add,
                                property_lat: agreement.location_latitude ? agreement.location_latitude : '',
                                property_lng: agreement.location_longitude ? agreement.location_longitude : '',
                                tenancy_start_date: agreement.tenancy_start_date ? agreement.tenancy_start_date : '',
                                payable_advance_start_on: agreement.payable_advance_start_on ? agreement.payable_advance_start_on : '',
                                property_owner: agreement.property_owner,
                                detail: agreement.detail,
                                tenants: finalArray,
                                save_as_draft: true
                            }
                            // API - add agreement
                            agreementService.addAgreement().post(obj, function (response) {
                                if (response.code == 200) {
                                    // remove comments
                                    $scope.agreement = {};
                                    $scope.finalArray = [];
                                    $scope.owner = {};
                                    if (images) {
                                        obj.images = images;
                                        $scope.uploadAgreementFiles(obj, response.data._id);
                                    } else {
                                        // remove comments
                                        $state.go('agreement_listing');
                                        blockUI.stop();
                                    }
                                    $scope.loginLoading = false;
                                } else {
                                    $scope.propertyList = [];
                                    $scope.loginLoading = false;
                                    blockUI.stop();
                                }
                            });
                        } else {
                            console.log('else :: Fill form => ');
                            toastr.error("Please fill all the mandatory fields");
                            $scope.loginLoading = false;
                            blockUI.stop();
                        }
                    } else {
                        console.log('invalidEmail :: count of invalid email => ', invalidEmail);
                        toastr.error("Please enter valid email address");
                        blockUI.stop();
                    }
                } else {
                    toastr.error("Atleast Select Property Address & Add Property Owner & Add tenant for creating an agreement draft.");
                    $scope.loginLoading = false;
                    blockUI.stop();
                }
                // if ((agreement.hasOwnProperty("property_id") && !_.propertyOf(agreement)("property_id") == "") && (agreement.hasOwnProperty("address_service_notice1") && !_.propertyOf(agreement)("address_service_notice1") == "") && $scope.newArray2.length > 0) {
                //     var obj = {};
                //     obj = agreement;
                //     // var id = JSON.parse($scope.agreement.property_id);
                //     var id = $scope.agreement.property_id;
                //     $scope.agreement.property_id = id._id;
                //     obj.property_id = id._id;
                //     obj.rental_period = parseInt(agreement.rental_period);
                //     obj.rent_price = (agreement.rent_price) ? agreement.rent_price : '0';
                //     obj.rent_price = parseInt(obj.rent_price);
                //     obj.terms = parseInt(agreement.terms);
                //     obj.created_by = $localStorage.loggedInUserId;
                //     obj.created_by_role = $localStorage.role_id;
                //     if ($localStorage.userData.agency_id) {
                //         obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                //     }
                //     if (obj.tenancy_start_date == '' || obj.tenancy_start_date == null) {
                //         obj.tenancy_start_date = "";
                //     }
                //     if (obj.payable_advance_start_on == '' || obj.payable_advance_start_on == null) {
                //         obj.payable_advance_start_on = "";
                //     }
                //     if (obj.case_validity == '' || obj.case_validity == null) {
                //         obj.case_validity = "";
                //     }
                //     // if (_.isEmpty(obj.tenancy_start_date) == true) {
                //     //     obj.tenancy_start_date = "";
                //     // }
                //     // if (_.isEmpty(obj.payable_advance_start_on) == true) {
                //     //     obj.payable_advance_start_on = "";
                //     // }
                //     // if (_.isEmpty(obj.case_validity) == true) {
                //     //     obj.case_validity = "";
                //     // }
                //     obj.tenants = _.map($scope.newArray2, function (o) { return _.pick(o, '_id'); });
                //     agreementService.addAgreement().post(obj, function (response) {
                //         if (response.code == 200) {
                //             // $scope.propertyList = response.data;
                //             $scope.agreement = {};
                //             $scope.newArray2 = [];
                //             $scope.owner = {};
                //             obj.images = images;
                //             $scope.agreement.property_id = undefined;
                //             $scope.uploadAgreementFiles(obj, response.data._id);
                //             $scope.loginLoading = false;
                //         } else {
                //             $scope.propertyList = [];
                //             $scope.loginLoading = false;
                //             blockUI.stop();
                //         }
                //     });
                // } else {
                //     toastr.error("Atleast Select property,Address of services of notices & Add tenant for creating an agreement draft");
                //     $scope.loginLoading = false;
                //     blockUI.stop();
                // }
            }
        };
        /**
        * Function is to save agreement
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        $scope.updateAgreement = function (agreement, images) {
            blockUI.start();
            $scope.loginLoading = true;
            console.log('$scope.editAgreementForm => ', $scope.editAgreementForm);
            if ($scope.editAgreementForm.$invalid || ($scope.bondError == true)) {
                toastr.error("Please fill the form correctly before submitting it");
                $scope.loginLoading = false;
                blockUI.stop();
            } else {
                let finalArray = [];
                agreement.tenants.map(tenant_ => {
                    finalArray.push(tenant_.users_id.email)
                });
                if ((agreement.hasOwnProperty("rental_period") && !_.propertyOf(agreement)("rental_period") == "") && (agreement.hasOwnProperty("tenancy_start_date") && !_.propertyOf(agreement)("tenancy_start_date") == "") && (agreement.hasOwnProperty("rent_price") && !_.propertyOf(agreement)("rent_price") == "") && (agreement.hasOwnProperty("payable_advance_start_on") && !_.propertyOf(agreement)("payable_advance_start_on") == "") && finalArray.length > 0) {
                    const obj = {
                        // don't need to update it - do not pass it in api 
                        // agency_id: ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id,
                        // created_by_role: $localStorage.role_id,
                        // property_owner: agreement.owner_id._id,
                        // tenants: finalArray,
                        agreement_id: agreement._id,
                        created_by: agreement.created_by ? agreement.created_by._id : $localStorage.loggedInUserId,
                        tenancy_length: agreement.tenancy_length,
                        rent_price: parseInt(agreement.rent_price),
                        rental_period: parseInt(agreement.rental_period),
                        property_address: agreement.property_address,
                        property_lat: agreement.property_lat ? agreement.property_lat : '',
                        property_lng: agreement.property_lng ? agreement.property_lng : '',
                        tenancy_start_date: agreement.tenancy_start_date,
                        payable_advance_start_on: agreement.payable_advance_start_on,
                        detail: agreement.detail,
                        save_as_draft: (agreement.save_as_draft == true) ? true : false
                    }
                    console.log('obj :: final obj to pass in update api => ', obj);
                    agreementService.editAgreement().post(obj, function (response) {
                        if (response.code == 200) {
                            $scope.agreement = {};
                            $scope.newArray2 = [];
                            $scope.owner = {};
                            if (images) {
                                obj.images = images;
                                $scope.uploadAgreementFiles(obj, response.data._id);
                            } else {
                                $state.go('agreement_listing');
                            }
                            $scope.loginLoading = false;
                        } else {
                            toastr.error('Server is busy please try latter');
                            $scope.loginLoading = false;
                            blockUI.stop();
                        }
                    });
                } else {
                    toastr.error("Please fill all the mandatory fields");
                    $scope.loginLoading = false;
                    blockUI.stop();
                }
            }
        };


        $scope.updateSaveAsDraftAgreement = function (agreement, images) {
            blockUI.start();
            $scope.loginLoading = true;
            console.log('agreement :: Update as draft => ', agreement);
            // console.log('$scope.agreementForm => ', $scope.agreementForm);
            // console.log('$scope.agreementForm.$invalid => ', $scope.agreementForm.$invalid);
            if ($scope.editAgreementForm.$invalid || ($scope.bondError == true)) {
                toastr.error("Please fill the form correctly before submitting it");
                $scope.loginLoading = false;
                blockUI.stop();
            } else {
                let finalArray = [];
                agreement.tenants.map(tenant_ => {
                    finalArray.push(tenant_.users_id.email)
                });
                if ((agreement.hasOwnProperty("property_owner") && !_.propertyOf(agreement)("property_owner") == "") && (agreement.hasOwnProperty("property_lat") && !_.propertyOf(agreement)("property_lat") == "") && (agreement.hasOwnProperty("property_lng") && !_.propertyOf(agreement)("property_lng") == "") && (agreement.hasOwnProperty("property_address") && !_.propertyOf(agreement)("property_address") == "") && finalArray.length > 0) {
                    // var obj = {};
                    // obj = agreement;
                    // obj.agreement_id = agreement._id;
                    // obj.rental_period = parseInt(agreement.rental_period);
                    // obj.rent_bond_price = agreement.rent_bond_price.toString();
                    // obj.terms = parseInt(agreement.terms);
                    // obj.rent_price = (agreement.rent_price) ? agreement.rent_price : '0';
                    // obj.rent_price = parseInt(obj.rent_price);
                    // obj.created_by = $localStorage.loggedInUserId;
                    // obj.created_by_role = $localStorage.role_id;
                    // if ($localStorage.userData.agency_id) {
                    //     obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                    // }
                    // obj.tenants = _.map($scope.newArray2, function (o) { return _.pick(o, '_id'); });
                    // if (obj.tenancy_start_date == '' || obj.tenancy_start_date == null) {
                    //     obj.tenancy_start_date = "";
                    // }
                    // if (obj.payable_advance_start_on == '' || obj.payable_advance_start_on == null) {
                    //     obj.payable_advance_start_on = "";
                    // }
                    // if (obj.case_validity == '' || obj.case_validity == null) {
                    //     obj.case_validity = "";
                    // }
                    // // if (_.isEmpty(obj.tenancy_start_date) == true) {
                    // //     obj.tenancy_start_date = "";
                    // // }
                    // // if (_.isEmpty(obj.payable_advance_start_on) == true) {
                    // //     obj.payable_advance_start_on = "";
                    // // }
                    // // if (_.isEmpty(obj.case_validity) == true) {
                    // //     obj.case_validity = "";
                    // // }
                    // obj = _.omit(obj, 'images');
                    // obj.save_as_draft = (agreement.save_as_draft == true) ? true : false;


                    const obj = {
                        // don't need to update it - do not pass it in api 
                        // agency_id: ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id,
                        // created_by_role: $localStorage.role_id,
                        // property_owner: agreement.owner_id._id,
                        // tenants: finalArray,
                        agreement_id: agreement._id,
                        created_by: agreement.created_by ? agreement.created_by._id : $localStorage.loggedInUserId,
                        tenancy_length: agreement.tenancy_length ? agreement.tenancy_length : '',
                        rent_price: agreement.rent_price ? parseInt(agreement.rent_price) : '',
                        rental_period: agreement.rental_period ? parseInt(agreement.rental_period) : '',
                        property_address: agreement.property_address ? agreement.property_address : '',
                        property_lat: agreement.property_lat ? agreement.property_lat : '',
                        property_lng: agreement.property_lng ? agreement.property_lng : '',
                        tenancy_start_date: agreement.tenancy_start_date ? agreement.tenancy_start_date : '',
                        payable_advance_start_on: agreement.payable_advance_start_on ? agreement.payable_advance_start_on : '',
                        detail: agreement.detail ? agreement.detail : '',
                        save_as_draft: (agreement.save_as_draft == true) ? true : false
                    }
                    agreementService.editAgreement().post(obj, function (response) {
                        if (response.code == 200) {
                            $scope.agreement = {};
                            $scope.newArray2 = [];
                            $scope.owner = {};
                            if (images) {
                                obj.images = images;
                                $scope.uploadAgreementFiles(obj, response.data._id);
                            } else {
                                $state.go('agreement_listing');
                            }
                            $scope.loginLoading = false;
                        } else {
                            toastr.error('Server is busy please try latter');
                            $scope.loginLoading = false;
                            blockUI.stop();
                        }
                    });
                } else {
                    toastr.error("Atleast Select Property Address & Add Property Owner & Add tenant for creating an agreement draft.");
                    $scope.loginLoading = false;
                    blockUI.stop();
                }
            }
        };
        /**
         * Function is to upload agreement files
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.uploadAgreementFiles = function (files, data) {
            console.log('upload agreement file => ');
            if (files.images && files.images.length) {
                console.log('if condition :: upload file => ');
                // blockUI.start();
                for (var i = 0; i < files.images.length; i++) {
                    var file = files.images[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: baseUrl + '/api/uploadAgreementDocs',
                            data: {
                                _id: data,
                                file: file,
                            }
                        }).then(function (response) {
                            console.log('response :: => ', response);
                            if (response && response.status == 200) {
                                if (files.save_as_draft == true) {
                                    toastr.success('Successfully created agreement as a draft');
                                } else {
                                    if ($state.current.name == 'editAgreement') {
                                        toastr.success('Successfully edited agreement');
                                    } else {
                                        toastr.success('Successfully created agreement');
                                    }

                                }
                                $state.go('agreement_listing');
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
                if ($state.current.name == 'editAgreement') {
                    toastr.success('Successfully edited agreement');
                } else {
                    toastr.success('Successfully created agreement');
                }
                // ==============================================
                // $state.go('agreement_listing');
                blockUI.stop();
            }
        };
        /**
         * Function is to upload bulk agreement files
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.uploadBulkAgreementFiles = function (files, data) {
            if (files.images && files.images.length) {
                blockUI.start();
                for (var i = 0; i < files.images.length; i++) {
                    var file = files.images[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: baseUrl + '/api/uploadAgreementDocs',
                            data: {
                                _id: data,
                                file: file,
                            }
                        }).then(function (response) {
                            if (response && response.status == 200) {
                                if (files.save_as_draft == true) {
                                    $location.path('/bulk_upload_listing');
                                    toastr.success('Successfully updated agreement as a draft');
                                } else {
                                    toastr.success('Successfully updated agreement');
                                }
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
                toastr.success('Successfully updated agreement');
                $location.path('/bulk_upload_listing');
                blockUI.stop();
            }
        };
        $scope.showBulkUploadList = function () {
            $state.go('bulkUploadListing');
        }
        /**
         * Function is to remove agreement files
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.RemovePhoto = function (index) {
            //Find the record using Index from Array.
            var name = $scope.images[index];
            $scope.images.splice(index, 1);
            if ($scope.images.length == 0) {
                delete $scope.images;
            }
        };
        /**
         * Function is to remove agreement files
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.editPhoto = function (index) {
            //Find the record using Index from Array.
            var name = $scope.agreement.images[index];
            $scope.agreement.images.splice(index, 1);
            if ($scope.agreement.images.length == 0) {
                $scope.agreement.images = [];
            }
        };


        /**
        * Function is to save agreement draft
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        $scope.draftAgreement = function (agreement, images) {
            // blockUI.start();
            $scope.saveAsDraftAgreement(agreement, images);
            // blockUI.stop();

        };
        $scope.updateAgreementDraft = function (agreement, images) {
            console.log('images :: update save as draft agreement => ', images);
            // console.log('agreement_images :: update save as draft agreement => ', agreement_images);
            blockUI.start();
            $scope.agreement.save_as_draft = true;
            $scope.updateSaveAsDraftAgreement(agreement, images);
            blockUI.stop();

        };
        $scope.updateAgreementNotDraft = function (agreement, images) {
            console.log('images :: update agreement => ', images);
            // console.log('agreement_images :: update agreement => ', agreement_images);
            // console.log('images.concat(agreement_images) => ', agreement_images.concat(images));
            blockUI.start();
            $scope.agreement.save_as_draft = false;
            $scope.updateAgreement(agreement, images);
            blockUI.stop();
        };
        /**
      * Function is to show agreement listing
      * @access private
      * @return json
      * Created 
      * @smartData Enterprises (I) Ltd
      * Created Date 22-Nov-2017
      */
        $scope.agreementListing = function () {
            $rootScope.navBarOptionSelected = 'Agreements';
            $localStorage.userData.routeState = 'Agreements';
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            var obj = {};
            // if ($localStorage.userData.agency_id) {
            if ($localStorage.userData.agency_id) {
                obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            obj.created_by = $localStorage.loggedInUserId;
            obj.request_by_role = $localStorage.role_id;
            agreementService.agreementListing().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.agreementList = response.data;
                    angular.forEach($scope.agreementList, function (value, key) {
                        if (value.tenancy_start_date == '' || value.tenancy_start_date == null) {
                            value.tenancy_start_date = "";
                        }
                        if (value.payable_advance_start_on == '' || value.payable_advance_start_on == null) {
                            value.payable_advance_start_on = "";
                        }
                        if (value.case_validity == '' || value.case_validity == null) {
                            value.case_validity = "";
                        }
                        // if (_.isEmpty(value.tenancy_start_date) == true) {
                        //     value.tenancy_start_date = "";
                        // }
                        // if (_.isEmpty(value.payable_advance_start_on) == true) {
                        //     value.payable_advance_start_on = "";
                        // }
                        // if (_.isEmpty(value.case_validity) == true) {
                        //     value.case_validity = "";
                        // }
                        if (value.case_validity) {
                            var diff1 = moment(value.case_validity).format("YYYY MM DD");
                            var difference = moment(diff1).diff(moment($scope.TodayDate), 'days');
                            if (difference > 0) {
                                value.case_valid = true;
                            } else {
                                value.case_valid = false;
                            }
                        }
                    });
                    blockUI.stop();
                } else {
                    $scope.agreementList = [];
                    blockUI.stop();
                }
            });
            // } else {

            // }
        };
        //go to maintenance creator's profile
        $scope.goToCreatorProfile = function (id, role) {
            console.log('function called => ', id, role);
            console.log('roleId.agent => ', roleId.agent);
            console.log('roleId.tenant => ', roleId.tenant);
            console.log('roleId.owner => ', roleId.owner);
            console.log('roleId.ownAgency => ', roleId.ownAgency);
            if (role == roleId.agent) {
                console.log('1 => ');
                $localStorage.userData.routeState = "agents_listing";
                $rootScope.navBarOptionSelected = "agents_listing";
                $location.path('/profile/' + id);
            } else if (role == roleId.tenant) {
                console.log('2 => ');
                $localStorage.userData.routeState = "tenants_listing";
                $rootScope.navBarOptionSelected = "tenants_listing";
                $location.path('/tenant_profile/' + id);
            } else if (role == roleId.owner) {
                console.log('3 => ');
                $localStorage.userData.routeState = " ";
                $rootScope.navBarOptionSelected = " ";
                $location.path('/owner_profile/' + id);
            } else if (role == roleId.ownAgency) {
                console.log('4 => ');
                $localStorage.userData.routeState = "agency_profile";
                $rootScope.navBarOptionSelected = "agency_profile";
                $location.path('/agency_profile/' + id);
            }

        }
        /**
         * Function is to show agreement listing
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        $scope.data = [];
        $scope.agreementBulkAgreementListing = function () {

            document.body.scrollTop = document.documentElement.scrollTop = 0;
            var obj = {};
            if ($localStorage.userData.agency_id) {
                obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                obj.request_by_id = $localStorage.loggedInUserId;
                obj.request_by_role = $localStorage.role_id;
                agreementService.agreementBulkListing().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.agreementList = response.data;
                        angular.forEach($scope.agreementList, function (value, key) {
                            $scope.data[key] = key;
                        });
                        if ($scope.agreementList.length == $scope.data.length) {
                            angular.forEach($scope.agreementList, function (value, key) {
                                if (value.tenancy_start_date == '' || value.tenancy_start_date == null) {
                                    value.tenancy_start_date = "";
                                }
                                if (value.payable_advance_start_on == '' || value.payable_advance_start_on == null) {
                                    value.payable_advance_start_on = "";
                                }
                                if (value.case_validity == '' || value.case_validity == null) {
                                    value.case_validity = "";
                                }
                                // if (_.isEmpty(value.tenancy_start_date) == true) {
                                //     value.tenancy_start_date = "";
                                // }
                                // if (_.isEmpty(value.payable_advance_start_on) == true) {
                                //     value.payable_advance_start_on = "";
                                // }
                                // if (_.isEmpty(value.case_validity) == true) {
                                //     value.case_validity = "";
                                // }
                                if (value.case_validity) {
                                    var diff1 = moment(value.case_validity).format("YYYY MM DD");
                                    var difference = moment(diff1).diff(moment($scope.TodayDate), 'days');
                                    if (difference > 0) {
                                        value.case_valid = true;
                                    } else {
                                        value.case_valid = false;
                                    }
                                }
                            });
                        }
                        blockUI.stop();
                    } else {
                        $scope.agreementList = [];
                        blockUI.stop();
                    }
                });
            } else {

            }
        };
        $scope.goToeditAgreement = function (id) {
            $rootScope.navBarOptionSelected = 'Agreements';
            $localStorage.userData.routeState = 'Agreements';
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $location.path('/edit_agreement/' + id);
        };
        $scope.goToBulkEditAgreement = function (id) {
            $rootScope.navBarOptionSelected = 'Agreements';
            $localStorage.userData.routeState = 'Agreements';
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $location.path('/edit_bulk_agreement/' + id);
        };
        $scope.editAgreementInit = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.editAgreement();
        }
        /**
      * Function is to save agreement draft
      * @access private
      * @return json
      * Created 
      * @smartData Enterprises (I) Ltd
      * Created Date 22-Nov-2017
      */
        $scope.existingTenant = [];

        $scope.editAgreement = function () {
            blockUI.start();
            var obj = {};
            obj.id = $stateParams.id;

            agreementService.getAgreementDetail().get(obj, function (response) {
                if (response.code == 200) {

                    let newobj = {};
                    newobj.page_number = '';
                    newobj.number_of_pages = '';
                    newobj.user_id = $localStorage.loggedInUserId;

                    console.log('$localstorage.role_id => ', $localStorage.role_id);
                    if ($localStorage.role_id == roleId.ownAgency) {
                        $scope.isAgencyUser = true;
                    }

                    $scope.isSearchedTenant = false;
                    $scope.tenantMsg = " ";
                    // if (tanet_response.code == 200) {
                    $scope.tenantMsg = " ";
                    $scope.tenantList = [];
                    // $scope.newArray2 = tanet_response.data;
                    $scope.agreement = response.data[0].propertyData;
                    if (response.data[0].propertyData.owner_pending_email) {
                        // pending email => display email only
                        $scope.agreement.property_owner = response.data[0].propertyData.owner_id.email
                    } else {
                        // Existing user => Display full name
                        $scope.agreement.property_owner = response.data[0].propertyData.owner_id.name ? response.data[0].propertyData.owner_id.name : response.data[0].propertyData.owner_id.firstname + ' ' + response.data[0].propertyData.owner_id.lastname
                    }

                    let arrayForTenants = [];
                    if (response.data[0].propertyData.tenants) {
                        response.data[0].propertyData.tenants.map(tenantObj => {
                            if (tenantObj.pending_email) {
                                // Array for input tags
                                // arrayForTenants.push({ "text": '(Pending) ' + tenantObj.users_id.email });
                                arrayForTenants.push(tenantObj.users_id.email);
                            } else {
                                // Array for input tags
                                // arrayForTenants.push({ "text": tenantObj.users_id.firstname + ' ' + tenantObj.users_id.lastname });
                                arrayForTenants.push(tenantObj.users_id.firstname + ' ' + tenantObj.users_id.lastname);
                            }
                        });
                        $scope.agreement.tenantArray = arrayForTenants;
                    }


                    // $scope.total = $scope.agreement.property_id;
                    if (response.data[0].propertyData.detail && response.data[0].propertyData.detail.length > 0) {
                        tinymce.get('mytextarea').setContent(response.data[0].propertyData.detail);
                    }

                    // var pid = ($scope.agreement.property_id._id) ? $scope.agreement.property_id._id : $scope.agreement.property_id;
                    $scope.agreement = _.omit($scope.agreement, 'property_id');
                    // $scope.agreement.property_id = pid;
                    if ($scope.agreement.tenancy_start_date == '' || $scope.agreement.tenancy_start_date == null) {
                        $scope.agreement.tenancy_start_date = "";
                    }
                    else {
                        $scope.agreement.tenancy_start_date = new Date($scope.agreement.tenancy_start_date);
                        $scope.dateOptions2.minDate = new Date($scope.agreement.tenancy_start_date);
                    }
                    if ($scope.agreement.tenancy_length == '' || $scope.agreement.tenancy_length == null) {
                        $scope.agreement.tenancy_length = "";
                    }
                    else {
                        $scope.agreement.tenancy_length = new Date($scope.agreement.tenancy_length);
                        $scope.dateOptions2.minDate = new Date($scope.agreement.tenancy_length);
                    }
                    if ($scope.agreement.payable_advance_start_on == '' || $scope.agreement.payable_advance_start_on == null) {
                        $scope.agreement.payable_advance_start_on = "";
                    }
                    else {
                        $scope.agreement.payable_advance_start_on = new Date($scope.agreement.payable_advance_start_on);
                    }

                    if ($scope.agreement.case_validity == '' || $scope.agreement.case_validity == null) {
                        $scope.agreement.case_validity = "";
                    }
                    else {
                        $scope.agreement.case_validity = new Date($scope.agreement.case_validity);
                        moment($scope.agreement.case_validity).format('YYYY-MM-DD');
                        $scope.dateOptions2.minDate = new Date($scope.agreement.case_validity);
                    }
                    // $scope.agreement.terms = $scope.agreement.terms.toString();
                    $scope.agreement.rental_period = $scope.agreement.rental_period.toString();

                    let existingIds = [];
                    angular.forEach($scope.agreement.tenants, function (value, key) {
                        var obj1 = [];
                        obj1 = _.values(_.pick(value, 'users_id'));
                        existingIds.push(obj1[0]._id);
                        $scope.existingTenant[key] = obj1[0].email;
                    });

                    $scope.tenantList.map((t) => {
                        if (existingIds.indexOf(t._id) !== -1) {
                            t.ticked = true;
                        }
                        return t;
                    });

                    angular.forEach($scope.agreement.images, function (value, key) {
                        if ((value.path).includes(".xlsx") || (value.path).includes(".xlsx")) {
                            value.document_type = "excel";
                        }
                        else if ((value.path).includes(".txt") || (value.path).includes(".doc")) {
                            value.document_type = "doc";
                        } else if ((value.path).includes(".pdf")) {
                            value.document_type = "pdf";
                        } else if ((value.path).includes(".ppt")) {
                            value.document_type = "ppt";
                        }
                    });
                    // $scope.editPropertyOwner($scope.total.owned_by);
                    // $scope.editTenants(pid, $scope.existingTenant);
                    $scope.getBondValidationValue($scope.agreement.rent_price, $scope.agreement.terms);

                    blockUI.stop();
                    // } else {
                    //     $scope.tenantList = [];
                    //     $scope.newArray2 = [];
                    //     blockUI.stop();
                    // }
                    // TenantService.tenantDatabaseList().post(newobj, function (tanet_response) {

                    // });


                } else {
                    blockUI.stop();
                }
            });
        };


        $scope.editPropertyOwner = function (data) {
            var fullName = data.firstname + " " + data.lastname;
            $scope.owner = _.extend($scope.owner, { _id: data._id });
            $scope.owner = _.extend($scope.owner, { fullname: fullName });
        }
        $scope.editTenants = function (id, arr) {

            blockUI.start();
            $scope.noTenant = false;
            var obj = {};
            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                obj.id = id;
                agreementService.getTenantForAgreement().get(obj, function (response) {
                    if (response.code == 200) {
                        $scope.data = response.data;
                        // $scope.tenantList = [];
                        if ($scope.data.length > 0) {
                            // angular.forEach($scope.data, function (value, key) {
                            //     var obj1 = [];

                            //     obj1 = _.values(_.pick(value, 'invited_to'));
                            //     var fullname = obj1[0].firstname + " " + obj1[0].lastname;
                            //     var editedEmail = "(" + obj1[0].email + ")";
                            //     obj1[0] = _.extend(obj1[0], { fullName: $scope.capitalizeName(fullname) + "-" + editedEmail });
                            //     if (_.indexOf(arr, obj1[0].email) != -1) {
                            //         obj1[0] = _.extend(obj1[0], { ticked: true })
                            //     }
                            //     console.log(obj1[0]);
                            //     // $scope.tenantList[key] = obj1[0];

                            // });

                        } else {
                            // $scope.tenantList = [];
                            $scope.noTenant = true;
                        }
                        blockUI.stop();
                    } else {
                        // $scope.tenantList = [];
                        $scope.noTenant = true;
                        blockUI.stop();
                    }
                });
            }
            blockUI.stop();
        }
        $scope.deleteAgreement = function (userId, id) {
            if (userId == $scope.loggedUser) {
                swal({
                    title: "Are you sure?",
                    text: "You want to delete this agreement permanently?",
                    // imageUrl: '/assets/images/logo_color_blue.png',
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
                    var obj = {};
                    obj.id = id;
                    blockUI.start();
                    agreementService.deleteAgreement().get(obj, function (response) {
                        if (response.code == 200) {
                            toastr.success('Successfully deleted agreement');
                            $scope.agreementListing();
                            blockUI.stop();
                        } else {
                            toastr.warning('Server is busy');
                            blockUI.stop();
                        }
                    });
                    blockUI.stop();
                });
            } else {
                toastr.error('You do not have access permission');
            }
        };
        $scope.deleteBulkAgreement = function (userId, id) {
            if (userId == $scope.loggedUser) {
                swal({
                    title: "Are you sure?",
                    text: "You want to delete this agreement permanently?",
                    // imageUrl: '/assets/images/logo_color_blue.png',
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
                    var obj = {};
                    obj.id = id;
                    blockUI.start();
                    agreementService.deleteAgreement().get(obj, function (response) {
                        if (response.code == 200) {
                            toastr.success('Successfully deleted agreement');
                            $scope.agreementBulkAgreementListing();
                            blockUI.stop();
                        } else {
                            toastr.warning('Server is busy');
                            blockUI.stop();
                        }
                    });
                    blockUI.stop();
                });
            } else {
                toastr.error('You do not have access permission');
            }
        };

        $scope.goToDetail = function (id) {
            // console.log("i m calling");
            $localStorage.scollOnChat = 0;
            // document.body.scrollTop = document.documentElement.scrollTop = 0;            
            $location.path('/detail_agreement/' + id);
        }
        $scope.detailInit = function () {
            // document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.category_list();
        }
        $scope.scollOnChat = 0;
        $scope.getAgreementDetail = function () {
            $scope.scollOnChat = $localStorage.scollOnChat;
            blockUI.start();
            var obj = {};
            obj.id = $stateParams.id;
            $scope.TodayDate = moment().format("YYYY MM DD");
            agreementService.getAgreementDetail().get(obj, function (response) {
                if (response.code == 200) {
                    $scope.agreementDetail = response.data[0];
                    if ($scope.agreementDetail.propertyData.tenancy_start_date == '' || $scope.agreementDetail.propertyData.tenancy_start_date == null) {
                        $scope.agreementDetail.propertyData.tenancy_start_date = "";
                    }
                    if ($scope.agreementDetail.propertyData.payable_advance_start_on == '' || $scope.agreementDetail.propertyData.payable_advance_start_on == null) {
                        $scope.agreementDetail.propertyData.payable_advance_start_on = "";
                    }
                    if ($scope.agreementDetail.propertyData.case_validity == '' || $scope.agreementDetail.propertyData.case_validity == null) {
                        $scope.agreementDetail.propertyData.case_validity = "";
                    }

                    if ($scope.agreementDetail.propertyData.tenancy_start_date && $scope.agreementDetail.propertyData.tenancy_length) {
                        let difference = moment($scope.agreementDetail.propertyData.tenancy_length).diff(moment($scope.agreementDetail.propertyData.tenancy_start_date), 'days');
                        console.log('difference => ', difference);
                        console.log('difference/30.147 => ', Math.round(difference / 30.147));
                        $scope.agreementDetail.propertyData.agreement_length = Math.round(difference / 30.147);
                    }

                    // if (_.isEmpty($scope.agreementDetail.propertyData.tenancy_start_date) == true) {
                    //     $scope.agreementDetail.propertyData.tenancy_start_date = "";
                    // }
                    // if (_.isEmpty($scope.agreementDetail.propertyData.payable_advance_start_on) == true) {
                    //     $scope.agreementDetail.propertyData.payable_advance_start_on = "";
                    // }
                    // if (_.isEmpty($scope.agreementDetail.propertyData.case_validity) == true) {
                    //     $scope.agreementDetail.propertyData.case_validity = "";
                    // }
                    $scope.maintenanceDetail = response.data[1];
                    angular.forEach($scope.maintenanceDetail.maintenanceData, function (value, key) {
                        // var diff1 = moment(value.due_date).format("YYYY MM DD");
                        // value.difference = moment(diff1).diff($scope.TodayDate, 'days');
                        var diff1 = moment(value.due_date).format("YYYY MM DD");
                        value.difference = moment(diff1, "YYYY MM DD").diff(moment($scope.TodayDate, "YYYY MM DD"), 'days');
                        // console.log("diff1  ", diff1, "   ", value.difference);
                    });
                    angular.forEach($scope.agreementDetail.propertyData.images, function (value, key) {
                        if ((value.path).includes(".xlsx") || (value.path).includes(".xlsx")) {
                            value.document_type = "excel";
                        }
                        // else if((value.path).includes(".jpeg")||(value.path).includes(".jpg")||(value.path).includes(".png")||(value.path).includes(".gif")){
                        //     value.document_type = "pic";
                        // }
                        else if ((value.path).includes(".txt") || (value.path).includes(".doc")) {
                            value.document_type = "doc";
                        } else if ((value.path).includes(".pdf")) {
                            value.document_type = "pdf";
                        } else if ((value.path).includes(".ppt")) {
                            value.document_type = "ppt";
                        }
                    });
                    blockUI.stop();
                } else {
                    blockUI.stop();
                }
            });
        }
        /**
         * Chat functionality starts from here 
         */

        //To initialize the basic chat functionality
        $scope.privateMessage = [];
        $scope.chatInitialize = function () {
            if ($localStorage.loggedInUserId) {
                //add user to the group
                socket.emit("addUsers", {
                    id: $localStorage.loggedInUserId,
                    agreementId: $stateParams.id,
                    firstName: $localStorage.loggedInfirstname,
                    lastName: $localStorage.loggedInlastname
                });
            }
        }
        /**
         * Function is use to get response sender and show message to their window
         * @access private
         * @return json
         * Created by Minakshi
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        socket.on('user joined', function (data) {
            //to check added users 
            //console.log('data', data);
            toastr.info('You are added to group chat', data);
            socket.emit('groupChatHistory', { agreementId: $stateParams.id });
        });
        //group chat response come here 
        socket.on('agreementUserLeaveChat', function (leaveData) {
            // console.log('leaveData', leaveData);
            if (leaveData.id != $localStorage.loggedInUserId) {
                toastr.info(leaveData.firstName + ' ' + leaveData.lastName + ' is offline now');
            }
        });
        //group chat response come here 
        socket.on('groupChatResponse', function (data) {
            //console.log('data', data);
            var box = document.getElementById('conversation');
            box.scrollTop = box.scrollHeight;
            $scope.privateMessage = data;
        });
        //group chat messages recived here for notification purpose
        socket.on('group_message_recieved', function (message) {
            // console.log('message', message);
            if (message.from != $localStorage.loggedInUserId) {
                toastr.info('user message', message.msg);
            }
            socket.emit('groupChatHistory', { agreementId: $stateParams.id });
        });
        //get current data functionality 
        $scope.getDate = function () {
            var d = moment().format('YYYY-MM-DD h:mm:ss a');
            var n = moment().format("MMM Do") + ', ' + moment().format('LT');
            return n;
        }
        //group messages sent from here 
        $scope.send_message = function (message) {
            console.log("message    ", message);
            //Listens for a new chat message
            // console.log('message sent called', message);
            if (message != "" && message != undefined) {
                var message = {
                    from: $localStorage.loggedInUserId,
                    to: $rootScope.to,
                    textMsg: message,
                    time: $scope.getDate(),
                    agreementId: $stateParams.id
                }
                socket.emit('group_message_sent', message);
                // $scope.chat.generalMsg = '';
            }
        }
        /**
         * file uploads
         * @param {*} file 
         */
        $scope.private_Message = '';
        $scope.uploadFile = function (file) {
            var postData = {
                from: $localStorage.loggedInUserId,
                to: $rootScope.to,
                textMsg: $scope.private_Message,
                time: $scope.getDate(),
                agreementId: $stateParams.id
            }
            // console.log('postData', postData);
            $scope.fileUpload(file, postData);
            // console.log('file', file);
        }
        /**
        * Function is use to upload on file either on select or drop
        * @access private
        * @return json
        * Created by 
        * @smartData Enterprises (I) Ltd
        * Created Date
        */
        $scope.fileUpload = function (file, data) {
            Upload.upload({
                url: baseUrl + '/api/uploadDocumentForChat',
                data: {
                    data: data,
                    file: file,
                }
            }).then(function (response) {
                if (response.data.code == 200) {
                    toastr.success(response.data.message);
                    var obj = {};
                    obj = $localStorage.loggedInUserId;
                    socket.emit('group_message_sent_with_file', {
                        from: $localStorage.loggedInUserId,
                        to: $rootScope.to,
                        propertyId: $stateParams.id,
                        textMsg: 'File uploaded ' + response.data.data.document_name,
                        time: $scope.getDate(),
                        agreementId: $stateParams.id,
                        document_name: response.data.data.document_name,
                        document_path: response.data.data.document_path + response.data.data.picture_path,
                        size: response.data.data.size,
                        is_file: true,
                    });

                    socket.on('sent', function (data) {
                        $scope.private_chat_history();
                    });
                } else {
                    toastr.error(response.data.message);
                }
            }, null, function (evt) {
                $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            });
        };
        /**
         * Chat functionality ends here 
         */
        $scope.goToPropertyDetail = function (id) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $location.path('/property_details/' + id)
        }
        /**
        * Function is used to view image from  attachment
        * @access private
        * @return json
        * Created by  
        * @smartData Enterprises (I) Ltd
        * Created Date 3-Aug-2017
        */
        $scope.openImages = function (path) {
            var modalInstance;
            modalInstance = $uibModal.open({
                template: '<img src="' + $scope.agreementImageUrl + path + '" style="width:100%;hight:100%;">',
                controller: "AgreementCtrl",
                scope: $scope
            });
        }
        $scope.goToAttachedFileSection = function () {
            var elmnt = document.getElementById("fileAttached");
            elmnt.scrollIntoView();
        }
        /**
          * function is to show and hide file option
          * created on 22-Dec-2017
          * 
          */
        $scope.showFilePopup = function (key) {
            $scope.filePopup[key] = ($scope.filePopup[key] == false) ? true : false;
        }
        $scope.openDilogue = function (id, createdId) {
            if (createdId == $scope.loggedUser) {
                var modalInstance = $scope.model = $uibModal.open({
                    animation: false,
                    templateUrl: '/frontend/modules/agreement/views/upload_modal.html',
                    scope: $scope,
                    controller: function ($uibModalInstance, $scope) {
                        $scope.ok = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        var uploader = $scope.uploader = new FileUploader({
                            url: baseUrl + '/api/uploadAgreementDocs',
                            headers: { authorization: $localStorage.token },
                            formData: [{ '_id': id }]
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
                        };
                        uploader.onCompleteItem = function (fileItem, response, status, headers) {
                        };
                        uploader.onCompleteAll = function () {
                            toastr.success("Successfully uploaded all files");
                            $scope.getAgreementDetail();
                            $scope.goToAttachedFileSection();
                            $uibModalInstance.dismiss('cancel');
                        };

                    }
                });
                modalInstance.result.then(function (selectedItem) {

                }, function () { });
            } else {
                toastr.warning('You do not have access permission');
            }
        };
        $scope.goToMaintenceDetail = function (id) {
            $location.path('/maintance_detail/' + id);
        }
        // cancel agreement creation
        $scope.cancelAgreementCreation = function (agreement, images) {
            swal({
                title: "Are you sure?",
                text: "You want to Cancel this agreement?",
                // text: "You want to create this agreement as a draft?",
                // imageUrl: '/assets/images/logo_color_blue.png',
                imageUrl: '/assets/images/logo-dark.png',
                imageWidth: 10,
                imageHeight: 10,
                maxHeight: 45,
                showCancelButton: true,
                // confirmButtonColor: "#0099ff",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                imageAlt: 'Custom image',
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        $scope.draftAgreement(agreement, images);
                    } else {
                        $rootScope.navBarOptionSelected = 'Agreements';
                        $localStorage.userData.routeState = 'Agreements';
                        $state.go('agreement_listing');
                        toastr.success('Sucessfully cancelled agreement creation');
                    }
                });
        }

        // cancel agreement creation -bulk upload
        $scope.cancelBulkUpload = function (agreement, images) {
            swal({
                title: "Are you sure?",
                text: "You want to cancel the agreement updation?",
                // imageUrl: '/assets/images/logo_color_blue.png',
                imageUrl: '/assets/images/logo-dark.png',
                imageWidth: 10,
                imageHeight: 10,
                maxHeight: 45,
                showCancelButton: true,
                // confirmButtonColor: "#0099ff",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                imageAlt: 'Custom image',
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        $rootScope.navBarOptionSelected = 'Agreements';
                        $localStorage.userData.routeState = 'Agreements';
                        $location.path('bulk_upload_listing');
                        toastr.success('Sucessfully cancelled agreement updation');
                    }
                });
        }


        // cancel agreement editing 
        $scope.cancelOnEdit = function (agreement, images, agreement_images) {
            swal({
                title: "Are you sure?",
                text: "You want to cancel the edited agreement?",
                // imageUrl: '/assets/images/logo_color_blue.png',
                imageUrl: '/assets/images/logo-dark.png',
                imageWidth: 10,
                imageHeight: 10,
                maxHeight: 45,
                showCancelButton: true,
                // confirmButtonColor: "#0099ff",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                imageAlt: 'Custom image',
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        $rootScope.navBarOptionSelected = 'Agreements';
                        $localStorage.userData.routeState = 'Agreements';
                        $state.go('agreement_listing');
                        toastr.success('Sucessfully cancelled agreement updation');
                    } else {
                        if (agreement.save_as_draft) {
                            $scope.updateAgreementDraft(agreement, images);
                        }
                    }
                });
        }



        /**
         * Function is use to upload on file either on select or drop
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 3-Aug-2017
         */
        $scope.csvUpload = function (file, data, agencyId) {
            Upload.upload({
                url: baseUrl + '/api/importAgreementCSV',
                data: {
                    _id: data,
                    file: file,
                    agency_id: agencyId
                }
            }).then(function (response) {
                if (response.data.code == 200) {
                    $scope.property_id = response.data._id;
                    toastr.success(response.data.message);
                    $location.path('/bulk_upload_listing');
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
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.uploadCsv = function (file) {
            var userId = $localStorage.loggedInUserId;
            var agencyId = $localStorage.userData.agency_id;
            $scope.csvUpload(file, userId, agencyId);
        }
        /**
        * Function is to edit bulk agreement
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        $scope.updateBulkAgreement = function (agreement, images) {
            blockUI.start();
            if ($scope.editAgreementForm.$invalid == false) {
                var obj = {};
                obj = agreement;
                obj.agreement_id = agreement._id;
                obj.rental_period = parseInt(agreement.rental_period);
                obj.rent_bond_price = agreement.rent_bond_price.toString();
                obj.terms = parseInt(agreement.terms);
                obj.created_by = $localStorage.loggedInUserId;
                obj.created_by_role = $localStorage.role_id;
                if ($localStorage.userData.agency_id) {
                    obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                }
                obj.tenants = _.map($scope.newArray2, function (o) { return _.pick(o, '_id'); });

                if (obj.tenancy_start_date == '' || obj.tenancy_start_date == null) {
                    obj.tenancy_start_date = "";
                }
                if (obj.payable_advance_start_on == '' || obj.payable_advance_start_on == null) {
                    obj.payable_advance_start_on = "";
                }
                if (obj.case_validity == '' || obj.case_validity == null) {
                    obj.case_validity = "";
                }

                // if (_.isEmpty(obj.tenancy_start_date) == true) {
                //     obj.tenancy_start_date = "";
                // }
                // if (_.isEmpty(obj.payable_advance_start_on) == true) {
                //     obj.payable_advance_start_on = "";
                // }
                // if (_.isEmpty(obj.case_validity) == true) {
                //     obj.case_validity = "";
                // }
                obj = _.omit(obj, 'images');
                agreementService.editAgreement().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.agreement = {};
                        $scope.newArray2 = [];
                        $scope.owner = {};
                        obj.images = images;
                        $scope.uploadBulkAgreementFiles(obj, response.data._id);
                    } else {
                        toastr.error('Server is busy please try latter');
                        blockUI.stop();
                    }
                });
            } else {
                toastr.error("Please select property for adding the agreement");
                blockUI.stop();
            }
        };
        $scope.allOption = "All";
        var modelScope = {
            "checkboxModel": "checkboxModel",
            "selectedItems": "selectedItems"
        };
        $scope.checkboxModel = [];
        $scope.selectedItems = [];

        $scope.onClickFn = function (val) {
            if (val == $scope.allOption) {
                resultsFnAll();
            }
            else {
                addorRemoveItems(val);
            }
        };
        function addorRemoveItems(val) {
            if ($scope[modelScope.checkboxModel][val]) {
                $scope[modelScope.selectedItems].push(val);
            } else if (!$scope[modelScope.checkboxModel][val]) {
                $scope[modelScope.selectedItems].splice($scope[modelScope.selectedItems].indexOf(val), 1);
            };
            if ($scope[modelScope.selectedItems].length >= ($scope.data.length)) {
                $scope[modelScope.checkboxModel][$scope.allOption] = true;
            } else {
                $scope[modelScope.checkboxModel][$scope.allOption] = false;
            }
        };
        function resultsFnAll() {
            var allVal = $scope[modelScope.checkboxModel][$scope.allOption];
            if (allVal) {
                $scope[modelScope.selectedItems] = angular.copy($scope.data);
                // $scope.custom=true;
            } else {
                $scope[modelScope.selectedItems] = [];
                //$scope.custom=false;
            }
            for (property in $scope["data"]) {
                $scope[modelScope.checkboxModel][$scope["data"][property]] = allVal;
            };
        };
        $scope.checkAll = function (masterCheckData, slaveCheckData) {
            // console.log('masterCheckData', masterCheckData);
            // console.log('slaveCheckData', slaveCheckData);
            if (masterCheckData.checkAll == true) {

            }
            else {

            }
        }
        $scope.uploadAgreement = function (dataToBeUpdated) {
            // console.log('dataToBeUpdated', dataToBeUpdated);
            angular.forEach($scope.selectedItems, function (value, key) {
                // console.log('value', value);
                if (dataToBeUpdated[value].rent_bond_price) {
                    var obj = {};
                    obj = dataToBeUpdated[value];
                    obj.agreement_id = dataToBeUpdated[value]._id;
                    obj.property_id = dataToBeUpdated[value].property_id._id;
                    obj.is_csv_uploade = false;
                    obj.rental_period = parseInt(dataToBeUpdated[value].rental_period);
                    obj.rent_bond_price = dataToBeUpdated[value].rent_bond_price.toString();
                    obj.terms = parseInt(dataToBeUpdated[value].terms);
                    obj.created_by = $localStorage.loggedInUserId;
                    obj.created_by_role = $localStorage.role_id;
                    if ($localStorage.userData.agency_id) {
                        obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                    }
                    obj.tenants = _.map($scope.newArray2, function (o) { return _.pick(o, '_id'); });
                    if (obj.tenancy_start_date == '' || obj.tenancy_start_date == null) {
                        obj.tenancy_start_date = "";
                    }
                    if (obj.payable_advance_start_on == '' || obj.payable_advance_start_on == null) {
                        obj.payable_advance_start_on = "";
                    }
                    if (obj.case_validity == '' || obj.case_validity == null) {
                        obj.case_validity = "";
                    }

                    // if (_.isEmpty(obj.tenancy_start_date) == true) {
                    //     obj.tenancy_start_date = "";
                    // }
                    // if (_.isEmpty(obj.payable_advance_start_on) == true) {
                    //     obj.payable_advance_start_on = "";
                    // }
                    // if (_.isEmpty(obj.case_validity) == true) {
                    //     obj.case_validity = "";
                    // }
                    obj = _.omit(obj, 'images');
                    agreementService.editAgreement().post(obj, function (response) {
                        if (response.code == 200) {
                            $scope.newArray2 = [];
                            $scope.owner = {};
                            toastr.success('Agreement updated successfully');
                            $location.path('/agreement_listing');
                        } else {
                            toastr.error('Server is busy please try latter');
                            blockUI.stop();
                        }
                    });
                } else {
                    toastr.info('Please provide value for rent bond price on agreement id ' + dataToBeUpdated[value].agreement_id);
                }
            });
        }
        $scope.bulkDelete = function (dataToBeUpdated) {
            // console.log('$scope.selectedItems', $scope.selectedItems);
            // console.log('dataToBeUpdated', dataToBeUpdated);
            angular.forEach($scope.selectedItems, function (value, key) {
                var obj = {};
                obj.id = dataToBeUpdated[value]._id;
                blockUI.start();
                agreementService.deleteAgreement().get(obj, function (response) {
                    if (response.code == 200) {
                        toastr.success('Successfully deleted agreement');
                        $scope.agreementBulkAgreementListing();
                        blockUI.stop();
                    } else {
                        toastr.warning('Server is busy');
                        blockUI.stop();
                    }
                });
            });
        }

        /**
          * Function is to open add new tenant modal
          * @access private
          * @return json
          * Created 
          * @smartData Enterprises (I) Ltd
          * Created Date 22-Nov-2017
          */

        $scope.openAddTenant = function (propertyId, agreementId) {
            // console.log("propertyId", propertyId);
            var role = $localStorage.role_id;
            if (role == roleId.agent || role == roleId.ownAgency || role == roleId.owner) {
                var modalInstance = $scope.model = $uibModal.open({
                    animation: false,
                    templateUrl: '/frontend/modules/agreement/views/add_tenant.html',
                    scope: $scope,
                    controller: function ($uibModalInstance, $scope) {
                        $scope.tenant = {};
                        // $scope.tenantAddress = address;
                        // console.log("address",address);
                        // console.log("tenantAddress",$scope.tenantAddress);
                        $scope.ok = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.getAgencyPropertyForTenant = function () {
                            blockUI.start();
                            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                var obj = {};
                                obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
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
                                        } else {
                                            $scope.tenant.property_id = propertyId;
                                            $scope.agreementListing($scope.tenant.property_id);
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
                                toastr.warning("As you are not associated with any agency.So,you are allowed to add any new tenant");
                                $scope.cancel();
                                blockUI.stop();
                            }

                        }
                        $scope.agreementListing = function (id) {
                            blockUI.start();
                            document.body.scrollTop = document.documentElement.scrollTop = 0;
                            var obj = {};
                            if ($localStorage.userData.agency_id) {
                                obj.id = id;
                                TenantService.agreementListInAddTenant().get(obj, function (response) {
                                    if (response.code == 200) {
                                        $scope.agreementList = response.data;
                                        $scope.tenant.agreement_id = agreementId;
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
                        $scope.addTenant = function (tenant, check2, passwordStatus) {
                            blockUI.start();
                            $scope.loginLoading = true;
                            // console.log("tenant", tenant);
                            tenant.passwordStatus = (passwordStatus) ? passwordStatus : false;
                            tenant.mobile_no = parseInt(tenant.mobile_no);
                            tenant.invited_by = $localStorage.loggedInUserId;
                            tenant.agentName = $localStorage.userData.firstname + " " + $localStorage.userData.lastname;
                            tenant.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                            if (check2 == true) {
                                TenantService.newTenant().post(tenant, function (response) {
                                    if (response.code == 200) {
                                        toastr.success('Successfully sent request to tenant');
                                        $scope.loginLoading = false;
                                        $scope.cancel();
                                        blockUI.stop();
                                    } else if (response.code == 201) {
                                        toastr.warning('Already user exists with this email id');
                                        $scope.loginLoading = false;
                                        blockUI.stop();
                                    }
                                });
                            } else {
                                toastr.warning("Please agree to the property Insync terms ");
                                $scope.loginLoading = false;
                                blockUI.stop();
                            }

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
        * Function is maintenance request init function
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        $scope.maintenanceInit = function () {
            // $scope.getTraderList();
        }
        /**
        * Function is to get traders list in maintenace request pop up
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        $scope.getTraderList = function () {
            blockUI.start();
            // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
            $scope.imageUrl = baseUrl + '/user_image/';
            var obj = {};
            obj.user_id = $localStorage.userData._id;
            maintainService.getTraderOptionList().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.traderData = response.data;
                    blockUI.stop();
                } else {
                    $scope.traderData = [];
                    blockUI.stop();
                }
            });
            // } else {
            //     $scope.traderData = [];
            //     blockUI.stop();
            // }
        }

        $scope.category_list = function () {
            userService.getServiceCategoryList().get(function (response) {
                console.log('response :: category list => ', response);
                if (response.code == 200) {
                    $scope.category_listing = response.data;
                }
            });
        }

        /**
        * Function is to open add new tenant modal
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        $scope.openAddMaintenance = function (propertyAddress) {
            // $scope.openAddMaintenance = function (propertyId) {
            // console.log("propertyId   ", propertyId);
            $scope.isAgent = ($localStorage.role_id == roleId.agent) ? true : false;
            $scope.notRequiredTrader = ($scope.isAgent == true) ? true : false;
            var role = $localStorage.role_id;
            // if (role == roleId.agent || role == roleId.owner || role == roleId.tenant) {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/maintenance/views/add.html',
                // templateUrl: '/frontend/modules/agreement/views/maintenance_req.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    // $scope.maintenance = {};
                    // $scope.selected_propertyId = propertyId;
                    // $scope.maintenance.address = propertyAddress;
                    // console.log('$scope.maintenance.address => ', $scope.maintenance.address, propertyAddress);
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
                    $scope.getAgencyPropertyForMaintenance = function () {
                        blockUI.start();
                        var obj = {};
                        obj.user_id = $localStorage.loggedInUserId;
                        // obj.agency_id = $localStorage.loggedInUserId;
                        obj.request_by_role = $localStorage.role_id;

                        if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                            obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                        }
                        $scope.selectedPropertyData = [];
                        // maintainService.getPropertyListing().post(obj, function (response) {
                        //     if (response.code == 200) {
                        //         $scope.propertyList = response.data;
                        //         if ($scope.propertyList.length == 0 && response.data.length == $scope.propertyList.length) {
                        //             $state.go('maintance_listing');
                        //             toastr.warning("You are not associated with any property to add new agreement");
                        //             $scope.cancel();
                        //         } else {
                        //             $scope.maintenance.property_id = propertyId;

                        //             $scope.propertyList.map(function (item) {
                        //                 if (item._id == $scope.maintenance.property_id) {
                        //                     $scope.selectedPropertyData = item;
                        //                 }
                        //             });
                        //             $scope.get_default_watchers($scope.selectedPropertyData);
                        //         }
                        //         blockUI.stop();
                        //     } else {
                        //         $state.go('maintance_listing');
                        //         toastr.warning("You are not associated with any property to add new agreement");
                        //         blockUI.stop();
                        //         $scope.cancel();
                        //     }
                        // });
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
                    $scope.onSelect = function ($item, $model, $label) {
                        $scope.maintenance.trader_id = $item._id;
                        $model = $item._id;
                    };

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
                        user_obj.user_id = property_data.created_by;
                        userService.getUserActiveRole().post(user_obj, function (response) {
                            if (response.code == 200) {
                                $scope.roleInformation = response.data;
                                $scope.roleInformation.map(function (item) {
                                    if (item.role_id && item.role_id._id) {
                                        if (item.role_id._id == roleId.agent) {
                                            $scope.newArray3.push({ "_id": property_data.created_by });
                                        }
                                    }
                                });
                            }
                        });
                        $scope.getPropertyAgreement(property_data._id);
                    }

                    $scope.saveMaintenanceRequest = function (data, date) {
                        if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                            blockUI.start();
                            $scope.loginLoading = true;
                            if ($scope.createMaintenanceForm.$invalid == false) {
                                var obj = {};
                                obj = data;
                                obj.created_by = $localStorage.loggedInUserId;
                                obj.created_by_role = $localStorage.role_id;
                                obj.forwarded_by = $scope.forwardId;
                                obj.budget = parseInt(obj.budget);
                                obj.due_date = date;
                                if (($localStorage.userData.agency_id).hasOwnProperty('_id') == true && $localStorage.userData.agency_id && $localStorage.userData.agency_id._id) {
                                    obj.agency_id = $localStorage.userData.agency_id._id;
                                } else {
                                    obj.agency_id = $localStorage.userData.agency_id;
                                }
                                $scope.getPropertyAgreement(data.property_id);
                                obj.watchers_list = _.map($scope.newArray2, function (o) { return _.pick(o, '_id'); });
                                $scope.watchers_list = obj.watchers_list.concat($scope.newArray3);
                                obj.watchers_list = $scope.watchers_list;

                                // if ((obj.watchers_list).length == $scope.newArray2.length) {
                                var images = obj.images
                                obj.images = [];
                                maintainService.addMaintenance().post(obj, function (response) {
                                    if (response.code == 200) {
                                        if ($localStorage.loggedInUserId) {
                                            socket.emit("addMaintenanceUsers", {
                                                id: $localStorage.loggedInUserId,
                                                maintenanceId: response.data._id,
                                                firstName: $localStorage.loggedInfirstname,
                                                lastName: $localStorage.loggedInlastname
                                            });
                                            var message = {
                                                from: $localStorage.loggedInUserId,
                                                to: response.data._id,
                                                textMsg: 'Sent',
                                                time: $scope.getDate(),
                                                maintenanceId: response.data._id,
                                                is_status: true
                                            }
                                            // $scope.chat.generalMsg = "";
                                            socket.emit('maintenanceGroupMessageSent', message);
                                        }

                                        obj.images = images;
                                        $scope.uploadFiles(obj, response.data._id);
                                        $scope.loginLoading = false;
                                        blockUI.stop();
                                    } else {
                                        $scope.traderList = [];
                                        $scope.loginLoading = false;
                                        blockUI.stop();
                                    }
                                });
                                // }
                                blockUI.stop();
                            } else {
                                toastr.error("Please fill the form completely");
                                blockUI.stop();
                            }
                        } else {
                            toastr.error("First associate yourself with any agency");
                        }
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
                                            $scope.getAgreementDetail();
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
                            $scope.getAgreementDetail();
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

                    $scope.addressInitialize = function () {
                        // $scope.maintenance.latitude = parseFloat(angular.element("#latitude").val());
                        // $scope.maintenance.longitude = parseFloat(angular.element("#longitude").val());
                        // $scope.getTraders();
                        const input = document.getElementById("address1");
                        const autocomplete = new google.maps.places.Autocomplete(input);
                        autocomplete.addListener("place_changed", () => {
                            console.log('event called => ');
                            const place = autocomplete.getPlace();
                            console.log('place =====================> ', place);
                            if (!place.geometry) {
                                // User entered the name of a Place that was not suggested and
                                // pressed the Enter key, or the Place Details request failed.
                                window.alert("No details available for input: '" + place.name + "'");
                                return;
                            }
                            if (place.formatted_address) {
                                $scope.maintenance.address = place.formatted_address;
                            }
                            if (place.geometry.location) {
                                $scope.maintenance.latitude = place.geometry.location.lat();
                                $scope.maintenance.longitude = place.geometry.location.lng();
                            }
                            $scope.getTraders();
                        });
                    }

                    $scope.getTraders = function () {
                        console.log("getTraders    focus  ", $scope.maintenance);
                        // && $scope.maintenance.category_id 
                        // && $scope.maintenance.category_id != ''
                        console.log('scope.maintenance.address => ', $scope.maintenance.address);
                        if ($scope.maintenance.address && $scope.maintenance.address != '' && $scope.maintenance.request_type == 0) {
                            $scope.showTraderSearch = true;
                            var obj = {};
                            if ($scope.maintenance.address && $scope.maintenance.address != '')
                                obj.address = $scope.maintenance.address;
                            if ($scope.maintenance.category_id && $scope.maintenance.category_id != '')
                                obj.categories_id = $scope.maintenance.category_id;

                            if (obj) {
                                maintainService.provious_existing_traders().post(obj, function (response) {
                                    if (response.code == 200 && response.data) {
                                        $scope.traderData = response.data;
                                        console.log("$scope.traderData   ", $scope.traderData);
                                    }
                                });
                            }
                            var obj1 = {
                                "user_id": $localStorage.loggedInUserId
                            };
                            if ($scope.maintenance.category_id && $scope.maintenance.category_id != '')
                                obj1.categories_id = $scope.maintenance.category_id;
                            maintainService.getSavedTradersList().post(obj1, function (response) {
                                if (response.code == 200) {
                                    $scope.traders = response.data;
                                    console.log('response.data :: saved traders => ', response.data);
                                }
                                blockUI.stop();
                            });
                        }
                    }

                    $scope.debounce = function (func, wait, immediate) {
                        var timeout;
                        return function () {
                            var context = this,
                                args = arguments;
                            var callNow = immediate && !timeout;
                            clearTimeout(timeout);
                            timeout = setTimeout(function () {
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
                    $scope.searchTextbox = $scope.debounce($scope.callAPI, 1000)

                    $scope.addMR = function (data) {
                        // console.log(data);
                        // if ($localStorage.role_id != roleId.trader) {
                        // if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                        console.log('$scope.createMaintenanceForm => ', $scope.createMaintenanceForm);
                        console.log('$scope.createMaintenanceForm.$invalid', $scope.createMaintenanceForm.$invalid);
                        if ($scope.createMaintenanceForm.$invalid == false) {
                            $scope.loginLoading = true;
                            var obj = {};
                            obj = data;
                            obj.email = $localStorage.userData.email;
                            console.log("obj.email  ", obj.email);
                            obj.budget = (obj.budget > 0) ? obj.budget : 0;
                            obj.created_by = $localStorage.loggedInUserId;
                            obj.created_by_role = $localStorage.role_id;
                            obj.forwarded_by = $scope.forwardId;
                            obj.budget = parseInt(obj.budget);
                            obj.request_type = parseInt(data.request_type);

                            if (obj.request_type == 1) {
                                delete $scope.maintenance.trader_id;
                            }
                            // obj.due_date = new Date(data.due_date);

                            if (data.dt != "") {
                                obj.due_date = new Date(data.dt);
                            }
                            else {
                                obj.due_date = ' ';
                            }
                            if ($localStorage.userData.agency_id && ($localStorage.userData.agency_id).hasOwnProperty('_id') == true) {
                                obj.agency_id = $localStorage.userData.agency_id._id;
                            } else {
                                obj.agency_id = $localStorage.userData.agency_id;
                            }

                            // removed
                            // $scope.getPropertyAgreement(data.property_id);
                            // removed

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
                            console.log('obj :: add mr => ', obj);
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
                        // } else {
                        //     toastr.warning("You do not have access permission");
                        // }
                    };

                    $scope.isTaderPickFromSave = false;
                    // $scope.traders = [];
                    $scope.selectTraderFromSaved = function () {
                        console.log("called");
                        // blockUI.start();
                        $scope.isTaderPickFromSave = ($scope.isTaderPickFromSave == false) ? true : false;
                        // if ($scope.isTaderPickFromSave) {
                        //     var obj = {
                        //         "user_id": $localStorage.loggedInUserId
                        //     };
                        //     maintainService.traderList().post(obj, function (response) {
                        //         if (response.code == 200) {
                        //             $scope.traders = response.data;
                        //         }
                        //         blockUI.stop();
                        //     });
                        // } else {
                        //     blockUI.stop();
                        // }

                        if ($scope.isTaderPickFromSave) {
                            var obj = {
                                "user_id": $localStorage.loggedInUserId
                            };
                            maintainService.getSavedTradersList().post(obj, function (response) {
                                if (response.code == 200) {
                                    $scope.traders = response.data;
                                    console.log('response.data :: saved traders => ', response.data);
                                }
                                blockUI.stop();
                            });
                        } else {
                            blockUI.stop();
                        }

                    }

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
                        startingDay: 1,
                        showWeeks: false
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
            // } else {
            //     toastr.warning("You do not have access permission");
            //     blockUI.stop();
            // }
        };

        /**
        * Function is to initialize the variables - add maintenance 
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        $scope.maintenanceInitialize = function () {
            $scope.maintenance = {};
            $scope.newArray2 = [];
        }
        /**
               * Function is to get the watchers
               * @access private
               * @return json
               * Created 
               * @smartData Enterprises (I) Ltd
               * Created 
               */
        $scope.watcherInfo = function () {
            blockUI.start();
            var obj1 = {};
            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                obj1.id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
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
            }
            blockUI.stop();
        }
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
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(),
            startingDay: 1,
            showWeeks: false
        };

        $scope.dateOptions2 = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(),
            startingDay: 1,
            showWeeks: false
        };


        $scope.dateOptionsPayable = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };


        $scope.popupEnd = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        $scope.popup3 = {
            opened: false
        };

        $scope.popupPay = {
            opened: false
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

        // $scope.open1 = function () {
        //     $scope.popup1.opened = true;
        // };

        $scope.open2 = function () {
            $rootScope.createDate = true;
            $scope.popup2.opened = true;
        };
        $scope.open3 = function () {
            $scope.popup3.opened = true;
        };
        $scope.openEndDate = function () {
            $rootScope.endDate = true;
            $scope.popupEnd.opened = true;
        };
        $scope.openPayable = function () {
            //$rootScope.payDt = true;
            $scope.popupPay.opened = true;
        };

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        // $scope.popup1 = {
        //     opened: false
        // };
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
        // calender code ends here

        /**
                * Function is to sort the agreement 
                * @access private
                * @return json
                * Created 
                * @smartData Enterprises (I) Ltd
                * Created Date 
               */
        $scope.orderProperty = "rent_price";

        $scope.setOrderProperty = function (sortBy) {
            $scope.orderProperty = sortBy;
            if (sortBy == 'rent_price') {
                $scope.filterMatch = "Rent Price";
            } else if (sortBy == 'tenancy_start_date') {
                $scope.filterMatch = "Tenancy start Date";
            } else {
                $scope.filterMatch = "Agreement Id";
            }
        }

        $scope.agreementTermChanged = function (terms, startdt) {
            if (startdt) {
                $scope.dateOptions2.minDate = new Date(startdt);
                console.log(' $scope.dateOptions2.minDate  => ', $scope.dateOptions2.minDate);
            }
            if (terms && startdt) {
                if (terms == "1") {
                    var date = moment(startdt).add(6, "months");
                    $scope.dateOptions2.minDate = new Date(date);
                    $scope.agreement.case_validity = new Date(date);

                } else {
                    var date = moment(startdt).add(12, "months");
                    $scope.dateOptions2.minDate = new Date(date);
                    $scope.agreement.case_validity = new Date(date);
                }
                var maxPayDate = moment(startdt).add(10, "days");
                var minPayDate = moment(startdt).subtract(10, "days");
                $scope.dateOptionsPayable.maxDate = new Date(maxPayDate);
                $scope.dateOptionsPayable.minDate = new Date(minPayDate);
            }
        }
        $scope.goToOwnerProfile = function (id) {
            $localStorage.userData.routeState = "";
            $rootScope.navBarOptionSelected = "";
            $location.path('/owner_profile/' + id);

        }
        $scope.goToTenantProfile = function (id) {
            $localStorage.userData.routeState = "tenants_listing";
            $rootScope.navBarOptionSelected = "tenants_listing";
            $location.path('/tenant_profile/' + id);

        }
        $scope.tenancyInclusionLimit = function (limit) {
            if (limit && limit == 1000) {
                toastr.error("Max 1000 characters are allowed in Tenancy inclusions field");
            }

        }
        // get rental bond value 
        $scope.getBondValidationValue = function (amt, term, rent) {
            if (amt && term == "1") {
                $scope.maxBondPrice = amt;
                if (rent) {
                    $scope.checkBondValue(rent);
                }
            } else if (amt && term == "2") {
                $scope.maxBondPrice = Math.ceil(amt / 12);
                if (rent) {
                    $scope.checkBondValue(rent);
                }
            }
        }

        //check rent bond with maxBondPrice allowed price
        $scope.checkBondValue = function (value) {
            if (value && parseInt(value) > $scope.maxBondPrice) {
                $scope.bondError = true;
            } else {
                $scope.bondError = false;
            }

        }

        /**
        * Function is used to open refine search panel
        * @access private
        * @return json
        * Created by 
        * @smartData Enterprises (I) Ltd
        * Created Date 11-Dec-2017
        */
        $scope.openRefineSearch = function () {
            $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
            // console.log('called',$scope.advanceSearchClass);
        }
        $scope.showPopup = function () {
            angular.element('#agrementSearchPopUp').show();
        }
        $scope.hideSearchFilter = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            angular.element('#agrementSearchPopUp').hide();
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
            $scope.searchAgree.rent_price = '';
            $scope.searchAgree.agreement_id = '';
            $scope.searchAgree.terms = '';
            $scope.agreementListing();
            $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
        }
        $scope.agreementSearch = function (search) {

            document.body.scrollTop = document.documentElement.scrollTop = 0;
            var obj = {};
            // if ($localStorage.userData.agency_id) {
            if ($localStorage.userData.agency_id) {
                obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            obj.created_by = $localStorage.loggedInUserId;
            obj.request_by_role = $localStorage.role_id;
            obj.rent_price = search.rent_price;
            obj.agreement_id = search.agreement_id;
            obj.terms = search.terms;
            $scope.isSearchedAgreement = true;
            angular.element('#agrementSearchPopUp').hide();
            agreementService.agreementListing().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.agreementList = response.data;
                    angular.forEach($scope.agreementList, function (value, key) {
                        if (value.tenancy_start_date == '' || value.tenancy_start_date == null) {
                            value.tenancy_start_date = "";
                        }
                        if (value.payable_advance_start_on == '' || value.payable_advance_start_on == null) {
                            value.payable_advance_start_on = "";
                        }
                        if (value.case_validity == '' || value.case_validity == null) {
                            value.case_validity = "";
                        }

                        // if (_.isEmpty(value.tenancy_start_date) == true) {
                        //     value.tenancy_start_date = "";
                        // }
                        // if (_.isEmpty(value.payable_advance_start_on) == true) {
                        //     value.payable_advance_start_on = "";
                        // }
                        // if (_.isEmpty(value.case_validity) == true) {
                        //     value.case_validity = "";
                        // }
                        if (value.case_validity) {
                            var diff1 = moment(value.case_validity).format("YYYY MM DD");
                            var difference = moment(diff1).diff(moment($scope.TodayDate), 'days');
                            if (difference > 0) {
                                value.case_valid = true;
                            } else {
                                value.case_valid = false;
                            }
                        }
                    });
                    blockUI.stop();
                } else {
                    $scope.agreementList = [];
                    blockUI.stop();
                }

            });
        }

        $scope.getAllTenantFromDatabase = function () {
            var obj = {};
            if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
                blockUI.start();
                obj.page_number = '';
                obj.number_of_pages = '';
                obj.user_id = $localStorage.loggedInUserId;
                TenantService.tenantDatabaseList().post(obj, function (response) {
                    $scope.isSearchedTenant = false;
                    $scope.tenantMsg = " ";
                    if (response.code == 200) {
                        $scope.tenantMsg = " ";
                        $scope.tenantList = response.data;
                        // $scope.newArray2 = response.data;
                        // console.log('$scope.tenantList');
                        // console.log($scope.tenantList);
                        blockUI.stop();
                    } else {
                        $scope.tenantList = [];
                        $scope.newArray2 = [];
                        blockUI.stop();
                    }
                });
            } else {
                $scope.tenantList = [];
                blockUI.stop();
            }
        }

        $scope.getMyAgents = function () {
            let obj = {
                agency_id: ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id
            }
            agreementService.getMyAgentList().post(obj, function (response) {
                console.log('response :: my agents list => ', response);
                if (response.code == 200) {
                    $scope.myAgentsList = response.data;
                } else {
                    $scope.myAgentsList = [];
                    blockUI.stop();
                }
            });
        }

        $scope.scrollTo = function (id) {
            $location.hash(id);
            // console.log($location.hash());
            $anchorScroll();
        };

    }
}());