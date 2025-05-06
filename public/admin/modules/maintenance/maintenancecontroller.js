(function () {
    angular.module('TSM_ADMIN')
        .controller("MaintenanceCtrl", MaintenanceCtrl);
    MaintenanceCtrl.$inject = [
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
        'toastr',
        'ngTableParams',
        'Upload',
        'MaintenanceService'
    ];

    function MaintenanceCtrl($state, $route, $scope, $localStorage, $rootScope, $http, $filter, $window, $location, $stateParams, blockUI, toastr, ngTableParams, Upload, MaintenanceService) {
        $scope.activeDashboard = function () {
            $rootScope.dashboardActive = " ";
            $rootScope.dashboardStatus = " ";
            $rootScope.userStatus = "";
            $rootScope.traderUserStatus = "";
            $rootScope.agencyStatus = "";
            $rootScope.profileActive = " ";
            $rootScope.profileStatus = "";
            $rootScope.proepertyStatus = "";
            $rootScope.maintenanceStatus = "active";
            $rootScope.userManagementActive = "";
            $rootScope.propertyManagementActive = "";
            $rootScope.advertisingStatus = " ";
        }();

        /**
         * Function is used to get all MR count as per status
         * @access private
         */
        $scope.getMRcount = function () {
            let obj = {}
            if ($localStorage.adminData._id) {
                obj = {
                    request_by_id: $localStorage.adminData._id,
                }
                MaintenanceService.getAdminMRcounts().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.MRcount = response.data;
                        console.log('$scope.MRcount ======> ', $scope.MRcount);
                    } else {
                        $scope.MRcount = {};
                    }
                });
            } else {
                console.log('logged in user id not found => ');
            }
        }

        /**
        * Function is used to get all MR
        * @access private
        * @return json
        */
        $scope.getMRList = function (current_page) {
            console.log('function => ');
            blockUI.start();
            $scope.maintenanceList = [];
            $scope.imageUrl = baseUrl + '/maintenance';
            let obj = {}
            if ($localStorage.adminData._id) {
                obj = {
                    request_by_id: $localStorage.adminData._id,
                    current_page: current_page,
                    number_of_pages: 10
                }
            }
            MaintenanceService.maintenanceList().post(obj, function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    $scope.maintenanceList = response.data;
                    $scope.totalRecord = response.totalCount;
                } else {
                    blockUI.stop();
                    $scope.maintenanceList = [];
                }
            });
        }

        /**
         * Function used to get data as per page number
         * Pagination on click function
         */
        $scope.paginationClick = function (current_page) {
            $scope.getMRList(current_page);
        }
    }
}());