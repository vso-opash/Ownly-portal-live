/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 */
(function () {
    angular.module('SYNC')
        .controller("RentalCtrl", RentalCtrl);
        RentalCtrl.$inject = [
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
    ];

    function RentalCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AlertService, toastr, blockUI, blockUIConfig, $anchorScroll) {
        $scope.pagination = {
            current: 1
        };
        $scope.addAgreement = function(){
            // console.log("fdgfaj");
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $state.go('rentalCase');
        }
    }
}());