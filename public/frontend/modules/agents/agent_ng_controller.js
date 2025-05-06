/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 */
(function () {
    angular.module('SYNC')
        .controller("AgentCtrl", AgentCtrl);
    AgentCtrl.$inject = [
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
        'PropertyService'
    ];

    function AgentCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AlertService, toastr, blockUI, blockUIConfig, $anchorScroll, AgentService, AgencyService, agreementService, PropertyService) {
        $scope.pagination = {
            current: 1
        };
        $scope.myagent_section = false;
        $scope.isSearchedAgent = false;
        $scope.allroleId = roleId;
        $scope.ownerRoleId = roleId.owner;
        $scope.tenantRoleId = roleId.tenant;
        $scope.isPropertyOwner = ($localStorage.role_id == roleId.owner) ? true : false;
        $scope.isAgent = ($localStorage.role_id == roleId.agent) ? true : false;
        $scope.agent = {};
        $scope.filterMatch = 'By best match';
        /* Rating section start from here */
        $scope.rate = 5;
        $scope.max = 5;
        $scope.isReadonly = false;
        $scope.loggedUserId = $localStorage.loggedInUserId;
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
        $scope.getAgentList = function () {

            $scope.agencyCode = roleId.ownAgency;
            $scope.agentCode = roleId.agent;
            $scope.agent.name = '';
            $scope.roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
            $scope.myagent_section = false;

            blockUI.start();
            var obj = {};
            // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
            var agencyId = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            agencyId = ($stateParams.id) ? $stateParams.id : agencyId;
            obj.agency_id = agencyId;
            obj.user_id = $localStorage.userData._id;
            $scope.imageUrl = baseUrl + '/user_image/';

            // if ($scope.roleId == roleId.ownAgency) {
            //     AgentService.getMyAgentList().post(obj, function (response) {
            //         $scope.isSearchedAgent = false;
            //         if (response.code == 200) {
            //             $scope.agentList = response.data;
            //             blockUI.stop();
            //         } else {
            //             $scope.agentList = [];
            //             blockUI.stop();
            //         }
            //     });
            // } else {
            AgentService.getAgentList().get(function (response) {
                $scope.isSearchedAgent = false;
                if (response.code == 200) {
                    $scope.agentList = response.data;
                    blockUI.stop();
                } else {
                    $scope.agentList = [];
                    blockUI.stop();
                }
            });
            // }
            // } else {

            //     AgentService.getAgentList().get(function (response) {
            //         $scope.isSearchedAgent = false;
            //         if (response.code == 200) {
            //             console.log("5");
            //             $scope.agentList = response.data;
            //             blockUI.stop();
            //         } else {
            //             console.log("6");
            //             $scope.agentList = [];
            //             blockUI.stop();
            //         }
            //     });

            //     blockUI.stop();
            // }
            blockUI.stop();

        }
        $scope.getMyAgentList = function () {
            $scope.agentList = [];
            $scope.myagent_section = true;
            $scope.agent.name = '';
            $scope.agencyCode = $scope.allroleId.ownAgency;
            $scope.agentCode = $scope.allroleId.agent;
            $scope.roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
            blockUI.start();
            var obj = {};
            if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
                var agencyId = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                agencyId = ($stateParams.id) ? $stateParams.id : agencyId;
                obj.agency_id = agencyId;
                $scope.imageUrl = baseUrl + '/user_image/';

                if ($localStorage.role_id == $scope.allroleId.tenant) {

                    var agree_obj = {};
                    if ($localStorage.userData.agency_id) {
                        agree_obj.agency_id = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                    }
                    agree_obj.created_by = $localStorage.loggedInUserId;
                    agree_obj.request_by_role = $localStorage.role_id;
                    $scope.agency_id_list = [];
                    agreementService.agreementListing().post(agree_obj, function (response) {
                        if (response.code == 200) {
                            $scope.agreementList = response.data;
                            angular.forEach($scope.agreementList, function (value, key) {
                                $scope.agency_id_list.push(value.agency_id);
                            });

                            var obj = {};
                            obj.agency_id = $scope.agency_id_list;
                            AgentService.agentsListByLinkedAgency().post(obj, function (response) {
                                $scope.isSearchedAgent = false;
                                if (response.code == 200) {
                                    $scope.agentList = response.data;
                                    blockUI.stop();
                                } else {
                                    $scope.agentList = [];
                                    blockUI.stop();
                                }
                            });

                        }
                    });
                }
                else if ($localStorage.role_id == $scope.allroleId.owner) {
                    var agencyId_ = '';
                    $scope.sortText = '';
                    if ($localStorage.userData.agency_id) {
                        agencyId_ = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                    }
                    var userId_ = $localStorage.loggedInUserId;
                    var roleId_ = ($localStorage.role_id) ? $localStorage.role_id : '';
                    var postData = {
                        "request_by_id": $localStorage.loggedInUserId,
                        // "agency_id": agencyId_,
                        "request_by_role": roleId_,
                        "user_id": userId_
                    };

                    PropertyService.getPropertyListing().post(postData, function (response) {
                        if (response.code == 200) {
                            $scope.propertyList_1 = new Array();
                            $scope.propertyList_1 = response.data;

                            $scope.agency_id_list = [];
                            if ($scope.propertyList_1 && $scope.propertyList_1.length > 0) {
                                $scope.propertyList_1.map(function (value, key) {
                                    if (value && value.created_by_agency_id) {
                                        $scope.agency_id_list.push(value.created_by_agency_id);
                                    }
                                });
                                var obj = {};
                                obj.agency_id = $scope.agency_id_list;
                                AgentService.agentsListByLinkedAgency().post(obj, function (response) {
                                    $scope.isSearchedAgent = false;
                                    if (response.code == 200) {
                                        $scope.agentList = response.data;
                                        blockUI.stop();
                                    } else {
                                        $scope.agentList = [];
                                        blockUI.stop();
                                    }
                                });
                            }

                            blockUI.stop();
                        } else {
                            blockUI.stop();
                        }
                    });
                } else {
                    AgentService.getMyAgentList().post(obj, function (response) {
                        $scope.isSearchedAgent = false;
                        if (response.code == 200) {
                            $scope.agentList = response.data;
                            blockUI.stop();
                        } else {
                            $scope.agentList = [];
                            blockUI.stop();
                        }
                    });
                }

            } else {
                $scope.agentList = [];
                blockUI.stop();
            }
            blockUI.stop();
        }
        $scope.pageChanged = function (page) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }

        $scope.getDate = function () {
            var d = moment().format('YYYY-MM-DD h:mm:ss a');
            var n = moment().format("MMM Do") + ', ' + moment().format('LT');
            return n;
        }

        /**
         * Bulk Delete Agents
         */
        $scope.allOption = "All";
        var modelScope = {
            "checkboxModel": "checkboxModel",
            "selectedItems": "selectedItems"
        };
        $scope.checkboxModel = [];
        $scope.selectedItems = [];

        $scope.onClickFn = function (val) {
            console.log('val :: on click function :: check for checked =====> ', val);
            if (val == $scope.allOption) {
                resultsFnAll();
            } else {
                addorRemoveItems(val);
            }
        };
        function addorRemoveItems(val) {
            console.log('val :: add or remove items function =======> ', val);
            if (val.checked) {
                console.log('push condition => ');
                $scope[modelScope.selectedItems].push(val);
            } else if (!(val.checked)) {
                console.log('2nd condition :: splice => ');
                $scope[modelScope.selectedItems].splice($scope[modelScope.selectedItems].indexOf(val), 1);
            } else {
                console.log('else part => ');
            };
            if ($scope[modelScope.selectedItems].length >= ($scope.agentList.length)) {
                $scope[modelScope.checkboxModel][$scope.allOption] = true;
            } else {
                $scope[modelScope.checkboxModel][$scope.allOption] = false;
            }
        };
        function resultsFnAll() {
            console.log('result function all ====> ');
            var allVal = $scope[modelScope.checkboxModel][$scope.allOption];
            console.log('allVal :: result all value function ====> ', allVal);
            if (allVal) {
                $scope[modelScope.selectedItems] = angular.copy($scope.agentList);
                $scope.agentList.forEach(agent => {
                    agent.checked = true;
                });
            } else {
                $scope[modelScope.selectedItems] = [];
                $scope.agentList.forEach(agent => {
                    agent.checked = false;
                });
            }
        };

        $scope.bulkDelete = function (agentlist) {
            console.log('agentlist => ', agentlist);
            console.log('$scope[modelScope.selectedItems] => ', $scope[modelScope.selectedItems]);
            let array = [];
            $scope[modelScope.selectedItems].map(ele => {
                console.log('ele => ', ele);
                array.push(ele._id)
            })
            console.log('array :: final array with id => ', array);
            // call api to bulk delete agents

            if (array && array.length > 0) {
                swal({
                    title: "",
                    // title: "Please make sure you have changed the agent on all of this agent's properties",
                    text: "Please make sure you have changed the agent on all of this agent's properties",
                    // imageUrl: '/assets/images/logo_color_blue.png',
                    imageUrl: '/assets/images/logo-dark.png',
                    imageWidth: 10,
                    imageHeight: 10,
                    maxHeight: 45,
                    showCancelButton: true,
                    confirmButtonColor: "#ff0000",
                    cancelButtonText: "Cancel",
                    confirmButtonText: "Delete",
                    imageAlt: 'Custom image',
                    closeOnConfirm: true
                }, function () {
                    blockUI.start();
                    AgentService.bulkDeleteAgents().post({ "agentId": array }, function (response) {
                        console.log('response :: bulk delete agents => ', response);
                        if (response.code == 200) {
                            blockUI.stop();
                            toastr.success('Agents deleted successfully.');

                            setTimeout(function () { window.location.reload() }, 100);
                            // window.location.reload();
                        } else {
                            blockUI.stop();
                            toastr.error('Something went wrong please try again!');
                        }
                    });
                    // blockUI.stop();
                });
            } else {
                toastr.warning('Please select atleast one record');
            }
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
                        AgentService.sendMessage().post(obj, function (response) {
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
                            obj.user_id = $localStorage.loggedInUserId;
                            // obj.agency_id = $localStorage.loggedInUserId;
                            obj.request_by_role = $localStorage.role_id;
                            // if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                            //     obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                            // }
                            AgentService.getPropertyForAgentRemoval().post(obj, function (response) {
                                if (response.code == 200) {
                                    $scope.propertyList = response.data;
                                    if ($scope.propertyList.length == 0 && response.data.length == $scope.propertyList.length) {
                                        $state.go('agents_listing');
                                        toastr.warning("You are not associated with any property to send agent removal request");
                                        $scope.cancel();
                                    }
                                    blockUI.stop();
                                } else {
                                    $state.go('agents_listing');
                                    toastr.warning("You are not associated with any property to send agent removal request");
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
                            $scope.loginLoading = true;
                            if ($scope.removeAgentForm.$invalid == true) {
                                $scope.loginLoading = false;
                                toastr.error('Please the form completely');
                            } else {
                                if (flag == true) {
                                    $scope.agentRemoval.reason_of_removal_req = (agent.reason_of_removal_req) ? agent.reason_of_removal_req : '';
                                    var obj = {};
                                    obj = $scope.agentRemoval;
                                    AgentService.agentRemoval().post(obj, function (response) {
                                        if (response.code == 200) {
                                            toastr.success("Sucessfully sent agent removal request to the admin");
                                            $scope.propertyList = [];
                                            $scope.loginLoading = false;
                                            $scope.cancel();
                                            blockUI.stop();
                                        } else {
                                            toastr.warning("Server is busy please after some time");
                                            $scope.loginLoading = false;
                                            blockUI.stop();
                                        }
                                    });
                                    blockUI.stop();

                                } else {
                                    toastr.warning('Please check the agent removal check box');
                                    $scope.loginLoading = false;
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
            AgentService.getAgencyAgentList().post(obj, function (response) {
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
            if (agent.name || agent.city || agent.city || agent.state || agent.zipCode) {
                $scope.agencyCode = roleId.ownAgency;
                $scope.agentCode = roleId.agent;
                $scope.roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
                blockUI.start();
                var obj = {};
                // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
                var agencyId = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                agencyId = ($stateParams.id) ? $stateParams.id : agencyId;
                obj.agency_id = agencyId;
                obj.firstname = (agent.name) ? agent.name : '';
                obj.state = (agent.state) ? agent.state : '';
                obj.city = (agent.city) ? agent.city : '';
                obj.zip_code = (agent.zipCode) ? agent.zipCode : '';
                $scope.imageUrl = baseUrl + '/user_image/';

                if ($scope.selected == 1) {
                    $scope.agentList = [];
                    AgentService.agentsListWithSearch().post(obj, function (response) {
                        if (response.code == 200) {
                            $scope.agentList = response.data;
                            blockUI.stop();
                        } else {
                            $scope.agentList = [];
                            blockUI.stop();
                        }
                    });

                } else {
                    AgentService.getMyAgentList().post(obj, function (response) {
                        $scope.isSearchedAgent = true;
                        if (response.code == 200) {
                            $scope.agentList = response.data;
                            document.body.scrollTop = document.documentElement.scrollTop = 0;
                            angular.element('#agentSearchPopUp').hide();
                            blockUI.stop();
                            $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
                        } else {
                            $scope.agentList = [];
                            blockUI.stop();
                        }
                    });
                    // } else {
                    //     console.log("15");
                    //     $scope.agentList = [];
                    //     blockUI.stop();
                    // }
                    blockUI.stop();
                }
            } else {
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
            var agencyId = ($localStorage.userData.agency_id && $localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            agencyId = ($stateParams.id) ? $stateParams.id : agencyId;
            obj.agency_id = agencyId;
            obj.user_id = $localStorage.userData._id;
            $scope.imageUrl = baseUrl + '/user_image/';
            if ($scope.selected == 1) {
                $scope.agentList = [];
                AgentService.agentsListWithSearch().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.agentList = response.data;
                        blockUI.stop();
                    } else {
                        $scope.agentList = [];
                        blockUI.stop();
                    }
                });

            } else {
                AgentService.getAgencyAgentList().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.agentList = response.data;
                        blockUI.stop();
                    } else {
                        $scope.agentList = [];
                        blockUI.stop();
                    }
                });
            }
            $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
        }
        $scope.showPopup = function () {
            angular.element('#agentSearchPopUp').show();
        }
        $scope.hideSearchFilter = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            angular.element('#agentSearchPopUp').hide();
        }
    }
}());