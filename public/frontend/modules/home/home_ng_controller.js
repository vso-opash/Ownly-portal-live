/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 */
(function () {
    angular.module('SYNC')
        .controller("HomeCtrl", HomeCtrl);
        HomeCtrl.$inject = [
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
        'maintainService',
        'PropertyService',
        'userService',
        'TenantService',
        // 'HomeService',
        'socket'
    ];
    // HomeService
    function HomeCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AlertService, toastr, blockUI, blockUIConfig, $anchorScroll, maintainService, PropertyService, userService, TenantService, socket) {
        $scope.user = [];   
        
        // $scope.test = function () {
        //     console.log('\n homeController : ');
        //     HomeService.getAccessToken((res)=>{
        //         console.log('\n res : ', res);
        //     })
        // }
    } 
    console.log("caleed");
}());
