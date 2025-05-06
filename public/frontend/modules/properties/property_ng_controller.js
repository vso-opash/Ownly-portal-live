/**
 * Super Angular Controller
 * @author Ankur A
 * @created 10 August
 */
(function () {
    angular.module('SYNC')
        .controller("PropertyCtrl", PropertyCtrl);
    PropertyCtrl.$inject = [
        '$state',
        '$scope',
        '$localStorage',
        '$rootScope',
        '$uibModal',
        //'$timeout',
        'Upload',
        '$http',
        '$filter',
        '$window',
        '$location',
        '$stateParams',
        'Crud',
        'SweetAlert',
        'permissions',
        'localStorageService',
        'APP_CONST',
        'Flash',
        'PropertyService',
        'userService',
        'toastr',
        'blockUI',
        'FileUploader',
        'blockUIConfig'
    ];

    function PropertyCtrl($state, $scope, $localStorage, $rootScope, $uibModal, Upload, $http, $filter, $window, $location, $stateParams, Crud, SweetAlert, permissions, localStorageService, APP_CONST, Flash, PropertyService, userService, toastr, blockUI, FileUploader, blockUIConfig) {
        // console.log("$localStorage   ", $localStorage.loggedInfirstname);
        $scope.loggedIn = $localStorage.loggedInUserId;
        $scope.isAgentOwnerAgency = ($localStorage.role_id == roleId.agent || $localStorage.role_id == roleId.ownAgency || $localStorage.role_id == roleId.owner) ? true : false;
        $scope.isOwner = ($localStorage.role_id == roleId.owner) ? true : false;
        $scope.isAgentAgency = ($localStorage.role_id == roleId.agent || $localStorage.role_id == roleId.ownAgency) ? true : false;
        $scope.isSearchedProperty = false;
        $scope.baseUrl = baseUrl;
        $scope.$emit('$tinymce:refresh');
        $scope.userActiveRoleId = $localStorage.role_id;
        $scope.tenant = roleId.tenant;
        $scope.setImageasFeatured = 0;
        $scope.logged_in_agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id
        $scope.display_occupants_section1 = 0;
        $scope.display_vehicles_section1 = 0;
        $scope.display_pets_section1 = 0;
        $scope.agent_specific_questions_list = agent_specific_questions;
        $scope.lastSelected = false;
        $scope.active_class = '';
        /* Rating section start from here */
        $scope.rate = 5;
        $scope.max = 5;
        $scope.user = [];
        $scope.property = {};
        $scope.filterMatch = 'By best match';
        $scope.isReadonly = false;
        $scope.fileImageUrl = baseUrl + '/document/';
        $scope.hoveringOver = function (value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };
        $scope.todayDate = new moment().format();
        $scope.applicationData = {};
        $scope.weekdays_list = weekdays;
        $scope.day_options_list = day_options;
        $scope.age_groups_list = age_groups;
        $scope.age_number_list = age_numbers;
        $scope.relationships_list = relationships;
        $scope.vehicle_types_list = vehicle_types;
        $scope.pet_types_list = pet_types;
        $scope.filePopup = [false];
        $scope.docs_arr = [];
        $scope.choosenFiles = [];

        $scope.send_agents = [];

        var created_by;
        $scope.ratingStates = [
            { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
            { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' }
        ];
        $scope.propertyId;
        //tiny mce options configuration
        $scope.tinymceOptions = {
            resize: false,
            menubar: false,
            plugins: "placeholder",
            // plugins: [
            //     "advlist autolink lists link image charmap print preview anchor",
            //     "searchreplace visualblocks code fullscreen",
            //     "insertdatetime media table  paste "
            // ]
            toolbar: " undo redo | styleselect | bold italic | alignleft aligncenter      alignright alignjustify | bullist numlist outdent indent"

        };
        $scope.reInitializeTinymce = function () {
            $scope.tinymceOptions = {
                resize: false,
                menubar: false,
                plugins: "placeholder",
                toolbar: " undo redo | styleselect | bold italic | alignleft aligncenter      alignright alignjustify | bullist numlist outdent indent"

            };
        }();
        /* Rating section start from here */
        /**
         * Function is use to intialize controller variables
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 20-Nov-2017
         */
        $scope.property = {
            //amenities: [],
            files: [{ "$ngfName": "", "$ngfBlobUrl": "" }],
            images: ''
        };
        $scope.pagination = {
            current: 1
        };
        $scope.selected = 1;
        $scope.propertyDetails = [];
        $scope.propertyList = [];
        $scope.applicant_list = [];
        $rootScope.navBarOptionSelected = 'Properties';
        var image = ['assets/images/default_img.png'];
        $scope.amenitiesList = [];
        $scope.imageUrl = baseUrl + '/property_image/';
        $scope.createrImageUrl = baseUrl + '/user_image/';
        $scope.listView = true;
        $rootScope.grideView = false;
        $scope.oneLineDescription = true;
        $scope.fullDescription = false;
        $scope.showMore = true;
        $scope.showLess = false;
        $scope.agencyCode = roleId.ownAgency;
        $scope.agentCode = roleId.agent;
        $scope.roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
        $scope.initialize = function () {

            $scope.advanceSearchClass = "dropdown default-oder droplist";
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.firstTabContent = "tab-pane active";
            $scope.secondTabContent = "tab-pane";
            $scope.thirdTabContent = "tab-pane";
            $scope.fourthTabContent = "tab-pane";
            $scope.progressBarWidthStyle = {
                "width": "13%"
            };
            $scope.navPillsLiFirstClass = "active";
            $scope.navPillsLiSecondClass = "";
            $scope.navPillsLiThirdClass = "";
            $scope.navPillsLiFourthClass = "";
            $scope.propertyType = constant_info.property_type;
            $scope.propertyCategory = constant_info.property_category;

            // $scope.moveToAppEighthStep();
            $scope.AppfirstTabContent = "tab-pane active";
            $scope.AppsecondTabContent = "tab-pane";
            $scope.AppthirdTabContent = "tab-pane";
            $scope.AppfourthTabContent = "tab-pane";
            $scope.AppfifthTabContent = "tab-pane";
            $scope.AppsixthTabContent = "tab-pane";
            $scope.AppseventhTabContent = "tab-pane";
            $scope.AppeightTabContent = "tab-pane";

            $scope.AppprogressBarWidthStyle = {
                "width": "13%"
            };
            $scope.AppnavPillsLiFirstClass = "active";
            $scope.AppnavPillsLiSecondClass = "";
            $scope.AppnavPillsLiThirdClass = "";
            $scope.AppnavPillsLiFourthClass = "";
            $scope.AppnavPillsLiFifthClass = "";
            $scope.AppnavPillsLiSixthClass = "";
            $scope.AppnavPillsLiSeventhClass = "";

            $scope.usersList = constant_info.users;
            $scope.property.files = image;

            if ($scope.isOwner) {
                $scope.property.owned_by = $localStorage.loggedInUserId;
            }

            $scope.getAmenities();
            $rootScope.getPropertyOwner();
            $scope.getPropertyDetails();
            $scope.getUserDetails();
            $scope.getDocumentList();
        };

        // $scope.$watch('property.files[0]', function (newValue, oldValue) {
        //     console.log("Watch called : ",newValue, oldValue);
        //     if (newValue && newValue == "assets/images/default_img.png") {
        //         $scope.lastSelected = false;
        //     } else {
        //         $scope.lastSelected = 'upload';
        //     }
        // });

        $scope.$watch('lastSelected', function (newval, oldval) {
            // console.log("Last selected change : ", newval, oldval);
        });

        $scope.listingInitialize = function () {
            $scope.advanceSearchClass = "dropdown default-oder droplist";
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.firstTabContent = "tab-pane active";
            $scope.secondTabContent = "tab-pane";
            $scope.thirdTabContent = "tab-pane";
            $scope.fourthTabContent = "tab-pane";
            $scope.progressBarWidthStyle = {
                "width": "13%"
            };
            $scope.navPillsLiFirstClass = "active";
            $scope.navPillsLiSecondClass = "";
            $scope.navPillsLiThirdClass = "";
            $scope.navPillsLiFourthClass = "";
            $scope.propertyType = constant_info.property_type;
            $scope.usersList = constant_info.users
            $scope.property.files = image;
            $scope.getAmenities();
            //$rootScope.getPropertyOwner();
            $scope.getPropertyDetails();
            if ($rootScope.isGride == true) {
                $scope.listView = false;
                $rootScope.grideView = true;
            }
        };
        $scope.createPropertyInitialize = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.property.number_bedroom = 0;
            $scope.property.number_of_bathroom = 0;
            $scope.property.number_of_parking = 0;
            $scope.property.floor_area = 0;
            $scope.property.lot_erea = 0;
            if ($scope.isOwner) {
                $scope.property.owned_by = $localStorage.loggedInUserId;
            }
        }
        $scope.RemovePhotoFromMyFiles = function (index) {
            //Find the record using Index from Array.
            var name = $scope.choosenFiles[index];
            $scope.choosenFiles.splice(index, 1);
            $scope.user.splice(index, 1);
            if ($scope.choosenFiles.length == 0) {
                $scope.choosenFiles = [];
                $scope.user = [];
            }
        };
        /**
         * Function is used to move to first step
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.property = {};
        $scope.moveToFirstStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.createPropertyStepTwo.$setUntouched();
            $scope.createPropertyStepOne.$setUntouched();
            $scope.property.files = image;
            $scope.firstTabContent = "tab-pane active";
            $scope.secondTabContent = "tab-pane";
            $scope.thirdTabContent = "tab-pane";
            $scope.fourthTabContent = "tab-pane";
            $scope.progressBarWidthStyle = {
                "width": "13%"
            };
            $scope.navPillsLiFirstClass = "active";
            $scope.navPillsLiSecondClass = "";
            $scope.navPillsLiThirdClass = "";
            $scope.navPillsLiFourthClass = "";
        };
        /**
         * Function is used to move to second step
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.moveToSecondStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.firstTabContent = "tab-pane";
            $scope.secondTabContent = "tab-pane active";
            $scope.thirdTabContent = "tab-pane";
            $scope.fourthTabContent = "tab-pane";
            $scope.progressBarWidthStyle = {
                "width": "36%"
            };
            $scope.navPillsLiFirstClass = "active";
            $scope.navPillsLiSecondClass = "active";
            $scope.navPillsLiThirdClass = "";
            $scope.navPillsLiFourthClass = "";

        };

        $scope.checkFileSize = function () {
            if ($scope.createPropertyStepTwo.file && $scope.createPropertyStepTwo.file.$error.maxSize == true) {
                $scope.createPropertyStepTwo.file.$error.maxSize = false;
            }
            $scope.lastSelected = 'upload';
        }
        $scope.checkMaxFileSize = function () {
            if ($scope.createPropertyStepTwo.file1.$error.maxSize == true) {
                $scope.createPropertyStepTwo.file1.$error.maxSize = false;
            }

        }
        /**
         * Function is used to move to third step
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.moveToThirdStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.firstTabContent = "tab-pane";
            $scope.secondTabContent = "tab-pane";
            $scope.thirdTabContent = "tab-pane active";
            $scope.fourthTabContent = "tab-pane";
            $scope.progressBarWidthStyle = {
                "width": "60%"
            };
            $scope.navPillsLiFirstClass = "active";
            $scope.navPillsLiSecondClass = "active";
            $scope.navPillsLiThirdClass = "active";
            $scope.navPillsLiFourthClass = "";
        };
        $scope.showPropertyLocation = function (id) {
            $location.path('/property_location/' + id);
        }
        /**
         * Function is used to create property
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.createProperty = function (propertyData) {
            $scope.loginLoading = true;
            //console.log("propertyData",propertyData);
            propertyData.created_by = $localStorage.loggedInUserId;
            propertyData.floor_area = (propertyData.floor_area) ? propertyData.floor_area : '0';
            propertyData.floor_area = parseInt(propertyData.floor_area);
            propertyData.number_of_parking = (propertyData.number_of_parking) ? propertyData.number_of_parking : '0';
            propertyData.lot_erea = (propertyData.lot_erea) ? propertyData.lot_erea : '0';
            propertyData.number_of_bathroom = (propertyData.number_of_bathroom) ? propertyData.number_of_bathroom : '0';
            propertyData.number_bedroom = (propertyData.number_bedroom) ? propertyData.number_bedroom : '0';
            propertyData.number_of_townhouse = (propertyData.number_of_townhouse) ? propertyData.number_of_townhouse : '0';
            propertyData.lot_erea = parseInt(propertyData.lot_erea);
            propertyData.number_of_bathroom = parseInt(propertyData.number_of_bathroom);
            propertyData.number_bedroom = parseInt(propertyData.number_bedroom);
            propertyData.number_of_townhouse = parseInt(propertyData.number_of_townhouse);
            propertyData.number_of_parking = parseInt(propertyData.number_of_parking);
            // propertyData.isTownHouse = (propertyData.isTownHouse=="1")?false:true;
            var agencyId = '';
            if ($localStorage.userData.agency_id) {
                agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            propertyData.created_by_agency_id = agencyId;
            if ($scope.choosenFiles.length > 0) {
                if ($scope.lastSelected == 'choose') {
                    $scope.choosenFiles.map(function (value, key) {
                        if (key == $scope.setImageasFeatured) {
                            $scope.choosenFiles[key].isFeatured = true;
                        } else {
                            $scope.choosenFiles[key].isFeatured = false;
                        }
                    });
                }
                propertyData.image = $scope.choosenFiles;
            }
            if (!propertyData.created_by_agency_id) {
                delete propertyData.created_by_agency_id;
            }
            PropertyService.createProperty().post(propertyData, function (response) {
                if (response.code == 200) {
                    $scope.propertyId = response.data._id;
                    $scope.property.owned_by = undefined;
                    toastr.success(response.message);
                    if ($scope.choosenFiles.length == 0 || propertyData.files) {
                        $scope.property = {};
                        $scope.upload(propertyData.files, response.data._id);
                        $scope.moveToFourthStep();
                        $scope.loginLoading = false;
                    } else {
                        $scope.moveToFourthStep();
                        $scope.loginLoading = false;
                    }

                } else {
                    toastr.warning('Server busy please try again latter');
                    $scope.loginLoading = false;
                }
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
            $scope.csvUpload(file, userId);
        }
        $scope.sortText = '';
        $scope.filterBy = function (sortBy) {
            $scope.sortText = sortBy;
            if (sortBy == 'name') {
                $scope.filterMatch = 'Name';
            } else if (sortBy == 'city') {
                $scope.filterMatch = 'City';
            } else {
                $scope.filterMatch = 'Address';
            }
        }
        $scope.dateStatus = false;
        $scope.date = moment().format('YYYY-MM-DD');
        $scope.checkDueDate = function (date) {
            var toDay = moment();
            var date = moment(date);
            if (date >= toDay) {
                $scope.dateStatus = true;
            } else {
                $scope.dateStatus = false;
            }
        };
        /**
         * Function is use to upload on file either on select or drop
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 3-Aug-2017
         */
        $scope.csvUpload = function (file, data) {
            var agency_id;
            if ($localStorage.userData.agency_id) {
                agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            Upload.upload({
                url: baseUrl + '/api/importPropertyByCSV',
                data: {
                    _id: data,
                    agency_id: agency_id,
                    file: file,
                }
            }).then(function (response) {
                if (response.data.code == 200) {
                    $scope.property_id = response.data._id;
                    toastr.success(response.data.message);
                    $scope.getPropertyListing();
                } else {
                    toastr.error(response.data.message);
                }
            }, null, function (evt) {
                $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            });
        };
        /**
         * Function is use to upload on file either on select or drop
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 3-Aug-2017
         */
        $scope.upload = function (files, data) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        // console.log(this.lastSelected + " == " + $scope.featuredFlag + " == " + $scope.setImageasFeatured + " == " + i);
                        // if ($scope.featuredFlag == 'upload' && $scope.setImageasFeatured == i && $scope.lastSelected == 'upload') {
                        if (this.lastSelected == 'upload' && $scope.featuredFlag == 'upload' && $scope.setImageasFeatured == i) {
                            Upload.upload({
                                url: baseUrl + '/api/createPropertyImage',
                                data: {
                                    _id: data,
                                    file: file,
                                    isFeatured: true
                                }
                            }).then(function (response) {
                                if (response.status == 200) {
                                    $scope.property_id = response.data._id;
                                    // toastr.success('Property created Successfully');
                                } else {
                                    toastr.error($scope.errorMsg = response.message + ': missing field ' + response.paramName);
                                }
                            }, null, function (evt) {
                                $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                            });
                        } else {
                            Upload.upload({
                                url: baseUrl + '/api/createPropertyImage',
                                data: {
                                    _id: data,
                                    file: file,
                                }
                            }).then(function (response) {
                                if (response.status == 200) {
                                    $scope.property_id = response.data._id;
                                    // toastr.success('Property created Successfully');
                                } else {
                                    toastr.error($scope.errorMsg = response.message + ': missing field ' + response.paramName);
                                }
                            }, null, function (evt) {
                                $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                            });
                        }
                    }
                }
            }
        };
        /**
         * Function is used to move to fourth step
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.moveToFourthStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.firstTabContent = "tab-pane";
            $scope.secondTabContent = "tab-pane";
            $scope.thirdTabContent = "tab-pane";
            $scope.fourthTabContent = "tab-pane active";
            $scope.progressBarWidthStyle = {
                "width": "96%"
            };
            $scope.navPillsLiFirstClass = "active";
            $scope.navPillsLiSecondClass = "active";
            $scope.navPillsLiThirdClass = "active";
            $scope.navPillsLiFourthClass = "active";
        };
        /**
         * Function is used to save the property on draft
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.saveAsDraft = function (propertyData) {
            $scope.loginLoading = true;
            var postData = {};
            propertyData.floor_area = (propertyData.floor_area) ? propertyData.floor_area : '0';
            propertyData.floor_area = parseInt(propertyData.floor_area);
            propertyData.number_of_parking = (propertyData.number_of_parking) ? propertyData.number_of_parking : '0';
            propertyData.lot_erea = (propertyData.lot_erea) ? propertyData.lot_erea : '0';
            propertyData.number_of_bathroom = (propertyData.number_of_bathroom) ? propertyData.number_of_bathroom : '0';
            propertyData.number_bedroom = (propertyData.number_bedroom) ? propertyData.number_bedroom : '0';
            propertyData.number_of_townhouse = (propertyData.number_of_townhouse) ? propertyData.number_of_townhouse : '0';
            propertyData.lot_erea = parseInt(propertyData.lot_erea);
            propertyData.number_of_bathroom = parseInt(propertyData.number_of_bathroom);
            propertyData.number_bedroom = parseInt(propertyData.number_bedroom);
            propertyData.number_of_townhouse = parseInt(propertyData.number_of_townhouse);
            propertyData.number_of_parking = parseInt(propertyData.number_of_parking);
            if ($localStorage.role_id == roleId.ownAgency) {
                postData = {
                    "created_by": $localStorage.loggedInUserId,
                    "owned_by": propertyData.owned_by,
                    "address": propertyData.address,
                    "property_type": propertyData.property_type,
                    "description": propertyData.description,
                    "created_by_agency_id": ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id
                };
                propertyData.created_by_agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                propertyData.created_by = $localStorage.loggedInUserId;
            } else {
                postData = {
                    "created_by": $localStorage.loggedInUserId,
                    "owned_by": propertyData.owned_by,
                    "address": propertyData.address,
                    "property_type": propertyData.property_type,
                    "description": propertyData.description
                };
                propertyData.created_by = $localStorage.loggedInUserId;
            }
            PropertyService.propertySaveAsDraft().post(propertyData, function (response) {
                if (response.code == 200) {
                    toastr.success(response.message);

                    //$scope.moveToSecondStep();
                    $scope.upload(propertyData.files, response.data._id);
                    $scope.loginLoading = false;
                    $state.go('propertyListing');
                } else {
                    toastr.warning('Server busy please try again latter');
                    $scope.loginLoading = false;
                }
            });
        };
        $scope.property = {
            amenities: [],
            files: [{ "$ngfName": "", "$ngfBlobUrl": "" }],
            images: ''
        };
        $scope.getAmenities = function () {
            PropertyService.getAmenities().get(function (response) {
                // console.log("response.data=======", response.data);
                if (response.code == 200) {
                    $scope.amenitiesList = response.data;
                    angular.forEach($scope.amenitiesList, function (val, index) {
                        $scope.property.amenities.push({ amenity_id: val._id, amenity_name: val.name, is_checked: false });
                    });
                }
            });
        };
        /**
         * Function is use to get the logged in username
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 20-Nov-2017
         */
        $scope.loginUserName = function () {
            $rootScope.userName = $localStorage.loggedInfirstname + " " + $localStorage.loggedInlastname;
            $rootScope.userImage = ($localStorage.userData) ? baseUrl + '/user_image/' + $localStorage.userData.image : '';
        };
        /**
         * Function is use to open modal for add owner
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.openDilogue = function () {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/properties/views/modal.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope, PropertyService) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    var agencyId = '';
                    if ($localStorage.userData.agency_id) {
                        agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                    }
                    $scope.createOwner = function (ownerData) {
                        var postData = {
                            created_by: $localStorage.loggedInUserId,
                            firstname: ownerData.firstname,
                            lastname: ownerData.lastname,
                            email: ownerData.email,
                            mobile_no: ownerData.mobile_no,
                            agency_id: agencyId
                        }
                        PropertyService.createPropertyOwner().post(postData, function (response) {
                            if (response.code == 200) {
                                $scope.ownerList = response.data;
                                toastr.success(response.message);
                                $scope.cancel();
                                $rootScope.getPropertyOwner();
                            } else if (response.code == 201) {
                                toastr.warning(response.message);
                                $scope.cancel();
                            } else {
                                toastr.error('Some internal error occured please try again later');
                                $scope.cancel();
                            }
                        });
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });

        };
        /**
         * Function is use to navigate to add property page
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.goToAddProperty = function () {
            $state.go('createProperty');
        };
        /**
         * Function is use to navigate to property listing page
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 025-Dec-2017
         */
        $scope.gotToPropertyListing = function () {
            $state.go('propertyListing');
        }
        /**
         * Function is use to get property listing
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.getPropertySales = function () {
            blockUI.start();
            var agencyId = '';
            if ($localStorage.userData.agency_id) {
                agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            var userId = $localStorage.loggedInUserId;
            var roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
            var postData = {
                "agency_id": agencyId,
                "request_by_role": roleId,
                "user_id": userId
            };
            PropertyService.getPropertySales().post(postData, function (response) {
                $scope.isSearchedProperty = false;
                if (response.code == 200) {
                    $scope.listingProperty = new Array();
                    $scope.listingProperty = response.data;
                    blockUI.stop();
                } else {
                    blockUI.stop();
                }
            });
        };
        /**
         * Function is use to get property listing
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.getPropertyListing = function () {
            blockUI.start();
            var agencyId = '';
            $scope.sortText = '';
            if ($localStorage.userData.agency_id) {
                agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            var userId = $localStorage.loggedInUserId;
            var roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
            var postData = {
                "request_by_id": $localStorage.loggedInUserId,
                "agency_id": agencyId,
                "request_by_role": roleId,
                "user_id": userId
            };
            PropertyService.getPropertyListing().post(postData, function (response) {
                if (response.code == 200) {
                    $scope.propertyList = new Array();
                    $scope.propertyList = response.data;
                    blockUI.stop();
                } else {
                    blockUI.stop();
                }
            });
        };
        $scope.showPropertyOnMap = function (id) {
            $scope.selected = id;
            blockUI.start();
            var agencyId = '';
            var selectedPropertyId = id;
            if (selectedPropertyId == 1) {
                if ($localStorage.userData.agency_id) {
                    agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                }
                var userId = $localStorage.loggedInUserId;
                var roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
                var postData = {
                    "agency_id": agencyId,
                    "request_by_role": roleId,
                    "user_id": userId
                };
                PropertyService.getPropertyListing().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.propertyList = new Array();
                        $scope.propertyList = response.data;
                        $scope.mapInit(response.data);
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });
            } else if (selectedPropertyId == 2) {
                var userId = $localStorage.loggedInUserId;
                if (userId) {
                    var postData = {
                        "user_id": userId,
                        "fav_status": 1
                    };
                    PropertyService.getFavPropertyListing().post(postData, function (response) {
                        $scope.isSearchedProperty = false;
                        if (response.code == 200) {
                            $scope.propertyList = [];
                            $scope.favPropertyList = new Array();
                            $scope.favPropertyList = response.data;
                            $scope.mapInit(response.data);
                            blockUI.stop();
                        } else {
                            blockUI.stop();
                        }
                    });
                }
            } else if (selectedPropertyId == 3) {
                var agencyId = '';
                if ($localStorage.userData.agency_id) {
                    agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                }
                var userId = $localStorage.loggedInUserId;
                var roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
                var postData = {
                    "agency_id": agencyId,
                    "request_by_role": roleId,
                    "user_id": userId
                };
                PropertyService.getPropertySales().post(postData, function (response) {
                    $scope.isSearchedProperty = false;
                    if (response.code == 200) {
                        $scope.listingProperty = new Array();
                        $scope.listingProperty = response.data;
                        $scope.mapInit(response.data);
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });
            } else if (selectedPropertyId == 4) {
                var postData = {
                    "page_number": "1",
                    "number_of_pages": "2",
                    "user_id": $localStorage.loggedInUserId
                };
                PropertyService.getTenantedProperty().post(postData, function (response) {
                    $scope.isSearchedProperty = false;
                    if (response.code == 200) {
                        $scope.TenantedPropertyList = [];
                        $scope.TenantedPropertyList = response.data;
                        $scope.mapInit(response.data);
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });

            } else if (selectedPropertyId == 5) {
                var postData = {
                    "user_id": $localStorage.loggedInUserId
                }
                PropertyService.getDatabaseProperty().post(postData, function (response) {
                    $scope.isSearchedProperty = false;
                    if (response.code == 200) {
                        $scope.databasePropertyList = [];
                        $scope.databasePropertyList = response.data;
                        $scope.mapInit(response.data);
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });


            }
            blockUI.stop();

        }
        /**
         * Function is use to get property listing
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.getMapPropertyListing = function () {
            blockUI.start();
            var agencyId = '';
            var selectedPropertyId = $stateParams.id;
            if (selectedPropertyId == 1) {
                if ($localStorage.userData.agency_id) {
                    agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                }
                var userId = $localStorage.loggedInUserId;
                var roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
                var postData = {
                    "agency_id": agencyId,
                    "request_by_role": roleId,
                    "user_id": userId
                };
                PropertyService.getPropertyListing().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.propertyList = new Array();
                        $scope.propertyList = response.data;
                        $scope.mapInit(response.data);
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });
            } else if (selectedPropertyId == 2) {
                var userId = $localStorage.loggedInUserId;
                if (userId) {
                    var postData = {
                        "user_id": userId,
                        "fav_status": 1
                    };
                    PropertyService.getFavPropertyListing().post(postData, function (response) {
                        $scope.isSearchedProperty = false;
                        if (response.code == 200) {
                            $scope.propertyList = [];
                            $scope.favPropertyList = new Array();
                            $scope.favPropertyList = response.data;
                            $scope.mapInit(response.data);
                            blockUI.stop();
                        } else {
                            blockUI.stop();
                        }
                    });
                }
            } else if (selectedPropertyId == 3) {
                var agencyId = '';
                if ($localStorage.userData.agency_id) {
                    agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                }
                var userId = $localStorage.loggedInUserId;
                var roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
                var postData = {
                    "agency_id": agencyId,
                    "request_by_role": roleId,
                    "user_id": userId
                };
                PropertyService.getPropertySales().post(postData, function (response) {
                    $scope.isSearchedProperty = false;
                    if (response.code == 200) {
                        $scope.listingProperty = new Array();
                        $scope.listingProperty = response.data;
                        $scope.mapInit(response.data);
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });
            } else if (selectedPropertyId == 4) {
                var agencyId = '';
                if ($localStorage.userData.agency_id) {
                    agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                }
                var userId = $localStorage.loggedInUserId;
                var roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
                var postData = {
                    "agency_id": agencyId,
                    "request_by_role": roleId,
                    "user_id": userId,
                    "page_number": "1",
                    "number_of_pages": "2",
                };
                PropertyService.getTenantedProperty().post(postData, function (response) {
                    $scope.isSearchedProperty = false;
                    if (response.code == 200) {
                        $scope.TenantedPropertyList = [];
                        $scope.TenantedPropertyList = response.data;
                        $scope.mapInit(response.data);
                        // console.log("@@@@@@@@@@@@@@@@@@called");
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });

            } else if (selectedPropertyId == 5) {
                var postData = {
                    "user_id": $localStorage.loggedInUserId
                }
                PropertyService.getDatabaseProperty().post(postData, function (response) {
                    $scope.isSearchedProperty = false;
                    if (response.code == 200) {
                        $scope.databasePropertyList = [];
                        $scope.databasePropertyList = response.data;
                        $scope.mapInit(response.data);
                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });


            }
            blockUI.stop();

        };
        $scope.pageChanged = function (page) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
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
            $rootScope.grideView = false;
            $rootScope.isGride = false;
        };
        /**
         * Function is use to show property list view
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.showListViewLoc = function () {
            $scope.listView = true;
            $rootScope.grideView = false;
            $rootScope.isGride = false;
            $state.go('propertyListing');
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
            $rootScope.grideView = true;
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
            $state.go('propertyListing');
            $scope.showGrideView();
            $rootScope.isGride = true;
        };
        /**
         * Function is use to show property details by id
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.propertyDetails = [];
        $scope.is_creater = false;
        $scope.createrAgency = false;
        $scope.creatorAgencyId;
        $scope.getPropertyDetails = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            blockUI.start();
            var propertyId = $stateParams.id;
            $scope.propertyId = propertyId;
            // console.log("property ID :    ", $scope.propertyId);
            var user_id = $localStorage.loggedInUserId;
            if (propertyId) {
                var postData = {
                    "propertyId": propertyId
                };
                $scope.applicationData.property_id = propertyId;
                PropertyService.getPropertyById().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.propertyDetails = response.data[0];
                        $scope.property = response.data[0];

                        var obj = {};
                        if ($scope.property && $scope.property.created_by_agency_id && $scope.property.created_by_agency_id._id)
                            obj.agency_id = $scope.property.created_by_agency_id._id;
                        PropertyService.getMyAgentList().post(obj, function (response) {
                            if (response && response.data) {
                                angular.forEach(response.data, function (value, key) {
                                    $scope.send_agents.push(value._id);
                                });
                            }
                        });

                        angular.forEach(response.data[0].image, function (value, key) {

                            if (value.isFeatured == true) {
                                $scope.setImageasFeatured = key;
                                $scope.getEditImageIndex = key;
                                $scope.featuredFlag = 'exist';
                            }
                        });
                        // console.log("$scope.setImageasFeatured : " + $scope.setImageasFeatured);
                        if ($localStorage.userData.agency_id) {
                            $scope.creatorAgencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                            if (response.data[0].created_by_agency_id == $scope.creatorAgencyId && $localStorage.role_id == roleId.ownAgency) {
                                $scope.createrAgency = true;
                            }
                        }

                        // console.log("tinyMCE.activeEditor.selection.getContent({format : 'text'})",tinymce.get('mytextarea').getContent($scope.propertyDetails.description));
                        //$scope.property.isTownHouse = ($scope.property.isTownHouse==false)?"1":"2";
                        if (response.data[0].created_by._id == user_id) {
                            $scope.is_creater = true;
                        }
                        if (response.data[0].image.length == 0) {
                            $scope.property.files = image;
                        }

                        PropertyService.getpropertyApplicationByPropertyid().post(postData, function (applicant_response) {
                            if (applicant_response.data)
                                $scope.applicant_list = applicant_response.data;
                        });

                        $scope.mapInit2(response.data[0]);
                        $scope.getTenantName($scope.property._id);
                        $scope.getCreatedByReview($scope.property.created_by._id);
                        $scope.isUserLinkedWithProperty($scope.property._id);
                        blockUI.stop();
                    } else {
                        toastr.warning('No properties found');
                        blockUI.stop();
                    }
                });
            }
            blockUI.stop();
        };

        $scope.userLinkedProperty = false;
        $scope.isUserLinkedWithProperty = function (id) {
            var obj = {};
            obj.property_id = id;
            if ($localStorage.userData.agency_id) {
                obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            obj.user_id = $localStorage.loggedInUserId;
            obj.request_by_role = ($localStorage.role_id) ? $localStorage.role_id : '';
            PropertyService.checkUserPropertyRelation().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.userLinkedProperty = response.data.status;
                }
            });

        };

        $scope.getTenantName = function (id) {
            var obj = {};
            obj.property_id = id;
            PropertyService.getTenantNameOnPropertyDetail().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.tenantsName = response.data;
                } else {
                    $scope.tenantsName = [];
                }
            });

        };

        $scope.getCreatedByReview = function (id) {
            $scope.createdByRate = {};
            PropertyService.getReviewForUser(id).get(function (response) {
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
         * Function is use to show Property Agreement details
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 16-Jan-2018
         */
        $scope.agreementDetails = [];
        $scope.is_creater = false;
        $scope.getPropertyAgreement = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            var propertyId = $stateParams.id;
            if (propertyId) {
                PropertyService.getPropertyAgreementDetails(propertyId).get(function (response) {
                    if (response.code == 200) {
                        $scope.agreementDetails = response.data;
                    }
                });
            }
        };
        /**
         * Function is use to show Property Tenant History
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 16-Jan-2018
         */
        $scope.tenantHistoryDetails = [];
        $scope.is_creater = false;
        $scope.getPropertyTenantHistory = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            var propertyId = $stateParams.id;
            if (propertyId) {
                PropertyService.getPropertytenantHistoryDetails(propertyId).get(function (response) {
                    if (response.code == 200) {
                        $scope.tenantHistoryDetails = response.data;
                    }
                });
            }
        };
        /**
         * Function is use to show Property Tenant History
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 16-Jan-2018
         */
        $scope.maintenanceHistoryDetails = [];
        $scope.is_creater = false;
        $scope.getPropertyMaintenanceHistory = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            var propertyId = $stateParams.id;
            if (propertyId) {
                PropertyService.getPropertyMaintenanceHistoryDetails(propertyId).get(function (response) {
                    if (response.code == 200) {
                        $scope.maintenanceHistoryDetails = response.data;
                    }
                });
            }
        };
        /**
         * Function is used to show moere description
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.showMoreDescription = function () {
            $scope.oneLineDescription = false;
            $scope.fullDescription = true;
            $scope.showMore = false;
            $scope.showLess = true;
        };
        /**
         * Function is used to show less description
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.showLessDescription = function () {
            $scope.oneLineDescription = false;
            $scope.fullDescription = true;
            $scope.showMore = true;
            $scope.showLess = false;
        };
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
            if ($scope.setImageasFeatured == index)
                $scope.setImageasFeatured = 0;

            $scope.property.files.splice(index, 1);
            if ($scope.property.files.length == 0) {
                $scope.property.files = [];
            }


        };
        /**
         * Function is used to remove images -edit
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.RemovePhotoAtUpdate = function (index) {
            //Find the record using Index from Array.
            var name = $scope.property.image[index];
            $scope.property.image.splice(index, 1);
            if ($scope.property.image.length == 0) {
                $scope.property.image = [];
            }

            // console.log("index: ", index)
            if ($scope.setImageasFeatured == index) {
                $scope.setImageasFeatured = 0;
            }
            else if ($scope.featuredFlag == 'exist' && index < $scope.setImageasFeatured) {
                $scope.setImageasFeatured = $scope.setImageasFeatured - 1;
                $scope.setMeasFeaturedImage($scope.setImageasFeatured, 'upload', 'exist');
                // console.log($scope.featuredFlag + " else part : " + index + " == " + $scope.setImageasFeatured + " " + typeof $scope.setImageasFeatured);
            }
        };
        /**
         * Function is used to update property
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.updateProperty = function (propertyData) {

            $scope.loginLoading = true;
            $scope.i;
            propertyData.created_by = (propertyData.created_by._id) ? propertyData.created_by._id : propertyData.created_by;
            // propertyData.isTownHouse = (propertyData.isTownHouse=="1")?false:true;
            propertyData.save_as_draft = false;
            // propertyData.created_by = $localStorage.loggedInUserId;
            propertyData.floor_area = (propertyData.floor_area) ? propertyData.floor_area : '0';
            propertyData.floor_area = parseInt(propertyData.floor_area);
            propertyData.number_of_parking = (propertyData.number_of_parking) ? propertyData.number_of_parking : '0';
            propertyData.lot_erea = (propertyData.lot_erea) ? propertyData.lot_erea : '0';
            propertyData.number_of_bathroom = (propertyData.number_of_bathroom) ? propertyData.number_of_bathroom : '0';
            propertyData.number_bedroom = (propertyData.number_bedroom) ? propertyData.number_bedroom : '0';
            propertyData.number_of_townhouse = (propertyData.number_of_townhouse) ? propertyData.number_of_townhouse : '0';
            propertyData.lot_erea = parseInt(propertyData.lot_erea);
            propertyData.number_of_bathroom = parseInt(propertyData.number_of_bathroom);
            propertyData.number_bedroom = parseInt(propertyData.number_bedroom);
            propertyData.number_of_townhouse = parseInt(propertyData.number_of_townhouse);
            propertyData.number_of_parking = parseInt(propertyData.number_of_parking);

            // console.log("propertyData.image");
            // console.log(propertyData.image);
            // console.log($scope.setImageasFeatured + "===" + $scope.getEditImageIndex);
            if ($scope.featuredFlag == 'exist' && this.lastSelected == 'upload' && $scope.setImageasFeatured != $scope.getEditImageIndex) {
                if (propertyData.image) {
                    if ($scope.setImageasFeatured >= 0)
                        propertyData.image[$scope.setImageasFeatured].isFeatured = true;
                    if ($scope.getEditImageIndex >= 0)
                        propertyData.image[$scope.getEditImageIndex].isFeatured = false;
                }
            }

            if ($scope.choosenFiles.length > 0) {
                //propertyData.image = $scope.choosenFiles;
                $scope.val = propertyData.image.length;
                var j = propertyData.image.length + $scope.choosenFiles.length;
                for ($scope.i = 0; $scope.i < $scope.choosenFiles.length; $scope.i++) {
                    propertyData.image[$scope.val + $scope.i] = $scope.choosenFiles[$scope.i];
                    if (propertyData.image.length == j) {
                        PropertyService.updatePropertyById().post(propertyData, function (response) {
                            if (response.code == 200) {
                                $scope.property.owned_by = undefined;
                                $scope.property = {};
                                toastr.success(response.message);
                                if ($scope.choosenFiles.length == 0 || propertyData.files) {
                                    $scope.upload(propertyData.files, response.data._id);
                                    $scope.moveToFourthStep();
                                    $scope.loginLoading = false;
                                } else {
                                    $scope.moveToFourthStep();
                                    $scope.loginLoading = false;
                                }
                            } else {
                                toastr.warning('Server busy please try again latter');
                                $scope.loginLoading = false;
                            }
                        });
                    }
                }
                $scope.loginLoading = false;
                //console.log("$scope.propertyData.image",$scope.propertyData.image)
            } else {
                PropertyService.updatePropertyById().post(propertyData, function (response) {
                    if (response.code == 200) {
                        toastr.success(response.message);
                        $scope.property.owned_by = undefined;
                        if ($scope.choosenFiles.length == 0 || propertyData.files) {
                            $scope.upload(propertyData.files, response.data._id);
                            $scope.moveToFourthStep();
                            $scope.loginLoading = false;
                        } else {
                            $scope.moveToFourthStep();
                            $scope.loginLoading = false;
                        }
                    } else {
                        toastr.warning('Server busy please try again latter');
                        $scope.loginLoading = false;
                    }
                });
                $scope.loginLoading = false;
            }
        };
        /**
         * Function is used to get property owner
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 30-Nov-2017
         */
        $scope.ownerList = [];
        $rootScope.getPropertyOwner = function (propertyData) {
            var agencyId = '';
            if ($localStorage.userData.agency_id) {
                agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            var userId = ($localStorage.loggedInUserId) ? $localStorage.loggedInUserId : '';
            var roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
            var postData = {
                "agency_id": agencyId,
                "user_id": userId,
                "request_by_role": roleId
            };
            PropertyService.getPropertyOwner().post(postData, function (response) {
                if (response.code == 200) {
                    $scope.ownerList = response.data;
                    // console.log('$scope.ownerList', $scope.ownerList);
                }
            });
        };

        /**
         * Function is use to load map on property detail page
         * @return json
         * Created by  PropertyService.getPropertyListingBySearch
         * @smartData Enterprises (I) Ltd
         * Created Date 23-Sept-2017
         */
        $scope.mapInit2 = function (propertyData) {
            $scope.viewImage;
            $scope.viewCsvImage;
            $scope.viewFileImage
            if (propertyData.image[0].path && propertyData.image[0].is_from_my_file == false && propertyData.image[0].is_from_csv_file == false) {
                $scope.viewImage = "height:50%;margin-top: 5px;";
                $scope.viewCsvImage = "display:none";
                $scope.viewFileImage = "display:none";
            } else if (propertyData.image[0].path && propertyData.image[0].is_from_my_file == false && propertyData.image[0].is_from_csv_file == true) {
                $scope.viewCsvImage = "height:50%;margin-top: 5px;";
                $scope.viewImage = "display:none";
                $scope.viewFileImage = "display:none";
            } else if (propertyData.image[0].path && propertyData.image[0].is_from_my_file == true && propertyData.image[0].is_from_csv_file == false) {
                $scope.viewFileImage = "height:50%;margin-top: 5px;";
                $scope.viewImage = "display:none";
                $scope.viewCsvImage = "display:none";
            }
            var latitude = parseFloat(propertyData.latitude);
            var longitude = parseFloat(propertyData.longitude);
            if (latitude && longitude) {
                var location = { lat: latitude, lng: longitude };
                var map = new google.maps.Map(document.getElementById('googleMap'), {
                    center: location,
                    zoom: 17
                });
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    title: propertyData.address,
                });
                var infowindow = new google.maps.InfoWindow({
                    content: propertyData.address,
                    maxWidth: 200,
                    overFlow: 'hidden'
                });

                marker.addListener('click', function () {
                    //propertyData.address
                    // propertyData.isTownHouse = (propertyData.isTownHouse=="1")?"No":"Yes";

                    infowindow.setContent(`<div style="overflow:hidden">
                <div class=" property shadow-hover ">
                    <a href="/#!/property_details/`+ propertyData._id + `" class="property-img inspection">
                       
                        <img style="`+ $scope.viewImage + `" src="` + $scope.imageUrl + `` + propertyData.image[0].path + `" alt="propimg ">
                        <img style="`+ $scope.viewCsvImage + `" src="` + propertyData.image[0].path + `" alt="propimg ">
                        <img style="`+ $scope.viewFileImage + `" src="` + $scope.fileImageUrl + `` + propertyData.image[0].path + `" alt="propimg ">
                       
                    </a>
                    <div style="margin-top: -104px;" class="property-content ">
                        <div style="margin-bottom: 0px;" class="property-title ">
                            <h4 style="margin-top: 22px;">
                                <a href="/#!/property_details/`+ propertyData._id + `">` + propertyData.address + `</a>
                            </h4>
                            <p style="height: 22px;" class="property-address griddes "></p>
                        </div>
                        <table class="property-details prop-card-view" style="margin-top: -27px;">
                            <tbody>
                                <tr>
                                    <td>
                                        <img src="/assets/images/Bedroom-new.png" />`+ propertyData.number_bedroom + `</td>
                                    <td>
                                        <img src="/assets/images/Bathroom-new.png" />`+ propertyData.number_of_bathroom + `</td>
                                    <td>
                                        <img src="/assets/images/Garage-new.png" />`+ propertyData.number_of_parking + `</td>
                                    <td style="padding-right: 8px;">
                                        <img src="/assets/images/townhouse-new.png" /><span class="text-capitalize">` + propertyData.property_type + `</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`);
                    infowindow.open(map, marker);
                    //infowindow.open(marker.get('map'), marker);
                });
            }
        }

        /**
         * Function is used to navigate to edit property
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.goToEditProperty = function (id) {
            // console.log('called');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $location.path('/edit_property/' + id);

        }
        $scope.propertyLisingInitialize = function (id) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }

        /**
         * Function is used to navigate to dashboard
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.goToDashboard = function (id) {
            $state.go('propertyListing');

        }
        /**
         * Function is used to go to agent page
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.goToAgent = function (id) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $location.path('profile/' + id);
        }
        /**
         * Function is to open send message
         * @access private
         * @return json
         * Created by 
         * @Narola Infotech : KEK
         * Created Date 5-Nov-2018
         */
        $scope.openAgentSendMessage = function (id, name) {
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
                        PropertyService.sendMessage().post(obj, function (response) {
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

        //get current data functionality 
        $scope.getDate = function () {
            var d = moment().format('YYYY-MM-DD h:mm:ss a');
            var n = moment().format("MMM Do") + ', ' + moment().format('LT');
            return n;
        }

        //get current data functionality in specific format
        $scope.getDateInFormat = function () {
            // var n = moment().format("DD/MM/YY") + ', ' + moment().format('LT');
            var n = moment().format("DD/MM/YY");
            return n;
        }
        $scope.pre_comm_format = $scope.getDateInFormat();

        /**
         * Function is used to add property to fav list
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Nov-2017
         */
        $scope.addToFav = function (propertyId, status, selected) {

            // if(status=="undefined"){
            //     status = true;
            // }
            status = (status == true) ? 2 : 1;
            var userId = $localStorage.loggedInUserId;
            if (propertyId && userId) {
                var postData = {
                    "fav_by": userId,
                    "fav_to_property": propertyId,
                    "fav_status": status
                }
                PropertyService.addToFavProperty().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.ownerList = response.data;
                        if (selected == 1) {
                            $scope.getAllProperty();
                        } else if (selected == 2) {
                            $scope.getFavPropertyList();
                        } else if (selected == 3) {
                            $scope.getPropertySales();
                        } else if (selected == 4) {
                            $scope.getTenantedProperty();
                        } else if (selected == 5) {
                            $scope.getDatabaseProperty();
                        }
                        if (status == 2) {
                            toastr.success('Successfully removed property from favorite');
                        } else {
                            toastr.success('Successfully marked property as favorite');
                        }

                    }
                });
            }
        }
        /**
         * Function is used to get fav property list
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 11-Dec-2017
         */
        $scope.getFavPropertyList = function () {
            var userId = $localStorage.loggedInUserId;
            // console.log('$rootScope.grideView', $rootScope.grideView);
            if (userId) {
                var postData = {
                    "user_id": userId,
                    "fav_status": 1
                };
                PropertyService.getFavPropertyListing().post(postData, function (response) {
                    $scope.isSearchedProperty = false;
                    if (response.code == 200) {
                        $scope.propertyList = [];
                        $scope.favPropertyList = new Array();
                        $scope.favPropertyList = response.data;
                    } else {
                        toastr.warning('Server busy please try again latter');
                    }
                });
            }
        }
        $scope.getAllProperty = function () {
            $scope.getPropertyListing();
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
        /**
         * Function is used to clear search
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 11-Dec-2017
         */
        $scope.clearSearch = function () {
            $scope.property.property_type = '';
            $scope.property.city = '';
            $scope.property.state = '';
            $scope.property.address = '';
            $scope.property.created = '';
            $scope.getPropertyListing();
            $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
        }
        $scope.propertySearch = function (searchData, tabName) {
            if (searchData.title || searchData.state || searchData.city || searchData.property_type || searchData.created || searchData.address) {
                blockUI.start();
                var postData = {
                    "created": (searchData.created) ? searchData.created : '',
                    "property_type": (searchData.property_type) ? searchData.property_type : '',
                    "title": (searchData.address) ? searchData.address : '',
                    //"property_id": searchData.address,
                    "state": (searchData.state) ? String(searchData.state) : '',
                    "city": (searchData.city) ? String(searchData.city) : '',
                    "address": (searchData.address) ? searchData.address : '',
                    "login_id": $localStorage.loggedInUserId
                };
                PropertyService.getPropertyListingBySearch().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.isSearchedProperty = true;
                        // searchData = {};
                        $scope.propertyList = new Array();
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                        angular.element('#propertySearchPopUp').hide();
                        if (tabName == 1) {
                            $scope.propertyList = response.data;
                        } else if (tabName == 2) {
                            $scope.favPropertyList = response.data;
                        } else if (tabName == 3) {
                            $scope.listingProperty = response.data;
                        } else if (tabName == 4) {
                            $scope.propertyListingSpace = response.data;
                        }
                        else if (tabName == 5) {
                            $scope.propertyListingSpace = response.data;
                        }

                        $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
                    }
                });
                blockUI.stop();
            } else {
                toastr.warning('Atleast fill one field for searching');
            }

        }
        /**
         * Function is use to load map on property detail page
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 14-Dec-2017
         */
        $scope.mapInit = function (propertyData) {
            // console.log('propertyData propertyData', propertyData);
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
                zoom: 12,
                //center: new google.maps.LatLng(-37.92, 151.25),
                //mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                panControl: false,
            });
            var infowindow = new google.maps.InfoWindow({
                maxWidth: 200,
                overFlow: 'hidden'
            });
            var markers = new Array();
            var iconCounter = 0;
            // Add the markers and infowindows to the map
            var serviceArea = [''];
            if (!Array.isArray(propertyData)) {
                if (propertyData.latitude && propertyData.longitude) {
                    propertyData.number_of_townhouse = (propertyData.number_of_townhouse) ? propertyData.number_of_townhouse : 0
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(propertyData.latitude, propertyData.longitude),
                        map: map,
                        icon: icons[iconCounter],
                    });
                    markers.push(marker);

                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {
                            //propertyData.address
                            // propertyData.isTownHouse = (propertyData.isTownHouse=="1")?"No":"Yes";
                            infowindow.setContent(`<div style="overflow:hidden">
                        <div class=" property shadow-hover ">
                            <a href="/#!/property_details/`+ propertyData._id + `" class="property-img inspection">
                               
                                <img style="height:50%" src="`+ $scope.imageUrl + `` + propertyData.image[0].path + `" class="" alt="propimg ">
                               
                            </a>
                            <div style="margin-top: -104px;" class="property-content ">
                                <div style="margin-bottom: 0px;" class="property-title ">
                                    <h4>
                                        <a href="/#!/property_details/`+ propertyData._id + `">` + propertyData.address + `</a>
                                    </h4>
                                    <p style="height: 22px;" class="property-address griddes "></p>
                                </div>
                                <table class="property-details prop-card-view" style="margin-top: -27px;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <img src="/assets/images/Bedroom-new.png" />`+ propertyData.number_bedroom + `</td>
                                            <td>
                                                <img src="/assets/images/Bathroom-new.png" />`+ propertyData.number_of_bathroom + `</td>
                                            <td>
                                                <img src="/assets/images/Garage-new.png" />`+ propertyData.number_of_parking + `</td>
                                            <td style="padding-right: 8px;">
                                                <img src="/assets/images/townhouse-new.png" /><span class="text-capitalize">` + propertyData.property_type + `<span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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
            }
            for (var i = 0; i < propertyData.length; i++) {
                if (propertyData[i].latitude && propertyData[i].longitude) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(propertyData[i].latitude, propertyData[i].longitude),
                        map: map,
                        icon: icons[iconCounter]
                    });
                    markers.push(marker);
                    //propertyData[i].isTownHouse = (propertyData[i].isTownHouse=="1")?"No":"Yes";
                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {
                            //propertyData[i].address
                            infowindow.setContent(`<div style="overflow:hidden">
                        <div class=" property shadow-hover ">
                            <a href="/#!/property_details/`+ propertyData[i]._id + `" class="property-img inspection">
                                <div class="img-fade "></div>
                                <img src="`+ $scope.imageUrl + `` + propertyData[i].image[0].path + `" class="" alt="propimg ">
                               
                            </a>
                            <div class="property-content ">
                                <div class="property-title ">
                                    <h4>
                                        <a href="/#!/property_details/`+ propertyData[i]._id + `">` + propertyData[i].address + `</a>
                                    </h4>
                                    <p class="property-address griddes "></p>
                                </div>
                                <table class="property-details prop-card-view">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <img src="/assets/images/Bedroom-new.png" />`+ propertyData[i].number_bedroom + `</td>
                                            <td>
                                                <img src="/assets/images/Bathroom-new.png" />`+ propertyData[i].number_of_bathroom + `</td>
                                            <td>
                                                <img src="/assets/images/Garage-new.png" />`+ propertyData[i].number_of_parking + `</td>
                                            <td>
                                                <img src="/assets/images/townhouse-new.png" /><span class="text-capitalize">`+ propertyData[i].property_type + `</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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
        $scope.addressInitialize = function () {
            $scope.property.city = angular.element("#locality").val();
            $scope.property.state = angular.element("#administrative_area_level_1").val();
            $scope.property.latitude = angular.element("#latitude").val();
            $scope.property.longitude = angular.element("#longitude").val();
        }
        $scope.getDatabaseProperty = function () {
            var postData = {
                "user_id": $localStorage.loggedInUserId
            }
            PropertyService.getDatabaseProperty().post(postData, function (response) {
                $scope.isSearchedProperty = false;
                if (response.code == 200) {
                    $scope.databasePropertyList = [];
                    $scope.databasePropertyList = response.data;
                }
            });
        }
        $scope.getTenantedProperty = function () {
            var agencyId = '';
            if ($localStorage.userData.agency_id) {
                agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            var userId = $localStorage.loggedInUserId;
            var roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
            var postData = {
                "agency_id": agencyId,
                "request_by_role": roleId,
                "user_id": userId,
                "page_number": "1",
                "number_of_pages": "2",
            };
            PropertyService.getTenantedProperty().post(postData, function (response) {
                $scope.isSearchedProperty = false;
                if (response.code == 200) {
                    $scope.TenantedPropertyList = [];
                    $scope.TenantedPropertyList = response.data;
                }
            });
        }
        $scope.clearPropertyAddress = function () {
            $scope.property.address = ' ';

        }
        $scope.mergeImages = function () {
            // console.log($scope.choosenFiles);
        }
        $scope.chooseFromMyFiles = function () {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/properties/views/chooseFiles.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.documentList = [];
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.close = function () {

                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.filesInitialize = function () {
                        $scope.getDocumentList();
                    };
                    $scope.getDocumentList = function () {
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                        var userId = $localStorage.loggedInUserId;
                        if (userId) {
                            var obj = {
                                "created_by": userId
                            };
                            PropertyService.getDocumentList().post(obj, function (response) {
                                if (response.code == 200) {
                                    $scope.documentList = response.data;
                                    // console.log('$scope.documentList',$scope.documentList);
                                    blockUI.stop();
                                } else {
                                    $scope.documentList = [];
                                    blockUI.stop();
                                }
                            });
                        }
                    }
                    $scope.saveFile = function () {
                        if ($scope.user.length) {
                            blockUI.start();
                            angular.forEach($scope.user, function (value, key) {
                                var data = $scope.documentList[value].document_path;
                                $scope.choosenFiles[key] = _.pick($scope.documentList[value], 'document_path');
                                $scope.choosenFiles[key] = _.extend($scope.choosenFiles[key], { path: data });
                                $scope.choosenFiles[key] = _.extend($scope.choosenFiles[key], { is_from_my_file: true });
                                if ($scope.featuredFlag == 'choose' && key == $scope.setImageasFeatured)
                                    $scope.choosenFiles[key] = _.extend($scope.choosenFiles[key], { isFeatured: true });

                                $scope.choosenFiles[key] = _.omit($scope.choosenFiles[key], 'document_path');
                                if ($scope.user.length == $scope.choosenFiles.length) {
                                    $scope.close();
                                }
                                blockUI.stop();
                            });
                            if ($scope.choosenFiles.length > 0) {
                                if ($scope.property.files && $scope.property.files.length === 1
                                    && ($scope.property.files[0] == image[0]
                                        || JSON.stringify($scope.property.files[0]) == "null")) {
                                    $scope.property.files = [];
                                }
                                $scope.$parent.lastSelected = 'choose';
                            }
                        } else {
                            toastr.warning('Sorry nothing to upload');
                            $scope.close();
                        }
                    }

                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });

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
            maxDate: new Date(),
            // minDate: new Date(),
            startingDay: 1
        };

        $scope.CommencedateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            // maxDate: new Date(),
            // minDate: new Date() + 1,
            minDate: new Date(),
            startingDay: 1
        };

        $scope.intend_dateOptions = {
            formatYear: 'yy',
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
            $scope.inlineOptions.maxDate = $scope.inlineOptions.maxDate ? null : new Date();
            $scope.dateOptions.maxDate = $scope.inlineOptions.maxDate;
        };

        $scope.toggleMin();

        $scope.open1 = function () {
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
        // $scope.toggleMin = function () {
        //     $scope.dateOptions.maxDate = $scope.dateOptions.maxDate ? null : new Date();
        // };

        // $scope.toggleMin();

        $scope.showPopup = function () {
            angular.element('#propertySearchPopUp').show();
        }
        $scope.hideSearchFilter = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            angular.element('#propertySearchPopUp').hide();
        }
        //to delete property

        $scope.deleteProperty = function (userId) {
            if (userId == $localStorage.loggedInUserId) {
                swal({
                    title: "Are you sure?",
                    text: "You want to delete this property permanently?",
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
                    obj.propertyId = $stateParams.id;
                    PropertyService.deleteProperty().post(obj, function (response) {
                        $scope.isSearchedProperty = false;
                        if (response.code == 200) {
                            toastr.success('Successfully deleted property');
                            $state.go('propertyListing');
                        } else {
                            toastr.warning('Server is busy please try after a while');
                        }
                    });
                    blockUI.stop();
                });
            } else {
                toastr.error('You do not have access permission');
            }
        }
        //view full screen image
        $scope.openFullScreenSlider = function (propertyImage) {
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;
            $scope.active = 0;
            var key = 0;
            var modalInstance;
            modalInstance = $uibModal.open({
                templateUrl: '/frontend/modules/properties/views/full_screen_image.html',
                controller: function ($uibModalInstance, $scope, PropertyService) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.getImages = function () {
                        $scope.proImageUrl = baseUrl + '/property_image/';
                        $scope.propertyImage = propertyImage;
                    }
                }
            });
        }
        $scope.addPropertyAgreement = function (id) {
            $location.path('/upload_property_document/' + id);
        }
        $scope.dateOptions2 = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };


        $scope.popupEnd = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        $scope.popupPay = {
            opened: false
        };
        $scope.open2 = function () {
            $rootScope.createDate = true;
            $scope.popup2.opened = true;

        };
        $scope.openEndDate = function () {
            $rootScope.endDate = true;
            $scope.popupEnd.opened = true;
        };
        $scope.openPayable = function () {
            //$rootScope.payDt = true;
            $scope.popupPay.opened = true;
        };
        $scope.agreementTermChanged = function (terms, startdt) {
            if (terms && startdt) {
                if (terms == "1") {
                    var date = moment(startdt).add(1, "months");
                    $scope.dateOptions2.minDate = new Date(date);
                    $scope.agreement.case_validity = new Date(date);
                } else {
                    var date = moment(startdt).add(12, "months");
                    $scope.dateOptions2.minDate = new Date(date);
                    $scope.agreement.case_validity = new Date(date);
                }
            }
        }

        /**
       * Function is to save agreement
       * @access private
       * @return json
       * Created 
       * @smartData Enterprises (I) Ltd
       * Created Date 22-Nov-2017
       */
        $scope.saveAgreement = function (agreement, images) {
            blockUI.start();
            if ($scope.agreementForm.$invalid == false) {
                var obj = {};
                obj = agreement;
                obj.rental_period = parseInt(agreement.rental_period);

                obj.terms = parseInt(agreement.terms);
                obj.created_by = $localStorage.loggedInUserId;
                obj.created_by_role = $localStorage.role_id;
                if ($localStorage.userData.agency_id) {
                    obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                }
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
                obj.tenants = _.map($scope.newArray2, function (o) { return _.pick(o, '_id'); });
                PropertyService.addAgreement().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.propertyList = response.data;
                        $scope.agreement = {};
                        $scope.newArray2 = [];
                        $scope.owner = {};
                        obj.images = images;
                        $scope.uploadAgreementFiles(obj, response.data._id, agreement.property_id);
                    } else {
                        $scope.propertyList = [];
                        blockUI.stop();
                    }
                });
            } else {
                toastr.error("Please select property for adding the agreement");
                blockUI.stop();
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
        $scope.uploadAgreementFiles = function (files, data, pid) {
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
                                    toastr.success('Successfully created agreement as a draft');
                                } else {
                                    toastr.success('Successfully created agreement');
                                }
                                $location.path('/property_details/' + pid);
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
                toastr.success('Successfully created agreement');
                $location.path('/property_details/' + pid);
                blockUI.stop();
            }
        };
        /**
      * Function is to get tenant listing in add maintenance page
      * @access private
      * @return json
      * Created 
      * @smartData Enterprises (I) Ltd
      * Created Date 22-Nov-2017
      */
        $scope.getTenants = function () {
            blockUI.start();
            $scope.noTenant = false;
            var id = $stateParams.id;
            var obj = {};
            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                obj.id = id;
                PropertyService.getTenantForAgreement().get(obj, function (response) {
                    if (response.code == 200) {
                        $scope.data = response.data;
                        $scope.tenantList = [];
                        if ($scope.data.length > 0) {
                            angular.forEach($scope.data, function (value, key) {
                                var obj1 = [];
                                obj1 = _.values(_.pick(value, 'invited_to'));
                                var fullname = obj1[0].firstname + " " + obj1[0].lastname;
                                obj1[0] = _.extend(obj1[0], { fullName: fullname })
                                $scope.tenantList[key] = obj1[0];
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
        $scope.agreement = {};
        $scope.agreementInit = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $localStorage.userData.routeState = "Agreements";
            $rootScope.navBarOptionSelected = "Agreements";
            $scope.agreement.water_usage = false;
            $scope.agreement.strata_by_laws = false;
            blockUI.start();
            var propertyId = $stateParams.id;
            var user_id = $localStorage.loggedInUserId;
            if (propertyId) {
                var postData = {
                    "propertyId": propertyId
                };
                PropertyService.uploadPropertyDocs().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.propertyData = response.data[0];
                        $scope.properId = "#" + $scope.propertyData.property_id + "," + $scope.propertyData.address;
                        $scope.ownerName = $scope.propertyData.owned_by.firstname + " " + $scope.propertyData.owned_by.lastname;
                        $scope.agreement.property_id = $scope.propertyData._id;
                        $scope.agreement.owner_id = $scope.propertyData.owned_by._id;
                        blockUI.stop();
                    } else {
                        toastr.warning('No properties found');
                        blockUI.stop();
                    }
                });
            }
            blockUI.stop();
        }
        /**
        * Function is to remove agreement files
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        $scope.RemoveAgreementPhoto = function (index) {
            //Find the record using Index from Array.
            var name = $scope.images[index];
            $scope.images.splice(index, 1);
            if ($scope.images.length == 0) {
                delete $scope.images;
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
            blockUI.start();
            $scope.agreement.save_as_draft = true;
            $scope.saveAgreement(agreement, images);
            blockUI.stop();

        };
        $scope.cancelAgreementCreation = function (id) {
            $location.path('/property_details/' + id);
        }

        $scope.setMeasFeaturedImage = function (index_value, type, featuredFlag) {
            $scope.setImageasFeatured = index_value;
            $scope.lastSelected = type;
            $scope.featuredFlag = featuredFlag;
        }

        $scope.getUserDetails = function () {
            $scope.stateList = austriliaState;
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
                // $scope.imageUrl = baseUrl + '/user_image/';
                var userData = {
                    "userId": $localStorage.loggedInUserId,
                    "roleId": $localStorage.role_id
                }
                blockUI.start();

                userService.getUserById().post(userData, function (response) {
                    if (response.code == 200) {
                        $localStorage.userData = response.data;
                        $localStorage.loggedInfirstname = response.data.firstname;
                        $localStorage.loggedInlastname = response.data.lastname;
                        $scope.userModel = response.data;
                        if (!$scope.userModel.members) {
                            $scope.userModel.members = [];
                        }

                        if ($scope.userModel.availability && $scope.userModel.availability.option && ($scope.userModel.availability.option == '3' || $scope.userModel.availability.option == 3)) {
                            $scope.displayDaysOffOptions = true;
                        }
                        $scope.applicationData.members = [];
                        if ($scope.userModel.members && $scope.userModel.members.length > 0) {
                            $scope.display_occupants_section1 = $scope.userModel.members.length;
                            $scope.applicationData.members = $scope.userModel.members;
                        }

                        $scope.applicationData.vehicles = [];
                        if ($scope.userModel.vehicles && $scope.userModel.vehicles.length > 0) {
                            $scope.display_vehicles_section1 = $scope.userModel.vehicles.length;
                            $scope.applicationData.vehicles = $scope.userModel.vehicles;
                        }

                        $scope.applicationData.pets = [];
                        if ($scope.userModel.pets && $scope.userModel.pets.length > 0) {
                            $scope.display_pets_section1 = $scope.userModel.pets.length;
                            $scope.applicationData.pets = $scope.userModel.pets;
                        }

                        blockUI.stop();
                    } else {
                        blockUI.stop();
                    }
                });

            }
        };

        $scope.displayAddOccupantSection = function () {
            $scope.display_occupants_section1 = $scope.display_occupants_section;
        }

        $scope.displayAddVehicleSection = function () {
            $scope.display_vehicles_section1 = $scope.display_vehicles_section;
        }

        $scope.displayAddPetsSection = function () {
            $scope.display_pets_section1 = $scope.display_pets_section;
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
                            $scope.docs_arr[key] = value['_id'];
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


        $scope.untouched_application_forms = function () {
            // $scope.appPropertyStepOne.$setUntouched();
            // $scope.appPropertyStepTwo.$setUntouched();
            // $scope.appPropertyStepThree.$setUntouched();
            // $scope.appPropertyStepFour.$setUntouched();
            // $scope.appPropertyStepFilve.$setUntouched();
            // $scope.appPropertyStepSix.$setUntouched();
        }

        /**
            * Function is used to move to first step
            * @access private
            * @return json
            * Created by 
            * @Narola : KEK
            * Created Date 10-01-2019
            */
        $scope.moveToAppFirstStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.untouched_application_forms();
            $scope.AppfirstTabContent = "tab-pane active";
            $scope.AppsecondTabContent = "tab-pane";
            $scope.AppthirdTabContent = "tab-pane";
            $scope.AppfourthTabContent = "tab-pane";
            $scope.AppfifthTabContent = "tab-pane";
            $scope.AppsixthTabContent = "tab-pane";
            $scope.AppseventhTabContent = "tab-pane";
            $scope.AppeightTabContent = "tab-pane";

            $scope.AppprogressBarWidthStyle = {
                "width": "14%"
            };
            $scope.AppnavPillsLiFirstClass = "active";
            $scope.AppnavPillsLiSecondClass = "";
            $scope.AppnavPillsLiThirdClass = "";
            $scope.AppnavPillsLiFourthClass = "";
            $scope.AppnavPillsLiFifthClass = "";
            $scope.AppnavPillsLiSixthClass = "";
            $scope.AppnavPillsLiSeventhClass = "";
        };

        /**
            * Function is used to move to second step
            * @access private
            * @return json
            * Created by 
            * @Narola : KEK
            * Created Date 10-01-2019
            */
        $scope.moveToAppSecondStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.untouched_application_forms();
            $scope.AppfirstTabContent = "tab-pane";
            $scope.AppsecondTabContent = "tab-pane active";
            $scope.AppthirdTabContent = "tab-pane";
            $scope.AppfourthTabContent = "tab-pane";
            $scope.AppfifthTabContent = "tab-pane";
            $scope.AppsixthTabContent = "tab-pane";
            $scope.AppseventhTabContent = "tab-pane";
            $scope.AppeightTabContent = "tab-pane";

            $scope.AppprogressBarWidthStyle = {
                "width": "28%"
            };
            $scope.AppnavPillsLiFirstClass = "active";
            $scope.AppnavPillsLiSecondClass = "active";
            $scope.AppnavPillsLiThirdClass = "";
            $scope.AppnavPillsLiFourthClass = "";
            $scope.AppnavPillsLiFifthClass = "";
            $scope.AppnavPillsLiSixthClass = "";
            $scope.AppnavPillsLiSeventhClass = "";
        };

        /**
            * Function is used to move to third step
            * @access private
            * @return json
            * Created by 
            * @Narola : KEK
            * Created Date 10-01-2019
            */
        $scope.moveToAppThirdStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.untouched_application_forms();
            $scope.AppfirstTabContent = "tab-pane";
            $scope.AppsecondTabContent = "tab-pane";
            $scope.AppthirdTabContent = "tab-pane active";
            $scope.AppfourthTabContent = "tab-pane";
            $scope.AppfifthTabContent = "tab-pane";
            $scope.AppsixthTabContent = "tab-pane";
            $scope.AppseventhTabContent = "tab-pane";
            $scope.AppeightTabContent = "tab-pane";

            $scope.AppprogressBarWidthStyle = {
                "width": "42%"
            };
            $scope.AppnavPillsLiFirstClass = "active";
            $scope.AppnavPillsLiSecondClass = "active";
            $scope.AppnavPillsLiThirdClass = "active";
            $scope.AppnavPillsLiFourthClass = "";
            $scope.AppnavPillsLiFifthClass = "";
            $scope.AppnavPillsLiSixthClass = "";
            $scope.AppnavPillsLiSeventhClass = "";
        };

        /**
            * Function is used to move to fourth step
            * @access private
            * @return json
            * Created by 
            * @Narola : KEK
            * Created Date 10-01-2019
            */

        $scope.moveToAppFourthStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.untouched_application_forms();
            $scope.AppfirstTabContent = "tab-pane";
            $scope.AppsecondTabContent = "tab-pane";
            $scope.AppthirdTabContent = "tab-pane";
            $scope.AppfourthTabContent = "tab-pane active";
            $scope.AppfifthTabContent = "tab-pane";
            $scope.AppsixthTabContent = "tab-pane";
            $scope.AppseventhTabContent = "tab-pane";
            $scope.AppeightTabContent = "tab-pane";

            $scope.AppprogressBarWidthStyle = {
                "width": "56%"
            };
            $scope.AppnavPillsLiFirstClass = "active";
            $scope.AppnavPillsLiSecondClass = "active";
            $scope.AppnavPillsLiThirdClass = "active";
            $scope.AppnavPillsLiFourthClass = "active";
            $scope.AppnavPillsLiFifthClass = "";
            $scope.AppnavPillsLiSixthClass = "";
            $scope.AppnavPillsLiSeventhClass = "";
        };


        /**
        * Function is used to move to fifth step
        * @access private
        * @return json
        * Created by 
        * @Narola : KEK
        * Created Date 10-01-2019
        */
        $scope.moveToAppFifthStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.untouched_application_forms();
            $scope.AppfirstTabContent = "tab-pane";
            $scope.AppsecondTabContent = "tab-pane";
            $scope.AppthirdTabContent = "tab-pane";
            $scope.AppfourthTabContent = "tab-pane";
            $scope.AppfifthTabContent = "tab-pane active";
            $scope.AppsixthTabContent = "tab-pane";
            $scope.AppseventhTabContent = "tab-pane";
            $scope.AppeightTabContent = "tab-pane";

            $scope.AppprogressBarWidthStyle = {
                "width": "70%"
            };
            $scope.AppnavPillsLiFirstClass = "active";
            $scope.AppnavPillsLiSecondClass = "active";
            $scope.AppnavPillsLiThirdClass = "active";
            $scope.AppnavPillsLiFourthClass = "active";
            $scope.AppnavPillsLiFifthClass = "active";
            $scope.AppnavPillsLiSixthClass = "";
            $scope.AppnavPillsLiSeventhClass = "";
        };

        /**
        * Function is used to move to sixth step
        * @access private
        * @return json
        * Created by 
        * @Narola : KEK
        * Created Date 10-01-2019
        */
        $scope.moveToAppSixthStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.untouched_application_forms();
            $scope.AppfirstTabContent = "tab-pane";
            $scope.AppsecondTabContent = "tab-pane";
            $scope.AppthirdTabContent = "tab-pane";
            $scope.AppfourthTabContent = "tab-pane";
            $scope.AppfifthTabContent = "tab-pane";
            $scope.AppsixthTabContent = "tab-pane active";
            $scope.AppseventhTabContent = "tab-pane";
            $scope.AppeightTabContent = "tab-pane";

            $scope.AppprogressBarWidthStyle = {
                "width": "84%"
            };
            $scope.AppnavPillsLiFirstClass = "active";
            $scope.AppnavPillsLiSecondClass = "active";
            $scope.AppnavPillsLiThirdClass = "active";
            $scope.AppnavPillsLiFourthClass = "active";
            $scope.AppnavPillsLiFifthClass = "active";
            $scope.AppnavPillsLiSixthClass = "active";
            $scope.AppnavPillsLiSeventhClass = "";
        };

        /**
        * Function is used to move to seventh step
        * @access private
        * @return json
        * Created by 
        * @Narola : KEK
        * Created Date 11-01-2019
        */
        $scope.moveToAppSevenStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.untouched_application_forms();
            $scope.AppfirstTabContent = "tab-pane";
            $scope.AppsecondTabContent = "tab-pane";
            $scope.AppthirdTabContent = "tab-pane";
            $scope.AppfourthTabContent = "tab-pane";
            $scope.AppfifthTabContent = "tab-pane";
            $scope.AppsixthTabContent = "tab-pane ";
            $scope.AppseventhTabContent = "tab-pane active";
            $scope.AppeightTabContent = "tab-pane";

            $scope.AppprogressBarWidthStyle = {
                "width": "84%"
            };
            $scope.AppnavPillsLiFirstClass = "active";
            $scope.AppnavPillsLiSecondClass = "active";
            $scope.AppnavPillsLiThirdClass = "active";
            $scope.AppnavPillsLiFourthClass = "active";
            $scope.AppnavPillsLiFifthClass = "active";
            $scope.AppnavPillsLiSixthClass = "active";
            $scope.AppnavPillsLiSeventhClass = "active";
        };

        /**
       * Function is used to move to eighth step
       * @access private
       * @return json
       * Created by 
       * @Narola : KEK
       * Created Date 16-01-2019
       */

        $scope.moveToAppEighthStep = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.untouched_application_forms();
            $scope.AppfirstTabContent = "tab-pane";
            $scope.AppsecondTabContent = "tab-pane";
            $scope.AppthirdTabContent = "tab-pane";
            $scope.AppfourthTabContent = "tab-pane";
            $scope.AppfifthTabContent = "tab-pane";
            $scope.AppsixthTabContent = "tab-pane";
            $scope.AppseventhTabContent = "tab-pane";
            $scope.AppeightTabContent = "tab-pane active";

            $scope.AppprogressBarWidthStyle = {
                "width": "100%"
            };
            $scope.AppnavPillsLiFirstClass = "active";
            $scope.AppnavPillsLiSecondClass = "active";
            $scope.AppnavPillsLiThirdClass = "active";
            $scope.AppnavPillsLiFourthClass = "active";
            $scope.AppnavPillsLiFifthClass = "active";
            $scope.AppnavPillsLiSixthClass = "active";
            $scope.AppnavPillsLiSeventhClass = "active";
        };

        /**
        * function is used to delete the document 
        * @access private
        * @return json
        * Created by 
        * @Narola : KEK
        * Created Date 11-01-2019
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
                        $scope.setFocusonDocsSection();
                    });
                });
            }
        }


        /**
         *  Set focus on image display section
         * @access private
         * @return json
         * Created by 
         * @Narola : KEK
         * Created Date 11-01-2019
         */
        $scope.setFocusonDocsSection = function () {
            $location.hash('uploaded_docs');
        };

        /**
         *  Back to Property Details Page
         * @access private
         * @return json
         * Created by 
         * @Narola : KEK
         * Created Date 11-01-2019
         */
        $scope.redirectPropertyDetailsPage = function () {
            $location.path('/property_details/' + $scope.propertyId);
        }

        /**
         *  Redirect on Apply Property Form Page
         * @access private
         * @return json
         * Created by 
         * @Narola : KEK
         * Created Date 18-01-2019
         */
        $scope.redirectApplicationPropertyFormPage = function () {
            $window.location.reload();
        }

        /**
         *  Redirect on Property Details Page
         * @access private
         * @return json
         * Created by 
         * @Narola : KEK
         * Created Date 18-01-2019
         */
        $scope.redirectApplicationPropertyDetailsPage = function () {
            $location.path('/application_property/' + $scope.propertyId);
        }

        $scope.display_transafer_content = function () {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/properties/views/display_transfer_statement.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
        };

        $scope.display_application_termsandcond = function () {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/properties/views/display_application_rules_statement.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
        };

        $scope.submitApplication = function (app_data) {
            $scope.loginLoading = true;

            app_data.property_type = $scope.property.property_type;
            app_data.number_bedroom = $scope.property.number_bedroom;
            $scope.first_name__ = ($scope.property && $scope.property.created_by && $scope.property.created_by.firstname) ? $scope.property.created_by.firstname : '';
            $scope.last_name__ = ($scope.property && $scope.property.created_by && $scope.property.created_by.lastname) ? $scope.property.created_by.lastname : '';
            app_data.property_manager_name = $scope.first_name__ + ' ' + $scope.last_name__;
            app_data.agency_name = ($scope.property && $scope.property.created_by_agency_id && $scope.property.created_by_agency_id.name) ? $scope.property.created_by_agency_id.name : '';
            app_data.property_manager_email = ($scope.property && $scope.property.created_by && $scope.property.created_by.email) ? $scope.property.created_by.email : '';

            app_data.created_by = $localStorage.loggedInUserId;

            app_data.first_name = $localStorage.loggedInfirstname;
            app_data.last_name = $localStorage.loggedInlastname;
            app_data.property_address = $scope.property.address;

            app_data.status = 0;
            app_data.propertyId = app_data.property_id;
            app_data.bond = parseInt(app_data.bond) > 0 ? parseInt(app_data.bond) : 0;
            app_data.monthly_rent = parseInt(app_data.monthly_rent) > 0 ? parseInt(app_data.monthly_rent) : 0;
            app_data.weekly_rent = parseInt(app_data.weekly_rent) > 0 ? parseInt(app_data.weekly_rent) : 0;
            app_data.number_bedroom = parseInt(app_data.number_bedroom) > 0 ? parseInt(app_data.number_bedroom) : 0;
            app_data.preferred_length_of_lease_years = parseInt(app_data.preferred_length_of_lease_years) > 0 ? parseInt(app_data.preferred_length_of_lease_years) : 0;
            app_data.preferred_length_of_lease_months = parseInt(app_data.preferred_length_of_lease_months) > 0 ? parseInt(app_data.preferred_length_of_lease_months) : 0;

            app_data.inspection_status = (app_data.inspection_status == "1") ? true : false;
            app_data.access_tenancy_db = (app_data.access_tenancy_db == "1") ? true : false;
            app_data.need_help_moving_service = (app_data.need_help_moving_service == "1") ? true : false;
            app_data.documentation_status = (app_data.documentation_status == undefined || app_data.documentation_status == false) ? false : true;

            if (app_data.agent_specific) {
                var pagent_spec_arr = [];
                angular.forEach(app_data.agent_specific, function (value, key) {
                    pagent_spec_arr.push({
                        "question_id": key,
                        "status": (value == "1") ? true : false
                    });
                });
                app_data.agent_specific = pagent_spec_arr;
            }
            // console.log("Before  : ", app_data.documentation_status);

            if (app_data.documentation_status == false) {
                $scope.getDocumentList();
                app_data.document_id = $scope.docs_arr;
                app_data.documentation_status = true;
            } else {
                app_data.document_id = [];
                app_data.documentation_status = false;
            }
            app_data.agent_ids = $scope.send_agents;
            // console.log("app_data    ", app_data);
            // console.log("After : ", app_data.documentation_status);

            PropertyService.createPropertyApplication().post(app_data, function (response) {
                if (response.code == 200) {
                    $scope.applicationId = response.data._id;
                    toastr.success(response.message);
                    $scope.moveToAppEighthStep();
                    $scope.loginLoading = false;
                } else {
                    toastr.warning('Server busy please try again latter');
                    $scope.loginLoading = false;
                }
            });
        };

        $scope.application_details = {};
        $scope.getApplicationDetails = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            blockUI.start();
            var applicationId = $stateParams.id;
            $scope.applicationId = applicationId;
            if (applicationId) {
                var postData = {
                    "applicationId": applicationId
                };
                PropertyService.getpropertyApplicationByid().post(postData, function (response) {
                    if (response.code == 200) {
                        if (response.data) {
                            $scope.application_details = response.data;
                            var obj = {
                                "created_by": $scope.application_details.created_by._id
                            };

                            // console.log("consoled for IDssssss");
                            // console.log($scope.application_details.property_id.created_by_agency_id + " == " + $scope.logged_in_agency_id + " == " + roleId.agent + " == " + $scope.roleId);
                            // console.log($scope.application_details.created_by._id + " == " + $scope.loggedIn + " == " + $scope.application_details.property_id.owned_by + " == " + $scope.loggedIn);
                            // console.log($scope.application_details.property_id.created_by + " == " + $scope.loggedIn);

                            if (($scope.application_details.property_id.created_by_agency_id == $scope.logged_in_agency_id && roleId.agent == $scope.roleId) || $scope.application_details.created_by._id == $scope.loggedIn || $scope.application_details.property_id.owned_by == $scope.loggedIn || $scope.application_details.property_id.created_by == $scope.loggedIn) { } else {
                                // $location.path('/property_listing/');
                            }
                        }
                    }
                });
            }
            blockUI.stop();
        };

        /**
         *  Make specific application active
         * @access private
         * @return json
         * Created by 
         * @Narola : KEK
         * Created Date 24-01-2019
         */

        $scope.appli_property_details_click = function () {
            $scope.appli_property_details = "active";
            $scope.appli_property_occupacy = "";
            $scope.appli_property_agent_specific = "";
            $scope.appli_property_moving_service = "";
            $scope.appli_property_identification = "";
            $scope.appli_property_declaration = "";
        }

        $scope.appli_property_occupacy_click = function () {
            $scope.appli_property_details = "";
            $scope.appli_property_occupacy = "active";
            $scope.appli_property_agent_specific = "";
            $scope.appli_property_moving_service = "";
            $scope.appli_property_identification = "";
            $scope.appli_property_declaration = "";
        }

        $scope.appli_property_agent_specific_click = function () {
            $scope.appli_property_details = "";
            $scope.appli_property_occupacy = "";
            $scope.appli_property_agent_specific = "active";
            $scope.appli_property_moving_service = "";
            $scope.appli_property_identification = "";
            $scope.appli_property_declaration = "";
        }

        $scope.appli_property_moving_service_click = function () {
            $scope.appli_property_details = "";
            $scope.appli_property_occupacy = "";
            $scope.appli_property_agent_specific = "";
            $scope.appli_property_moving_service = "active";
            $scope.appli_property_identification = "";
            $scope.appli_property_declaration = "";
        }

        $scope.appli_property_identification_click = function () {
            $scope.appli_property_details = "";
            $scope.appli_property_occupacy = "";
            $scope.appli_property_agent_specific = "";
            $scope.appli_property_moving_service = "";
            $scope.appli_property_identification = "active";
            $scope.appli_property_declaration = "";
        }

        $scope.appli_property_declaration_click = function () {
            $scope.appli_property_details = "";
            $scope.appli_property_occupacy = "";
            $scope.appli_property_agent_specific = "";
            $scope.appli_property_moving_service = "";
            $scope.appli_property_identification = "";
            $scope.appli_property_declaration = "active";
        }

        $scope.openApplicationStatusPopup = function (status, application_id) {

            if (application_id && status && (status == "Decline" || status == "Approve")) {
                // console.log("i m inside");
                swal({
                    title: "Are you sure to '" + status + "' this Application?",
                    // text: "you want to " + status + " Application?",
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
                    var obj = {
                        status: (status == "Approve") ? '1' : '2',
                        applicationId: application_id,
                        applicant_email_id: $scope.application_details.created_by.email,
                        firstname: $scope.application_details.created_by.name
                    }
                    PropertyService.updateapplicationStatus().post(obj, function (response) {
                        if (response.code == 200) {
                            $scope.getApplicationDetails();
                            toastr.success("Application Status updated successfully.");
                            blockUI.stop();
                        } else {
                            toastr.error("Application Status not updated.");
                            blockUI.stop();
                        }
                    });
                });
            }
        }

        $scope.dateComparator = function (v1, v2) {
            if (v1.type === 'string' || v2.type === 'string') {
                if (v1.type === 'string' && v2.type === 'string') {
                    return (v1.index < v2.index) ? -1 : 1;
                } else if (v1.type === 'string') {
                    return 1;
                } else if (v2.type === 'string') { // v2.constructor.name !== 'Date'
                    return -1;
                }
            } else {
                // Compare date, taking locale into account
                return v1.value > v2.value ? 1 : (v1.value === v2.value ? 0 : -1);
            }
        };

        $scope.update_rent_bond = function () {
            var weekly_rent_ = $scope.applicationData.weekly_rent;
            var month_rent_ = ($scope.applicationData.weekly_rent * 52) / 12;
            var bond_ = ($scope.applicationData.weekly_rent * 4);
            $scope.applicationData.monthly_rent = month_rent_.toFixed(2);
            $scope.applicationData.bond = bond_.toFixed(2);
        }
    }
}());