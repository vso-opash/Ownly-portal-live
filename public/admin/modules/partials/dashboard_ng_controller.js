/**
 * Super Angular Controller
 * @author Ankur A
 * @created 10 August
 */
(function () {
    angular.module('TSM_ADMIN')
        .controller("DashboardCtrl", DashboardCtrl);
    DashboardCtrl.$inject = [
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
        'localStorageService',
        'blockUI',
        'DashboardService',
        'PropertyService'
    ];

    function DashboardCtrl($state, $route, $scope, $localStorage, $rootScope, $http, $filter, $window, $location, $stateParams, localStorageService, blockUI, DashboardService, PropertyService) {
        $scope.totalPropertyCount = 0;
        $scope.PropertySaleCount = 0;
        $scope.PropertyRentalCount = 0;
        $scope.totalUserCount = 0;
        $rootScope.dashboardActive;
        $scope.activeDashboard = function () {
            $rootScope.dashboardActive = " ";
            $rootScope.dashboardStatus = "active";
            $rootScope.userStatus = "";
            $rootScope.traderUserStatus = "";
            $rootScope.agencyStatus = "";
            $rootScope.profileActive = " ";
            $rootScope.profileStatus = " ";
            $rootScope.proepertyStatus = " ";
            $rootScope.userManagementActive = "";
            $rootScope.propertyManagementActive = " ";
            $rootScope.advertisingStatus = " ";
            $rootScope.maintenanceStatus = " ";
        }();
        $scope.removeableAgentList = [];
        $scope.getAdminAgentRemovalList = function () {
            DashboardService.getAgentRemovalList().get(function (response) {
                if (response.code == 200) {
                    $scope.removeableAgentList = response.data;
                    blockUI.stop();
                } else {
                    $scope.removeableAgentList = [];
                    blockUI.stop();
                }
            })
        }
        /**
         * Function is used for geting single property
         * @access private
         * @return json
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 20-Sep-2017
         */
        $scope.singleProperty = [];
        $scope.getSinglePropertyDetail = function () {
            blockUI.start();
            $scope.imageUrl = baseUrl + '/uploads';
            $scope.agentImageUrl = baseUrl + '/user_image';
            var obj = {};
            obj.propertyId = $stateParams.id;
            DashboardService.getSingleProperty().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.singleProperty = response.data;
                    blockUI.stop();
                    //$scope.mapInit($scope.singleProperty);
                } else {
                    blockUI.stop();
                    $state.go("noPropertyFound");
                }
            })

        }

        $scope.propertyDetails = [];
        $scope.is_creater = false;
        $scope.getSinglePropertyDetail = function () {
            $scope.imageUrl = baseUrl + '/uploads';
            $scope.agentImageUrl = baseUrl + '/user_image';
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            blockUI.start();
            var propertyId = $stateParams.id;
            var user_id = $localStorage.loggedInUserId;
            if (propertyId) {
                var postData = {
                    "propertyId": propertyId
                };
                DashboardService.getSingleProperty().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.singleProperty = response.data[0];
                        $scope.propertyDetails = response.data[0];
                        $scope.property = response.data[0];
                        $scope.property.isTownHouse = ($scope.property.isTownHouse == false) ? "1" : "2";
                        if (response.data[0].created_by._id == user_id) {
                            $scope.is_creater = true;
                        }
                        if (response.data[0].image.length == 0) {
                            $scope.property.files = image;
                        }
                        // $scope.mapInit(response.data[0]);
                        // $scope.getTenantName($scope.property._id);
                        // $scope.getCreatedByReview($scope.property.created_by._id);
                        blockUI.stop();
                    } else {
                        toastr.warning('No properties found');
                        blockUI.stop();
                    }
                });
            }
            blockUI.stop();
        };
        $scope.property = {
            amenities: [],
            files: [{ "$ngfName": "", "$ngfBlobUrl": "" }],
            images: ''
        };
        $scope.getAmenities = function () {
            DashboardService.getAmenities().get(function (response) {
                console.log("response.data=======", response.data);
                if (response.code == 200) {
                    $scope.amenitiesList = response.data;
                    angular.forEach($scope.amenitiesList, function (val, index) {
                        $scope.property.amenities.push({ amenity_id: val._id, amenity_name: val.name, is_checked: false });
                    });
                }
            });
        };

        $scope.getTenantName = function (id) {
            debugger
            var obj = {};
            obj.property_id = id;
            DashboardService.getTenantNameOnPropertyDetail().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.tenantsName = response.data;
                } else {
                    $scope.tenantsName = [];
                }
            });

        };

        /**
             * Function is use to load map on property detail page
             * @return json
             * Created by Minakshi K 
             * @smartData Enterprises (I) Ltd
             * Created Date 22-Sept-2017
             */
        // $scope.mapInit = function (singleProperty) {
        //     var latitude = parseFloat(singleProperty.latitude);
        //     var longitude = parseFloat(singleProperty.longitude);
        //     var location = { lat: latitude, lng: longitude };
        //     var map = new google.maps.Map(document.getElementById('googleMap'), {
        //         center: location,
        //         zoom: 9
        //     });
        //     var marker = new google.maps.Marker({
        //         position: location,
        //         map: map
        //     });
        // }
        /**
         * Function is used for geting single property
         * @access private
         * @return json
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 20-Sep-2017
         */
        // $scope.getRecentAddedPropertyList = function () {
        //     blockUI.start();
        //     $scope.imageUrl = baseUrl + '/uploads';
        //     DashboardService.getRecentAddedProperty().get(function (response) {
        //         if (response.code == 200) {
        //             blockUI.stop();
        //             $scope.recentProperty = response.data;
        //         }else{
        //             $scope.recentProperty = [];
        //             blockUI.stop();
        //         }

        //     })

        // }
        /**
         * Function is used for geting unapproved property
         * @access private
         * @return json
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 20-Sep-2017
         */
        // $scope.getUnapprovedProperty = function () {
        //     blockUI.start();
        //     $scope.imageUrl = baseUrl + '/uploads';
        //     DashboardService.getUnapprovedProperty().get(function (response) {
        //         if (response.code == 200) {
        //             $scope.unApprovedProperty = response.data;
        //             blockUI.stop();
        //         }else{
        //             $scope.unApprovedProperty = [];
        //             blockUI.stop();
        //         }
        //     })
        // }
        $scope.column = 'title';
        $scope.columnRecent = 'title';
        $scope.reverseRecent = false;
        $scope.columnFeatured = 'title';
        $scope.reverseFeatured = false;
        // sort ordering (Ascending or Descending). Set true for desending
        $scope.reverse = false;

        // called on header click
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
            } else {
                $scope.reverse = true;
            }
        };
        $scope.sortRecentPropertyColumn = function (col) {
            console.log("col", col);
            $scope.columnRecent = col;
            if ($scope.reverseRecent) {
                $scope.reverseRecent = false;
            } else {
                $scope.reverseRecent = true;
            }
        };
        $scope.sortFeaturedPropertyColumn = function (col) {
            console.log("col", col);
            $scope.columnFeatured = col;
            if ($scope.reverseFeatured) {
                $scope.reverseFeatured = false;
            } else {
                $scope.reverseFeatured = true;
            }
        };
        // remove and change class
        $scope.sortClassProperty = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };
        // $scope.getFeaturedProperty = function(){
        //     console.log("hello");
        //     PropertyService.featuredProperty().get(function (response) {
        //         console.log("hello");
        //         if (response.code == 200) {
        //             console.log("hello");
        //             blockUI.stop();
        //             $scope.featuredPropertyList = response.data;
        //         } else {
        //             blockUI.stop();
        //              $scope.featuredPropertyList = [];
        //         }

        //     });
        // } 
        // remove and change class
        $scope.sortClassRecentProperty = function (col) {
            if ($scope.columnRecent == col) {
                if ($scope.reverseRecent) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        }
        $scope.sortClassFeaturedProperty = function (col) {
            if ($scope.columnFeatured == col) {
                if ($scope.reverseFeatured) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        }
        $scope.getAdminStatisticsData = function () {
            DashboardService.getAdminStatisticsData().post({}, function (response) {
                if (response.code == 200) {
                    $scope.statisticsData = response.data;
                } else {
                    toastr.warning('Something went wrong.');
                }
            })
        }
    }
}());