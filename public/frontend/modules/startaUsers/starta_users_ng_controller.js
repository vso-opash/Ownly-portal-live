/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 */
(function () {
    angular.module('SYNC')
        .controller("StratUserCtrl", StratUserCtrl);
    StratUserCtrl.$inject = [
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
        'StrataUserService'
    ];

    function StratUserCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AlertService, toastr, blockUI, blockUIConfig, $anchorScroll, StrataUserService) {
        $scope.pagination = {
            current: 1
        };
        $scope.isSearchedAgent = false;
        $scope.isPropertyOwner = ($localStorage.role_id  == roleId.owner)? true:false;
        $scope.isAgent = ($localStorage.role_id  == roleId.agent)? true:false;
        $scope.agent = {};
        $scope.filterMatch = 'By best match';
        /* Rating section start from here */
        $scope.rate = 5;
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
        //url for users portfolio images
        $scope.userImageUrl = baseUrl + '/user_image/';
        $scope.orderProperty = "";
        $scope.selected = 1;
        $scope.advanceSearchClass = "dropdown default-oder droplist";
        $scope.changeSelection = function (selectedData) {
            $scope.selected = (selectedData == 1) ? 1 : 2;
        }
        /**
         * Function is to get Agent list
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.getStartaUserList = function () {
            $scope.agencyCode = roleId.ownAgency;
            $scope.agentCode = roleId.agent;
            blockUI.start();
            var obj = {};
            $scope.imageUrl = baseUrl + '/user_image/';
            StrataUserService.getStartaList().get(function (response) {
                $scope.isSearchedAgent = false;
                if (response.code == 200) {
                    // console.log('response.data',response.data);
                    $scope.agentList = response.data;
                    blockUI.stop();
                } else {
                    $scope.agentList = [];
                    blockUI.stop();
                }
            });
            blockUI.stop();
        }
        $scope.getMyAgentList = function () {
            $scope.agent.name = '';
            $scope.agencyCode = roleId.ownAgency;
            $scope.agentCode = roleId.agent;
            $scope.roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
            blockUI.start();
            var obj = {};
            if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
                var agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                agencyId = ($stateParams.id) ? $stateParams.id : agencyId;
                obj.agency_id = agencyId;
                $scope.imageUrl = baseUrl + '/user_image/';
                StrataUserService.getMyAgentList().post(obj, function (response) {
                    $scope.isSearchedAgent = false;
                    if (response.code == 200) {
                        $scope.agentList = response.data;
                        blockUI.stop();
                    } else {
                        $scope.agentList = [];
                        blockUI.stop();
                    }
                });
            } else {
                $scope.agentList = [];
                blockUI.stop();
            }
            blockUI.stop();
        }
        $scope.pageChanged = function (page) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
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
        * Created Date 
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
                        StrataUserService.sendMessage().post(obj, function (response) {
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
    * Function is to sort agent listing
    * @access private
    * @return json
    * Created 
    * @smartData Enterprises (I) Ltd
    * Created Date 
    */
        $scope.setOrderProperty = function (sortBy) {
            $scope.orderProperty = sortBy;
            if (sortBy == 'firstname') {
                $scope.filterMatch = 'Name';
            } else if (sortBy == 'city') {
                $scope.filterMatch = 'City';
            } else {
                $scope.filterMatch = 'Address';
            }
        };
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
        * Function is to open remove agent modal
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */

        $scope.openRemoveTenant = function () {
            blockUI.start();
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.roleId = ($localStorage.role_id) ? $localStorage.role_id : '';;
            if ($scope.roleId == roleId.owner) {
                var modalInstance = $scope.model = $uibModal.open({
                    animation: false,
                    templateUrl: '/frontend/modules/agents/views/remove.html',
                    scope: $scope,
                    controller: function ($uibModalInstance, $scope) {
                        $scope.agentRemoval = {};
                        $scope.agentCheck = false;
                        $scope.removeAgentForm;

                        $scope.ok = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.removalInit = function () {
                            $scope.agent = {};
                            $scope.agentRemoval = {};
                            $scope.removed_req_to_user = [];
                        };
                        $scope.getAgencyProperty = function () {
                            blockUI.start();
                            var obj = {};
                            obj.request_by_id = $localStorage.loggedInUserId;
                            obj.request_by_role = $localStorage.role_id;
                            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                            }
                            StrataUserService.maintenceProperty().post(obj, function (response) {
                                if (response.code == 200) {
                                    $scope.propertyList = response.data;
                                    if ($scope.propertyList.length == 0 && response.data.length == $scope.propertyList.length) {
                                        $state.go('agents_listing');
                                        toastr.warning("You are not associated with any property to add new maintenance request");
                                        $scope.cancel();
                                    }
                                    blockUI.stop();
                                } else {
                                    $state.go('agents_listing');
                                    toastr.warning("You are not associated with any property to add new maintenance request");
                                    blockUI.stop();
                                    $scope.cancel();
                                }
                            });
                            blockUI.stop();
                        };
                        $scope.getPropertyAgent = function (value) {
                            var id = JSON.parse(value);
                            $scope.agentRemoval.property_id = id._id;
                            $scope.agentRemoval.removed_req_by_user = $localStorage.loggedInUserId;
                            $scope.removed_req_to_user = [];
                            $scope.removed_req_to_user[0] = id.created_by._id;
                            $scope.agentRemoval.removed_req_to_user = [];
                            $scope.agentRemoval.removed_req_to_user = $scope.removed_req_to_user;
                            $scope.agentInfo = id.created_by.firstname + " " + id.created_by.lastname;
                        }
                        $scope.sendRemovalRequest = function (agent, flag) {
                            if ($scope.removeAgentForm.$invalid == true) {
                                toastr.error('Please the form completely');
                            } else {
                                if (flag == true) {
                                    $scope.agentRemoval.reason_of_removal_req = (agent.reason_of_removal_req) ? agent.reason_of_removal_req : '';
                                    var obj = {};
                                    obj = $scope.agentRemoval;
                                    StrataUserService.agentRemoval().post(obj, function (response) {
                                        if (response.code == 200) {
                                            toastr.success("Successfully sent agent removal request to the admin");
                                            $scope.propertyList = [];
                                            $scope.cancel();
                                            blockUI.stop();
                                        } else {
                                            toastr.warning("Server is busy please after some time");
                                            blockUI.stop();
                                        }
                                    });
                                    blockUI.stop();

                                } else {
                                    toastr.warning('Please check the agent removal check box');
                                    blockUI.stop();
                                }

                            }
                        }

                    }
                });
                modalInstance.result.then(function (selectedItem) {

                }, function () { });
                blockUI.stop();
            } else {
                toastr.warning("You do not have access permission");
                blockUI.stop();
            }


        };
        /**
         * Function is to show agent with in my agency
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.agencyCode = function () {
            StrataUserService.getAgencyAgentList().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.agentList = response.data;
                    blockUI.stop();
                } else {
                    $scope.agentList = [];
                    blockUI.stop();
                }
            });
        }
        /**
         * Function is for agent search
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.agentSearch = function (agent) {
            if(agent.name||agent.city||agent.city||agent.state||agent.zipCode){
            $scope.agencyCode = roleId.ownAgency;
            $scope.agentCode = roleId.agent;
            $scope.roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
            blockUI.start();
            var obj = {};
            if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
                var agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                agencyId = ($stateParams.id) ? $stateParams.id : agencyId;
                obj.agency_id = agencyId;
                obj.firstname = (agent.name) ? agent.name : '';
                obj.state = (agent.state) ? agent.state : '';
                obj.city = (agent.city) ? agent.city : '';
                obj.zip_code = (agent.zipCode) ? agent.zipCode : '';
                $scope.imageUrl = baseUrl + '/user_image/';
                StrataUserService.getMyAgentList().post(obj, function (response) {
                    $scope.isSearchedAgent = true;
                    if (response.code == 200) {
                        $scope.agentList = response.data;
                        $scope.agent.name = '';
                        $scope.agent.city = '';
                        $scope.agent.state = '';
                        $scope.agent.zipCode = '';
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                        angular.element('#agentSearchPopUp').hide();
                        blockUI.stop();
                        $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
                    } else {
                        $scope.agentList = [];
                        blockUI.stop();
                    }
                });
            } else {
                $scope.agentList = [];
                blockUI.stop();
            }
            blockUI.stop();
        }else{
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
            $scope.agent.name = '';
            $scope.agent.city = '';
            $scope.agent.state = '';
            $scope.agent.zipCode = '';
            var agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            agencyId = ($stateParams.id) ? $stateParams.id : agencyId;
            obj.agency_id = agencyId;
            obj.user_id = $localStorage.userData._id;
            $scope.imageUrl = baseUrl + '/user_image/';
            StrataUserService.getAgencyAgentList().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.agentList = response.data;
                    blockUI.stop();
                } else {
                    $scope.agentList = [];
                    blockUI.stop();
                }
            });
            $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
        }
        $scope.showPopup = function(){
            angular.element('#agentSearchPopUp').show();
        }
        $scope.hideSearchFilter = function(){
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            angular.element('#agentSearchPopUp').hide();
        }
    }
}());