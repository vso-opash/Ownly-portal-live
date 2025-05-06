/**
 * Super Agency HUB Controller
 * @created 23 July 2020
 */

(function () {
    angular.module('SYNC')
        .controller("AgencyhubCtrl", AgencyhubCtrl);
    AgencyhubCtrl.$inject = [
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
        'AgentService',
        'AgencyService',
        'agreementService',
        'TenantService',
        'PropertyService',
        'AgencyhubService'
    ];

    function AgencyhubCtrl(
        $state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AlertService, toastr, blockUI, blockUIConfig, $anchorScroll, AgentService, AgencyService, agreementService, TenantService, PropertyService, AgencyhubService
    ) {

        $scope.agency = {};
        $scope.userInfo = {};
        $scope.agentsList = [];
        $scope.agencyStatsData = {};
        $scope.pagination = {
            current: 1
        };
        $scope.userImageUrl = baseUrl + '/user_image/';
        let agencyId;

        if ($localStorage.userData.agency_id) {
            agencyId = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
        }

        $scope.initialize = function () {
            console.log('init function :: agency hub => ');
            AgencyService.agencyProfileData().post({
                "agency_id": agencyId,
                "role_id": roleId.ownAgency
            }, function (response) {
                console.log("response :: agency profile data =>", response);
                if (response.code == 200) {
                    $scope.agency = response.data[0];
                    $scope.totalManagerCount = response.total_manager;
                    $scope.userInfo = (response.data[0]) ? response.data[0].users : '';

                    // if (response.data && response.data[1] && response.data[1].value)
                    //     $scope.propertyCount = response.data[1].value;

                    // if ($scope.userInfo && $scope.userInfo._id && $scope.userInfo._id == $localStorage.loggedInUserId) {
                    //     $scope.view = true;
                    // } else {
                    //     $scope.view = false;
                    // }
                    // $scope.isAll = true;
                    // $scope.tenantReview = false;
                    // $scope.ownerReview = false;
                    // $scope.showReview('all', $scope.userInfo._id);
                    // $scope.userImageUrl = baseUrl + '/user_image/';
                    $scope.getAgencyReview($scope.userInfo._id);
                    $scope.getAgentsList();
                }
            });
        }

        /**
         * Used to get agency review
         */
        $scope.getAgencyReview = function (id) {
            $scope.createdByRate = {};
            TenantService.getReviewForUser(id).get(function (response) {
                console.log('response :: Review response     => ', response);
                if (response.code == 200) {
                    $scope.createdByRate = response;
                    $scope.createdByRate.data = ($scope.createdByRate.data > 0) ? $scope.createdByRate.data : 0;
                    $scope.createdByRate.total_review = ($scope.createdByRate.total_review) ? $scope.createdByRate.total_review : 0;
                } else {
                    $scope.createdByRate.data = 0;
                    $scope.createdByRate.total_review = 0;
                }
                console.log('$scope.createdByRate => ', $scope.createdByRate);
            });

        };

        /**
         * Used to get agenct list with in agency with stats
         */
        $scope.getAgentsList = function () {
            let startDate = moment().subtract(30, 'days').calendar();
            let endDate = moment().add(1, 'days');
            const obj = {
                "agency_id": agencyId,
                "start_date": moment(startDate).format('YYYY-MM-DD'),
                "end_date": moment(endDate).format('YYYY-MM-DD')
            }
            console.log('obj  :: check here for req.obj =======> ', obj);
            AgencyhubService.agencyhub().post(obj, function (response) {
                console.log('response :: agencyhub api => ', response);
                if (response.code == 200) {
                    $scope.agentsList = response.data;
                    $scope.agencyStatsData = response.agencyData;
                    console.log(' $scope.agentsList => ', $scope.agentsList);
                } else {
                    $scope.agentsList = [];
                }
            })
        }

    }
}());