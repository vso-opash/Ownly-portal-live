/**
 * Super Angular Controller
 * @author Ankur A
 * @created 10 August
 */
(function () {
    angular.module('SYNC')
        .controller("DisputesCtrl", DisputesCtrl);
    DisputesCtrl.$inject = [
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
        'Crud',
        'SweetAlert',
        'permissions',
        'localStorageService',
        'APP_CONST',
        'Flash',
        'DisputeService',
        'toastr',
        'blockUI',
        'blockUIConfig',
        'socket',
        '$anchorScroll',
        'AlertService'
    ];
    function DisputesCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $stateParams, Crud, SweetAlert, permissions, localStorageService, APP_CONST, Flash, DisputeService, toastr, blockUI, blockUIConfig, socket, $anchorScroll, AlertService) {
        $scope.pagination = {
            current: 1
        };
        $scope.disputeList = [];
        $scope.chat = {};
        $scope.private = {};
        $scope.loggedInUserId = $localStorage.loggedInUserId;
        $scope.userImageUrl = baseUrl + '/user_image/';
        $scope.imageUrl = baseUrl + '/property_image/';
        $scope.fileImageUrl = baseUrl + '/document/';
        $scope.owner = roleId.owner;
        $scope.agent = roleId.agent;
        $scope.tenant = roleId.tenant;
        $scope.agency = roleId.ownAgency;
        $scope.filterMatch = 'By best match';
        $scope.isSearchedDispute = false;
        /**
         * Function is use to intialize controller variables
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 
         */
        $scope.disputes = {};
        $scope.initialize = function () {
            $scope.userRoleId = $localStorage.role_id;
            $scope.baseUrl = baseUrl;
            $scope.tenant = roleId.tenant;
            $scope.owner = roleId.owner;
            $scope.agent = roleId.agent;
            $scope.getDisputesList();
        };
        $scope.filterMatch = 'createdAt';
        $scope.matchData = "createdAt"
        $scope.setOrderDispute = function (sortBy) {
            if (sortBy == "updatedAt") {
                $scope.filterMatch = sortBy;
                $scope.matchData = "By days open";
            } else if (sortBy == "dispute_status") {
                $scope.filterMatch = sortBy;
                $scope.matchData = "In Progress";
            } else if (sortBy == "-dispute_status") {
                $scope.filterMatch = sortBy;
                $scope.matchData = "Closed";
            } else if (sortBy == "+dispute_status") {
                $scope.filterMatch = "dispute_status";
                $scope.matchData = "Resolved";
            }

        }
        //tab selection setting 
        $scope.selected = 'group_chat';
        $scope.groupChat = true;
        $scope.setSelection = function (selection) {
            $scope.selected = (selection == 'group_chat') ? 'group_chat' : 'private_chat';
            $scope.groupChat = (selection == 'group_chat') ? true : false;

            if (selection == 'private_chat') {
                $scope.getDisputeDetails();
            }
        }
        /**
         * Function is use to get disputes list
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 
         */
        $scope.getDisputesList = function () {
            var postData = {
                "user_id": $localStorage.loggedInUserId,
                "request_by_role": $localStorage.role_id,
                "agency_id": ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id
            }
            DisputeService.getDisputes().post(postData, function (response) {
                if (response.code == 200) {
                    $scope.disputeList = response.data;
                    // console.log("console.err   ", $scope.disputeList);
                }
            });
        }
        $scope.getRaisedDisputesList = function () {
            var postData = {
                "user_id": $localStorage.loggedInUserId,
                "request_by_role": $localStorage.role_id,
                "dispute_status": 1
            }
            DisputeService.getDisputes().post(postData, function (response) {
                if (response.code == 200) {
                    $scope.disputeList = response.data;
                }
            });
        }
        $scope.getClosedDisputeList = function () {
            var postData = {
                "user_id": $localStorage.loggedInUserId,
                "request_by_role": $localStorage.role_id,
                "dispute_status": 2
            }
            DisputeService.getDisputes().post(postData, function (response) {
                if (response.code == 200) {
                    $scope.disputeList = response.data;
                }
            });
        }
        $scope.changeDisputeStatus = function (disputeId, status) {
            var postData = {
                "dispute_id": disputeId,
                "status": status
            }
            if (status == 2) {
                swal({
                    title: "Are you sure?",
                    text: "You want to mark this dispute as resolved?",
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
                    DisputeService.updateDisputeStatus().post(postData, function (response) {
                        if (response.code == 200) {
                            toastr.success('Dispute status change successfully');
                            $state.go('dispute');
                        } else {
                            toastr.error(response.message);
                        }
                    });
                });
            } else {
                swal({
                    title: "Are you sure?",
                    text: "You want to mark this dispute as un resolved?",
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
                    DisputeService.updateDisputeStatus().post(postData, function (response) {
                        if (response.code == 200) {
                            toastr.success('Dispute status change successfully');
                            $state.go('dispute');
                        } else {
                            toastr.error(response.message);
                        }
                    });
                });
            }
        }
        /**
         * Function is use to get disputes by id
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 
         */
        $scope.disputeDetail = [];
        $scope.getDisputeDetails = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $scope.userRoleId = $localStorage.role_id;
            var postData = {
                "disputeId": $stateParams.id,
            }
            DisputeService.getDisputesById().post(postData, function (response) {
                if (response.code == 200) {
                    $scope.disputeDetail = response.data;
                    // console.log('response', response);
                    if ($localStorage.role_id == roleId.agent) {
                        $scope.select_user($scope.disputeDetail.owner_id);
                    } else if ($localStorage.role_id == roleId.owner) {
                        $scope.select_user($scope.disputeDetail.agent_id);
                    }
                }
            });
            if ($scope.selected == 'group_chat') {
                $scope.chatInitialize();
            }
        }
        /**
        * Function is to open add new tenant modal
        * @access private
        * @return json
        * Created 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Nov-2017
        */
        $scope.openAddDisputes = function () {
            var role = $localStorage.role_id;
            if (role == roleId.agent || role == roleId.owner || role == roleId.tenant || role == roleId.ownAgency) {
                var modalInstance = $scope.model = $uibModal.open({
                    animation: false,
                    templateUrl: '/frontend/modules/disputes/views/add.html',
                    scope: $scope,
                    controller: function ($uibModalInstance, $scope) {
                        $scope.ok = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.getAgencyProperty = function () {
                            blockUI.start();
                            var obj = {};
                            obj.request_by_id = $localStorage.loggedInUserId;
                            obj.request_by_role = $localStorage.role_id;
                            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                            }
                            DisputeService.maintenceProperty().post(obj, function (response) {
                                if (response.code == 200) {
                                    $scope.propertyList = response.data;
                                    console.log('$scope.propertyList => ', $scope.propertyList);
                                    // if ($scope.userRoleId == roleId.tenant) {
                                    //     $scope.disputes.property_id = response.data[0]._id;
                                    //     $scope.disputes.city = response.data[0].city;
                                    //     $scope.disputes.state = response.data[0].state;
                                    //     $scope.disputes.created_by_agency_id = response.data[0].created_by_agency_id;
                                    //     $scope.disputes.agent = response.data[0].created_by.firstname + ' ' + response.data[0].created_by.lastname;
                                    //     $scope.disputes.owner = response.data[0].owned_by.firstname + ' ' + response.data[0].owned_by.lastname;
                                    // }
                                    if ($scope.propertyList.length == 0 && response.data.length == $scope.propertyList.length) {
                                        toastr.warning("You are not associated with any property to add new Dispute request");
                                        $scope.cancel();
                                    } else {
                                        if ($scope.userRoleId == roleId.tenant) {
                                            $scope.disputes.property_id = response.data[0]._id;
                                            $scope.disputes.city = response.data[0].city;
                                            $scope.disputes.state = response.data[0].state;
                                            $scope.disputes.created_by_agency_id = response.data[0].created_by_agency_id;
                                            $scope.disputes.agent = response.data[0].created_by.firstname + ' ' + response.data[0].created_by.lastname;
                                            $scope.disputes.owner = response.data[0].owned_by.firstname + ' ' + response.data[0].owned_by.lastname;
                                        }
                                    }
                                    blockUI.stop();
                                } else {
                                    toastr.warning("You are not associated with any property to add new Dispute request");
                                    blockUI.stop();
                                    $scope.cancel();
                                }
                            });
                            blockUI.stop();
                        };
                        $scope.selectProperty = function (key) {
                            console.log(key, "key");
                            if ($scope.userRoleId == roleId.agent || $scope.userRoleId == roleId.ownAgency) {
                                $scope.disputes.property_id = $scope.propertyList[key]._id;
                                $scope.disputes.city = $scope.propertyList[key].city;
                                $scope.disputes.state = $scope.propertyList[key].state;
                                $scope.disputes.created_by_agency_id = $scope.propertyList[key].created_by_agency_id;
                                $scope.disputes.agent = $scope.propertyList[key].created_by.firstname + ' ' + $scope.propertyList[key].created_by.lastname;
                                $scope.disputes.agent_id = $scope.propertyList[key].created_by._id;
                                $scope.disputes.owner = $scope.propertyList[key].owned_by.firstname + ' ' + $scope.propertyList[key].owned_by.lastname;
                                $scope.disputes.owner_id = $scope.propertyList[key].owned_by._id;
                                $scope.getTenants($scope.propertyList[key]);

                                // changes for select-ui
                                // $scope.disputes.property_id = key._id;
                                // $scope.disputes.city = key.city;
                                // $scope.disputes.state = key.state;
                                // $scope.disputes.created_by_agency_id = key.created_by_agency_id;
                                // $scope.disputes.agent = key.created_by.firstname + ' ' + key.created_by.lastname;
                                // $scope.disputes.agent_id = key.created_by._id;
                                // $scope.disputes.owner = key.owned_by.firstname + ' ' + key.owned_by.lastname;
                                // $scope.disputes.owner_id = key.owned_by._id;
                                // $scope.getTenants(key);
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
                        $scope.getTenants = function (id) {
                            blockUI.start();
                            $scope.noTenant = false;
                            var obj = {};
                            // if ($localStorage.role_id == roleId.agent && $localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                obj.id = id._id;
                                DisputeService.getTenantForAgreement().get(obj, function (response) {
                                    if (response.code == 200) {
                                        if (response.data && response.data.length > 0) {
                                            $scope.data = response.data;
                                            $scope.tenantList = [];
                                            if ($scope.data.length > 0) {
                                                angular.forEach($scope.data, function (value, key) {
                                                    var obj1 = [];
                                                    obj1 = _.values(_.pick(value, 'invited_to'));
                                                    if (obj1 && obj1[0] != null) {
                                                        var fullname = obj1[0].firstname + " " + obj1[0].lastname;
                                                        $scope.disputes.tenant = fullname;
                                                        $scope.disputes.tenant_id = obj1[0]._id;
                                                    }
                                                });
                                            } else {
                                                $scope.tenantList = [];
                                                $scope.noTenant = true;
                                            }
                                            blockUI.stop();
                                        } else {
                                            $scope.disputes.tenant = '';
                                            $scope.disputes.tenant_id = '';
                                        }

                                    } else {
                                        $scope.tenantList = [];
                                        $scope.noTenant = true;
                                        blockUI.stop();
                                    }
                                });
                            }
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
                        $scope.addAgentDisputes = function () {
                            // if ($localStorage.role_id != roleId.trader) {
                            if ($scope.userRoleId == roleId.agent || $scope.userRoleId == roleId.ownAgency) {
                                if ($scope.createdisputesForm.$invalid == false) {
                                    var postData = {};
                                    postData.created_by_id = $localStorage.loggedInUserId;
                                    postData.tenant_id = $scope.disputes.tenant_id;
                                    postData.owner_id = $scope.disputes.owner_id;
                                    postData.agent_id = $scope.disputes.agent_id;
                                    postData.property_id = $scope.disputes.property_id;
                                    postData.subject = $scope.disputes.subject;
                                    postData.message = $scope.disputes.message;
                                    postData.request_by_role = $localStorage.request_by_role;
                                    postData.city = ($scope.disputes.city) ? $scope.disputes.city : '';
                                    postData.state = ($scope.disputes.state) ? $scope.disputes.state : '';
                                    postData.agency_id = ($scope.disputes.created_by_agency_id) ? $scope.disputes.created_by_agency_id : '';
                                    postData.request_by_role = ($localStorage.role_id) ? $localStorage.role_id : '';
                                    DisputeService.addDisputes().post(postData, function (response) {
                                        if (response.code == 200) {
                                            $scope.disputes.key = undefined;
                                            $scope.cancel();
                                            $scope.getDisputesList();
                                            toastr.success("Disputes created successfully");
                                        } else {
                                            toastr.error("Some error occured please try again latter");
                                            $scope.cancel();
                                        }
                                    });
                                } else {
                                    toastr.error("Please fill the form completely");
                                }
                            } else {
                                toastr.error("First associate yourself with any agency");
                            }
                        }
                        $scope.addDisputes = function (data) {
                            // if ($localStorage.role_id != roleId.trader) {
                            if ($scope.userRoleId == roleId.tenant) {
                                if ($scope.createdisputesForm.$invalid == false) {
                                    var postData = {};
                                    postData.created_by_id = $localStorage.loggedInUserId;
                                    postData.tenant_id = $localStorage.loggedInUserId;
                                    postData.owner_id = $scope.propertyList[0].owned_by._id;
                                    postData.agent_id = $scope.propertyList[0].created_by._id;
                                    postData.property_id = $scope.propertyList[0]._id;
                                    postData.subject = $scope.disputes.subject;
                                    postData.message = $scope.disputes.message;
                                    postData.request_by_role = $localStorage.request_by_role;
                                    postData.city = ($scope.disputes.city) ? $scope.disputes.city : '';
                                    postData.state = ($scope.disputes.state) ? $scope.disputes.state : '';
                                    postData.agency_id = ($scope.disputes.created_by_agency_id) ? $scope.disputes.created_by_agency_id : '';
                                    postData.creator_name = $localStorage.userData.firstname + ' ' + $localStorage.userData.lastname;
                                    DisputeService.addDisputes().post(postData, function (response) {
                                        if (response.code == 200) {
                                            $scope.disputes.key = undefined;
                                            $scope.cancel();
                                            $scope.getDisputesList();
                                            toastr.success("Disputes created successfully");
                                        } else {
                                            toastr.error("Some error occured please try again latter");
                                            $scope.cancel();
                                        }
                                    });
                                } else {
                                    toastr.error("Please fill the form completely");
                                }
                            } else {
                                toastr.error("First associate yourself with any agency");
                            }
                        };
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
         * Chat functionality starts from here 
         */

        //To initialize the basic chat functionality
        $scope.privateMessage = [];
        $scope.chatInitialize = function () {
            if ($localStorage.loggedInUserId && $scope.selected == 'group_chat') {
                //add user to the group
                socket.emit("addDisputeUsers", {
                    id: $localStorage.loggedInUserId,
                    disputeId: $stateParams.id,
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
        socket.on('disputeUserJoined', function (data) {
            //to check added users 
            if (data.id == $localStorage.loggedInUserId) {
                toastr.info('You are online to the chat');
            } else {
                toastr.info(data.firstName + ' ' + data.lastName + ' have joined the chat');
            }
            socket.emit('disputeGroupChatHistory', { disputeId: $stateParams.id, userId: $localStorage.loggedInUserId });
        });
        //group chat response come here 
        socket.on('disputeUserLeaveChat', function (leaveData) {
            if (leaveData.id != $localStorage.loggedInUserId) {
                toastr.info(leaveData.firstName + ' ' + leaveData.lastName + ' is offline now');
            }
        });
        //group chat Leave 
        socket.on('disputeGroupChatResponse', function (data) {
            var box = document.getElementById('conversation');
            box.scrollTop = box.scrollHeight;
            $scope.privateMessage = data;
        });
        //group chat messages recived here for notification purpose
        socket.on('disputeGroupMessageRecieved', function (message) {
            // console.log('message',message);
            if (message.from != $localStorage.loggedInUserId) {
                toastr.info('user message', message.msg);
            }
            socket.emit('disputeGroupChatHistory', { disputeId: $stateParams.id });
        });
        //get current data functionality 
        $scope.getDate = function () {
            var d = moment().format('YYYY-MM-DD h:mm:ss a');
            var n = moment().format("MMM Do") + ', ' + moment().format('LT');
            return n;
        }
        //group messages sent from here 
        $scope.sentGeneralChatMessage = function (message, disputeDetail) {
            //Listens for a new chat message
            // console.log("called", message);
            $scope.chat.generalMsg = "";
            $scope.userRoleId = $localStorage.role_id;
            $scope.baseUrl = baseUrl;
            $scope.tenant = roleId.tenant;
            $scope.owner = roleId.owner;
            $scope.agent = roleId.agent;
            if (message) {
                var msg = {
                    from: $localStorage.loggedInUserId,
                    to: $stateParams.id,
                    textMsg: message,
                    time: $scope.getDate(),
                    disputeId: $stateParams.id
                }
                socket.emit('disputeGroupMessageSent', msg);
            }
        }
        /**
         * file uploads
         * @param {*} file 
         */
        $scope.private_Message = '';
        /**
         * Function is use to upload on file either on select or drop
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date
         */
        $scope.sentGeneralChatUploadFile = function (file, data) {
            if (file) {
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
                        //console.log('file upload called');
                        socket.emit('disputeGroupMessageSentWithFile', {
                            from: $localStorage.loggedInUserId,
                            to: $stateParams.id,
                            propertyId: $stateParams.id,
                            textMsg: 'File uploaded ' + response.data.data.document_name,
                            time: $scope.getDate(),
                            disputeId: $stateParams.id,
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
            }
        };
        //Private chat section //

        /**
        * Function is use for checking authentication for chatting
        * @access private
        * @return json
        * Created by Minakshi
        * @smartData Enterprises (I) Ltd
        * Created Date 5-Aug-2017
        */
        $scope.authCheck = function () {
            $localStorage.appointment = '';
            $localStorage.propertyId = '';
            $scope.userRoleId = $localStorage.role_id;
            $scope.baseUrl = baseUrl;
            $scope.tenant = roleId.tenant;
            $scope.owner = roleId.owner;
            $scope.agent = roleId.agent;
            if ($localStorage.loggedInUserId) {
                // add user to chat room..
                socket.emit("addUser", {
                    id: $localStorage.loggedInUserId
                });
            }
        }();

        socket.on('disconnect', function () {
            toastr.info('you are offline now');
        });
        $scope.onlineUsers = {};
        socket.on('user_connected', function (onlineUsers) {
            if (onlineUsers) {
                $scope.onlineUsers = onlineUsers;
            }
        });
        /**
         * Function is use to send request for show chat history with last user or selected user
         * @access private
         * @return json
         * Created by Minakshi
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.private_chat_history = function () {
            if ($rootScope.to) {
                var box = document.getElementById('conversation');
                box.scrollTop = box.scrollHeight;
                socket.emit('privateChatDisputeHistory', {
                    from: $localStorage.loggedInUserId,
                    //propertyId: $stateParams.id,
                    to: $rootScope.to,
                    dispute_id: $stateParams.id,
                    is_disputes_communication: true
                });
            }
            //$scope.getUserforChat($localStorage.loggedInUserId);
        }
        socket.on('privateChatHistoryRes', function (data) {
            var box = document.getElementById('conversation');
            box.scrollTop = box.scrollHeight;
            if (data && data.length > 0) {
                $scope.isempty = false;
                $scope.privateChatMessage = data;
            } else {
                $scope.isempty = true;
                $scope.privateChatMessage = data;
            }
        });
        /**
         * Function is use to to define receiver username
         * @access private
         * @return json
         * Created by Minakshi
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.select_user = function (users) {
            $scope.selectedUser = users;
            var to = users._id;
            $scope.privateChatMessage = [];
            $rootScope.to = to;
            socket.emit("setReadAll", {
                from: to,
                to: $localStorage.loggedInUserId
            });
            socket.on('open', function (status) {
                //$scope.getUserforChat($localStorage.loggedInUserId);
                socket.emit("pendingmsgs", $localStorage.loggedInUserId);
            })
            $scope.private_chat_history();
        };

        /**
         * Function is use to send chat message
         * @access private
         * @return json
         * Created by Minakshi
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.send_message = function (private_Message, disputeDetail) {
            var obj = {};
            if ($localStorage.role_id == roleId.agent) {
                $scope.select_user(disputeDetail.owner_id);
            } else if ($localStorage.role_id == roleId.owner) {
                $scope.select_user(disputeDetail.agent_id);
            }
            if ($rootScope.to.length > 0) {
                obj = $localStorage.loggedInUserId
                if (private_Message) {
                    socket.emit('private_dispute_message', {
                        from: $localStorage.loggedInUserId,
                        to: $rootScope.to,
                        propertyId: $stateParams.id,
                        dispute_id: $stateParams.id,
                        is_disputes_communication: true,
                        textMsg: private_Message,
                        time: $scope.getDate()
                    });
                    $scope.private.private_chat = " ";
                    socket.on('sent', function (data) {
                        $scope.private_chat_history();
                    });
                }
            } else {
                toastr.warning('Please select reciever from chat windows');
            }
        }
        /**
        * Function is use to get response receiver and show message nto their window
        * @access private
        * @return json
        * Created by Minakshi
        * @smartData Enterprises (I) Ltd
        * Created Date 5-Aug-2017
        */
        socket.on('received', function (data) {
            $scope.private_chat_history();
            if ($rootScope.to && data.from == $rootScope.to) {
                socket.emit("setRead", data);
                toastr.info(data.textMsg);
                var user = $localStorage.loggedInUserId;
                user['propertyId'] = data.propertyId;
                $scope.getUserforChat($localStorage.loggedInUserId);
                socket.on('done', function (status) {
                    $scope.private_chat_history();
                    socket.emit("pendingmsgs", $localStorage.loggedInUserId);
                })
            } else {
                toastr.info(data.textMsg);
                var user = $localStorage.loggedInUserId;
                user['propertyId'] = data.propertyId;
                $scope.getUserforChat($localStorage.loggedInUserId);
                socket.emit("pendingmsgs", $localStorage.loggedInUserId);
            }
        });
        $scope.uploadFile = function (file) {
            var postData = {
                from: $localStorage.loggedInUserId,
                to: $rootScope.to,
                propertyId: $stateParams.id,
                dispute_id: $stateParams.id,
                is_disputes_communication: true,
                //textMsg: private_Message,
                time: $scope.getDate()
            }
            $scope.fileUpload(file, postData);
        }
        /**
      * Function is use to upload on file either on select or drop
      * @access private
      * @return json
      * Created by 
      * @smartData Enterprises (I) Ltd
      * Created Date 3-Aug-2017
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
                    socket.emit('private_dispute_message', {
                        from: $localStorage.loggedInUserId,
                        to: $rootScope.to,
                        propertyId: $stateParams.id,
                        dispute_id: $stateParams.id,
                        is_disputes_communication: true,
                        textMsg: 'File uploaded ' + response.data.data.document_name,
                        time: $scope.getDate(),
                        document_name: response.data.data.document_name,
                        document_path: response.data.data.document_path + response.data.data.picture_path,
                        size: response.data.data.size,
                        is_file: true,
                    });
                    // socket.emit('disputeGroupMessageSentWithFile', {
                    //     from: $localStorage.loggedInUserId,
                    //     to: $stateParams.id,
                    //     propertyId: $stateParams.id,
                    //     textMsg: 'File uploaded ' + response.data.data.document_name,
                    //     time: $scope.getDate(),
                    //     disputeId: $stateParams.id,
                    //     document_name: response.data.data.document_name,
                    //     document_path: response.data.data.document_path + response.data.data.picture_path,
                    //     size: response.data.data.size,
                    //     is_file: true,
                    // });
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

        $scope.dispute = {};
        $scope.showPopup = function () {
            angular.element('#disputeSearchPopUp').show();
        }
        $scope.hideSearchFilter = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            angular.element('#disputeSearchPopUp').hide();
        }
        $scope.DisputeSearch = function (value) {
            blockUI.start();
            var postData = {
                "user_id": $localStorage.loggedInUserId,
                "request_by_role": $localStorage.role_id,
                "message": value.name
            }
            DisputeService.searchDispute().post(postData, function (response) {
                $scope.isSearchedDispute = true;
                if (response.code == 200) {
                    $scope.disputeList = response.data;
                    $scope.hideSearchFilter();
                    blockUI.stop();
                } else {
                    $scope.disputeList = [];
                    $scope.hideSearchFilter();
                    blockUI.stop();
                }
            });

        }
        $scope.clearSearch = function () {
            $scope.dispute.name = '';
            $scope.initialize();
            $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
        }

        $scope.pageChanged = function (page) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }


    }
}());