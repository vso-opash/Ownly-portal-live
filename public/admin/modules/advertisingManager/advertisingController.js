(function () {
    angular.module('TSM_ADMIN')
        .controller("AdvertisingController", AdvertisingController);
    AdvertisingController.$inject = [
        '$state',
        '$route',
        '$scope',
        '$localStorage',
        '$rootScope',
        '$http',
        '$filter',
        '$window',
        '$location',
        '$stateParams',
        'blockUI',
        'AdvertiseService',
        'toastr',
        'ngTableParams',
        'Upload',
        'PropertyService'
    ];

    function AdvertisingController($state, $route, $scope, $localStorage, $rootScope, $http, $filter, $window, $location, $stateParams, blockUI, AdvertiseService, toastr, ngTableParams, Upload, PropertyService) {
        $scope.ad = {};
        $scope.advertiseData = {};
        $scope.greeting = '123456789';
        $rootScope.userManagementActive;
        $scope.roleId = roleId;
        $scope.searchByUserType = 'All';
        $scope.activeDashboard = function () {
            $rootScope.dashboardActive = " ";
            $rootScope.dashboardStatus = " ";
            $rootScope.userStatus = " ";
            $rootScope.advertisingStatus = "active";
            $rootScope.traderUserStatus = "";
            $rootScope.agencyStatus = "";
            $rootScope.profileActive = " ";
            $rootScope.profileStatus = " ";
            $rootScope.proepertyStatus = " ";
            $rootScope.userManagementActive = "";
            $rootScope.propertyManagementActive = " ";
            $rootScope.maintenanceStatus = " ";
        }();
        //tiny mce options configuration
        $scope.tinymceOptions = {
            resize: false,
            height: "450px",
            // plugins: [
            //     'advlist autolink lists link image charmap print preview anchor textcolor',
            //     'searchreplace visualblocks code fullscreen',
            //     'insertdatetime media table contextmenu paste code help',
            //     'noneditable'
            // ],
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent"

        };
        $scope.controllerInitialization = function () {
            console.log('init function :: advertising manager => ');
        }();

        $scope.activeDashboard = function () {
            $rootScope.dashboardActive = " ";
            $rootScope.dashboardStatus = " ";
            $rootScope.userStatus = " ";
            $rootScope.traderUserStatus = "";
            $rootScope.profileActive = " ";
            $rootScope.profileStatus = " ";
            $rootScope.proepertyStatus = " ";
            $rootScope.userManagementActive = " ";
            $rootScope.propertyManagementActive = " ";
            $rootScope.advertisingStatus = "active";
            $rootScope.maintenanceStatus = " ";
        }();

        $scope.addAdvertiseInit = function () {
            console.log('add advertise => ');
        }

        $scope.back = function () {
            $window.history.back();
        }

        // List Ad
        $scope.getAdvertiseList = function (searchtext) {
            blockUI.start();
            $scope.advertiseList = [];
            console.log('ad list 3 => ');
            $scope.imageUrl = baseUrl + '/advertise_image';
            postData = {};
            if (searchtext) {
                // postData.searchtext = parseFloat(searchtext);
                postData.searchtext = searchtext;
            }

            // postData.searchtext = searchtext;
            // postData.user_id = $localStorage.adminData._id;

            AdvertiseService.adList().post(postData, function (response) {
                console.log('response => ', response);
                if (response.code == 200) {
                    blockUI.stop();
                    $scope.advertiseList = response.data;
                    console.log('ad list 1 => ');
                } else {
                    blockUI.stop();
                    $scope.advertiseList = [];
                    console.log('ad list 2 => ');
                }
            }, err => {
                console.log('err => ', err);
                blockUI.stop();
                $scope.advertiseList = [];
            });
        }

        // Reset search filter
        $scope.resetSearch = function () {

            // $scope.searchBycategory = '';
            // $scope.searchUser = '';
            // $scope.reverseUser = true;
            // $scope.columnUser = 'createdAt';
            // $scope.sortRecentUserColumn('');
            $scope.searchAdvertiseData = '';
            $scope.getAdvertiseList();
        }

        // ad Detail
        $scope.adDetailView = function () {
            $scope.imageUrl = baseUrl + '/advertise_image/';
            blockUI.start();
            var obj = {};
            console.log('$stateParams.id => ', $stateParams.id);
            obj.id = $stateParams.id;
            AdvertiseService.adDetail().post(obj, function (response) {
                console.log('response => ', response);
                if (response.code == 200) {
                    $scope.advertiseData = response.data[0];
                    console.log('$scope.advertiseData => ', $scope.advertiseData);
                    if ($scope.advertiseData.adLocation == 'property_detail') {
                        $scope.advertiseData.adLocation = "Property Detail"
                    }
                    blockUI.stop();
                } else {
                    $state.go('advertisingManager');
                    toastr.error('No record found!');
                }
            })
        }

        // postcode click
        $scope.postcodeClick = function (data) {
            console.log('data => ', data);
            if (data) {
                document.getElementById('adState').disabled = true;
            } else {
                document.getElementById('adState').disabled = false;
            }
            console.log('postcode click function :: ad data => ', $scope.ad);
            if ($scope.ad.state) {
                $scope.ad.state = ''
            }

        }

        // state click
        // $scope.stateClick = function (data) {
        //     console.log('State click function :: ad data => ', $scope.ad);
        //     if ($scope.ad.postcode) {
        //         $scope.ad.postcode = ''
        //     }
        // }

        // state changed
        $scope.changedState = function (data) {
            console.log('data :: state value => ', data);
            console.log('State change function :: ad data => ', $scope.ad);
            if ($scope.ad.postcode) {
                $scope.ad.postcode = ''
                console.log('document.getElementsByName(`postcode`) => ', document.getElementsByName('postcode'));
            }
            document.getElementById('adPostcode').disabled = true;
        }

        // add ad
        $scope.addAdvertise = function (data) {
            console.log("==> ", data, "data");
            // $scope.imageUrl = baseUrl + '/user_image/';
            if (data.file) {
                blockUI.start();
                var adData = {
                    "name": data.adName,
                    "postcode": data.postcode,
                    "state": data.state,
                    "url": data.webURL,
                    "status": data.adStatus,
                    "adLocation": data.adLocation,
                    "comments": data.comments,
                    "file": data.file
                }

                AdvertiseService.addAd().post(adData, function (response) {
                    if (response.code == 200) {
                        if (adData.file) {
                            console.log('file => ');
                            $scope.uploadAdFile(adData.file, response.data._id);
                        } else {
                            blockUI.stop();
                        }
                    } else {
                        toastr.warning('Server busy please try again latter');
                        blockUI.stop();
                    }
                }, (err) => {
                    console.log('err => ', err);
                    blockUI.stop();
                });
            } else {
                console.log('no file => ');
                toastr.warning('Please add advertise image.');
            }
        }

        // update ad
        $scope.updateAdvertiseStatus = function (data) {
            console.log("==> ", data, "data");
            // $scope.imageUrl = baseUrl + '/user_image/';
            blockUI.start();
            var adUpdateData = {
                "adId": $stateParams.id,
                "status": data.status
            }

            AdvertiseService.updateAdStatus().post(adUpdateData, function (response) {
                console.log('response => ', response);
                if (response.code == 200) {
                    blockUI.stop();
                    toastr.success(response.message);
                    $state.go('advertisingManager');
                } else {
                    toastr.warning('Server busy please try again latter');
                    blockUI.stop();
                }
            }, (err) => {
                console.log('err => ', err);
                blockUI.stop();
            });
        }

        $scope.uploadAdFile = function (files, data) {
            console.log('upload image function => ', files, data);
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    console.log('file => ', file);
                    if (!file.$error) {
                        Upload.upload({
                            url: baseUrl + '/api/createAdvertiseImage',
                            data: {
                                _id: data,
                                file: file,
                            }
                        }).then(function (response) {
                            if (response.status == 200) {
                                toastr.success('Advertise created Successfully');
                                blockUI.stop();
                                $state.go('advertisingManager');
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

    }
}());

