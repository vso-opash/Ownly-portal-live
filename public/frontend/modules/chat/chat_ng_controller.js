/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 */
(function () {
    angular.module('SYNC')
        .controller("ChatCtrl", ChatCtrl);
    ChatCtrl.$inject = [
        '$state',
        '$scope',
        '$rootScope',
        '$localStorage',
        '$timeout',
        'Upload',
        '$uibModal',
        '$filter',
        '$window',
        '$location',
        '$stateParams',
        'permissions',
        'APP_CONST',
        'Flash',
        'toastr',
        'blockUI',
        'chatService',
        'SweetAlert',
        'socket',
        'blockUIConfig',
        'AgentService',
        'userService',
        'usrlist'
    ];

    function ChatCtrl($state, $scope, $rootScope, $localStorage, $timeout, Upload, $uibModal, $filter, $window, $location, $stateParams, permissions, APP_CONST, Flash, toastr, blockUI, chatService, SweetAlert, socket, blockUIConfig, AgentService, userService, usrlist) {
        //private_Message = [];                
        $rootScope.to = {};
        $rootScope.userList = [];
        // $rootScope.userList = usrlist;
        $rootScope.isSeller = false;
        $rootScope.isBuyer = false;
        $scope.privateMessage = [];
        var user = {};
        $rootScope.count = 0;
        $scope.errorMsg = '';
        $scope.is_buyer = false;
        $scope.is_seller = false;
        $rootScope.msgCounts = [];
        $scope.selectedUser = {};
        $scope.roles = roleId;
        $scope.baseUrl = baseUrl;
        $scope.attachedimageUrl = baseUrl + '/uploads/';
        $scope.loggedInUserId = $localStorage.loggedInUserId;
        $scope.selected_user_id = 0;
        // $scope.disabledBtn = false;
        $scope.chatInitialize = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            // if ($localStorage.superLoginUserId) {
            //     $scope.disabledBtn = true;
            // }
            $scope.getUserList();
            $scope.authCheck();
            // if ($stateParams.id && $stateParams.id == "messages") {
            // $scope.showMessage();
            // var obj = {};
            // obj.user_id = $localStorage.loggedInUserId;
            // chatService.markMessageAsRead().post(obj, function (response) {
            //     if (response.code == 200) {
            //         $rootScope.messageData = [];
            //     }
            // });
            // } else 
            if ($stateParams.id) {
                var obj = {};
                obj.user_id = $localStorage.loggedInUserId;
                obj.from_user_id = $stateParams.id
                chatService.markMessageAsRead().post(obj, function (response) {
                    console.log("testing 1");
                    if (response.code == 200) {
                        $rootScope.messageData = [];
                    }
                });
            }
        }

        $scope.getUserList = function () {
            $scope.agencyCode = roleId.ownAgency;
            $scope.agentCode = roleId.agent;
            $scope.roleId = ($localStorage.role_id) ? $localStorage.role_id : '';
            blockUI.start();
            var obj = {};
            if ($localStorage.loggedInUserId) {
                $scope.imageUrl = baseUrl + '/user_image/';
                postData = {
                    "user_id": $localStorage.loggedInUserId
                };
                chatService.getChatUserList().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.userList = [];
                        $scope.userList = response.data;
                        console.log("$scope.userList");
                        // console.log($scope.userList);

                        if ($stateParams.id != '') {
                            $scope.userList.forEach((usr) => {
                                if (usr._id === $stateParams.id) {
                                    $scope.select_user(usr);
                                }
                            });
                        }

                        blockUI.stop();
                    } else {
                        $scope.userList = [];
                        blockUI.stop();
                    }
                });
            }
            else {
                $scope.agentList = [];
                blockUI.stop();
            }
            blockUI.stop();
        };
        $scope.noBlock = function () {
            blockUIConfig.requestFilter = function (config) {
                return false;
            }
        };
        $scope.showAllContainer = true;
        $scope.showMessageContainer = false;
        $scope.showThreadContainer = false;
        $scope.showAll = function () {
            $scope.showAllContainer = true;
            $scope.showMessageContainer = false;
            $scope.showThreadContainer = false;
            // $scope.getUserList();
        }
        $scope.showMessage = function () {
            $scope.showAllContainer = false;
            $scope.showMessageContainer = true;
            $scope.showThreadContainer = false;
        }
        $scope.showThread = function () {
            $scope.showAllContainer = false;
            $scope.showMessageContainer = false;
            $scope.showThreadContainer = true;
        }
        // $scope.messageData = [];

        $scope.sendChat = function () {
            var private_Message = angular.element("#example1").val();
            // console.log('called', private_Message);
        }
        $scope.messageSender = {};
        $scope.senderMessage = {
            message: ''
        };
        $scope.select_message_user = function (userData) {
            $scope.messageSender = userData.from_user;
            $scope.senderMessage = userData;
        }
        /**
         * Function is use To get all individual chat count
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.getIndividualChatCount = function (fromId, key) {
            var obj = {};
            obj.userId = $localStorage.loggedInUserId;
            obj.fromId = fromId;
            chatService.getIndividualChat().post(obj, function (response) {
                if (response.code == 200) {
                    $rootScope.msgCounts[key] = response.data;
                } else {
                    $rootScope.msgCounts[key] = 0;
                }
            });
        };

        /**
         * Chat functionality starts from here 
         */

        //To initialize the basic chat functionality
        $scope.privateMessage = [];

        socket.on('privateWindowChatHistory', function (data, from_id, to_id) {
            // console.log("from ID :   ", from_id);
            // console.log("To :   ", $rootScope.to, "       ", $scope.selected_user_id, "   ", to_id);
            if (data.length > 0) {
                var count = data.length;
            }
            var box = document.getElementById('conversation');
            if (box)
                box.scrollTop = box.scrollHeight;

            if ($rootScope.to != '' && $rootScope.to.length > 0 && $scope.selected_user_id == $rootScope.to && $scope.selected_user_id == to_id) {
                $scope.privateMessage = data;
                $timeout(function () { $("#conversation").scrollTop(99999999999999); }, 3000);

                $('html, body').animate({
                    scrollTop: $(document).find(".conversation").offset().top - 100
                }, 2000);

                // $scope.updateNotificationStatus(to_id);
                // $scope.updateChatReadStatus(to_id);
            }
            // $scope.getUserList();
        });

        //get current data functionality 
        $scope.getDate = function () {
            var d = moment().format('YYYY-MM-DD h:mm:ss a');
            var n = moment().format("MMM Do") + ', ' + moment().format('LT');
            return n;
        }

        /**
         * Chat functionality ends here 
         */


        /**
         * Function is use To get all individual chat count at buyer side
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.getIndividualChatCountBuyer = function (fromId, key) {
            var obj = {};
            obj.userId = $localStorage.loggedInUserId;
            obj.fromId = fromId;
            chatService.UserChatMsgCountBuyer().post(obj, function (response) {
                // console.log("UserChatMsgCountBuyer", response);
                if (response.code == 200) {
                    $rootScope.msgCounts[key] = response.data;
                } else {
                    $rootScope.msgCounts[key] = 0;
                }
            });
        };
        /**
         * Function is use for selecting user for chat
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $rootScope.chatAreaView = false;
        $scope.getUserforChat = function (user) {
            $scope.noBlock();
            var obj = {};
            $rootScope.propertyData = [];
            obj = $stateParams;
            var count;
            // console.log("$state.current.name", $state.current.name);
            obj.userId = $localStorage.loggedInUserId;
            // if ($state.current.name === 'chatSeller') {
            var i;
            socket.emit("getAppliedUsers", user);
            socket.on("getAppliedUsersRes", function (response) {
                $rootScope.userList = response.userList;
                $rootScope.userListPreview = $rootScope.userList;
                if ($rootScope.userListPreview.length == 0) {
                    $rootScope.chatAreaView = true;
                } else {
                    $rootScope.chatAreaView = false;
                }
                angular.forEach(response.userList, function (userData, key) {
                    obj.fromId = userData;
                    $scope.getIndividualChatCountBuyer(userData, key);
                });
            });
            socket.on("getAppliedUsersErr", function (response) { })
            // }
            if ($state.current.name === 'chatBuyer') {
                $rootScope.isBuyer = true;
                socket.emit("getUser", user);
                socket.on("getUserRes", function (response) {
                    $rootScope.userListPreview = response.userList;
                    //  console.log("$rootScope.userListPreview",$rootScope.userListPreview);
                    if ($rootScope.userListPreview.length == 0) {
                        $rootScope.chatAreaView = true;

                    } else {
                        $rootScope.chatAreaView = false;
                        $rootScope.userList = _.flatten(response.userList)
                        $rootScope.propertyList = _.flatten(response.propertyList);
                    }
                    angular.forEach(response.userList, function (userData, key) {
                        obj.fromId = userData;
                        $scope.getIndividualChatCount(userData, key);
                    });
                });
                socket.on("getAppliedUsersErr", function (response) { })

            }

            socket.on("getAppliedUsersErr", function (response) { })
        }


        /**
         * Function is use for checking authentication for chatting
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.authCheck = function (propertyId) {
            $localStorage.appointment = '';
            $localStorage.propertyId = '';
            if ($localStorage.loggedInUserId) {
                // add user to chat room..
                socket.emit("addUser", {
                    id: $localStorage.loggedInUserId
                });
                $scope.getUserforChat($localStorage.loggedInUserId);
            }
        }

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
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.private_chat_history = function () {
            // if ($rootScope.to) {
            socket.emit('ChatMessageHistory', {
                from: $localStorage.loggedInUserId,
                to: $rootScope.to
                //propertyId: $stateParams.id,
            });
            $timeout(function () { $("#conversation").scrollTop(99999999999999); }, 3000);
            // }
            // $scope.getUserforChat($localStorage.loggedInUserId);
            // $scope.getUserforChat($rootScope.to);
        }

        $scope.scolltoBottom = function () {
            $location.hash('conversation');
        }
        /**
         * Function is use to to define receiver username
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */

        $scope.select_user = function (users) {
            console.log('users :: select user function - ng-click ==>', users);
            $scope.selectedUser = users;
            var to = users._id;
            $scope.selected_user_id = to;
            $scope.privateMessage = [];
            $rootScope.to = to;
            // socket.emit("setReadAll", {
            //     from: to,
            //     to: $localStorage.loggedInUserId
            // });
            console.log("Testing 3");
            $scope.updateNotificationStatus(to);
            $scope.load_notification_list();
            $scope.updateChatReadStatus(to);
            $scope.private_chat_history();

            // socket.on('open', function (status) {
            //     $scope.getUserforChat($localStorage.loggedInUserId);
            //     socket.emit("pendingmsgs", $localStorage.loggedInUserId);
            // })


        };

        /**
         * Function is use to update isRead flag for chat message
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.updateChat = function (to, key) {
            // console.log("updateChat", to);
            var i;
            var obj = {};
            obj.userId = $localStorage.loggedInUserId;
            obj.fromId = to;
            chatService.updateChatIsRead().post(obj, function (response) {
                // console.log(response,"response");
                if (response.code == 200) {
                    $rootScope.msgCounts[key] = 0;
                } else {

                }
            });

        }
        setTimeout($scope.notification, 10000);

        /**
         * Function is use to send chat message
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.send_message = function (private_Message) {
            console.log('private_Message => ', private_Message);
            // if ($localStorage.superLoginUserId) {
            //     toastr.warning('Switch to the Group chat to send message.');
            // } 
            var obj = {};
            $scope.private_Message = private_Message;
            // console.log("$scope.private_Message   ", $scope.private_Message);
            if ($rootScope.to.length > 0) {
                obj = $localStorage.loggedInUserId
                if (private_Message != '' && $scope.private_Message) {
                    console.log('$localStorage.superLoginUserId ===========> ', $localStorage.superLoginUserId);
                    var messages = {
                        from: $localStorage.loggedInUserId,
                        // from: $localStorage.superLoginUserId ? $localStorage.superLoginUserId : $localStorage.loggedInUserId,
                        to: $rootScope.to,
                        textMsg: $scope.private_Message,
                        time: $scope.getDate(),
                        firstname: $localStorage.userData.firstname,
                        lastname: $localStorage.userData.lastname,
                        role_id: $localStorage.role_id
                    }
                    if ($localStorage.superLoginUserId) {
                        messages.agency_id = $localStorage.superLoginUserId
                    }
                    // $scope.chat.generalMsg = "";
                    // console.log('message sent called', messages);
                    socket.emit('ChatMessageSent', messages);

                    // socket.emit('private message', {
                    //     from: $localStorage.loggedInUserId,
                    //     to: $rootScope.to,
                    //     propertyId: $stateParams.id,
                    //     textMsg: $scope.private_Message,
                    //     time: $scope.getDate(),
                    //     firstname: $localStorage.userData.firstname,
                    //     lastname: $localStorage.userData.lastname
                    // });
                }
                $scope.private_Message = '';
                // socket.on('sent', function (data) {
                $scope.private_chat_history();
                $scope.load_notification_list();
                // });
                $scope.getUserList();
            } else {
                toastr.warning('Please select reciever from chat windows');
            }

        }
        $scope.uploadFile = function (file, invalidFile) {
            console.log('file => ', file);
            // if (invalidFile[0] && invalidFile[0]['$error']) {
            //     console.log('file => ');
            //     $scope.errorMsg = invalidFile[0]['$error'];
            //     if ($scope.errorMsg == 'maxSize') {
            //         $scope.errorMsg = 'file is too large. Maximum file size is ' + invalidFile[0]['$errorParam'];
            //         toastr.warning($scope.errorMsg);
            //     }
            // }
            if ($rootScope.to.length > 0) {
                var postData = {
                    from: $localStorage.loggedInUserId,
                    to: $rootScope.to,
                    propertyId: $stateParams.id,
                    textMsg: $scope.private_Message,
                    time: $scope.getDate(),
                    firstname: $localStorage.userData.firstname,
                    lastname: $localStorage.userData.lastname
                }
                // console.log('postData', postData);
                if (file) {
                    $scope.fileUpload(file, postData);
                }
                // console.log('file', file);
            } else {
                toastr.warning('Please select reciever from chat windows');
            }
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
            console.log('file => ', file);
            console.log('data => ', data);


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

                    var messages = {
                        from: $localStorage.loggedInUserId,
                        to: $rootScope.to,
                        textMsg: $scope.private_Message,
                        time: $scope.getDate(),
                        propertyId: $stateParams.id,
                        document_name: response.data.data.document_name,
                        document_path: response.data.data.document_path + response.data.data.picture_path,
                        size: response.data.data.size,
                        is_file: true,
                        firstname: $localStorage.userData.firstname,
                        lastname: $localStorage.userData.lastname
                    }

                    socket.emit('ChatMessageSentWithFile', messages);
                    $scope.private_chat_history();
                    $scope.load_notification_list();

                    // socket.emit('private message', {
                    //     from: $localStorage.loggedInUserId,
                    //     to: $rootScope.to,
                    //     propertyId: $stateParams.id,
                    //     textMsg: 'File uploaded ' + response.data.data.document_name,
                    //     time: $scope.getDate(),
                    //     document_name: response.data.data.document_name,
                    //     document_path: response.data.data.document_path + response.data.data.picture_path,
                    //     size: response.data.data.size,
                    //     is_file: true,

                    // });
                    // socket.on('sent', function (data) {
                    //     $scope.private_chat_history();
                    // });
                } else {
                    toastr.error(response.data.message);
                }
            }, function (evt) {
                $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            });
        };
        $scope.chatError = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        $scope.updateScroll = function () {
            var element = document.getElementById("chat_area");
            element.scrollTop = element.scrollHeight;
        }
        $scope.getProperty = function () {
            var obj = {};
            $scope.owner = [];
            obj.propertyId = $stateParams.id;
            obj.userId = $localStorage.loggedInUserId;
            PropertyService.singlePropertyDetail().post(obj, function (response) {
                if (response.code == 200) {
                    //console.log("hdudshfvglhdgli");
                    $scope.owner = response.data.data;
                    //console.log("$scope.owner", $scope.owner);
                } else {
                    $state.go('chatNotPossible');
                    // console.log(" no user");
                }
            });

        }

        /**
         * Function is use to start chat with buyer
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.sellerPropertyId = function () {
            var propertyId = $stateParams.id;
            $scope.authCheck(propertyId);
            $localStorage.propertyId = '';

        };
        /**
         * Function is use to search friends from list of friends in message section.
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.searchFrnd = function (item) {
            var fullname = item.firstname.toLowerCase() + " " + item.lastname.toLowerCase();
            if (!$scope.query || (item.firstname.toLowerCase().indexOf($scope.query.toLowerCase()) != -1) || (item.lastname.toLowerCase().indexOf($scope.query.toLowerCase()) != -1) || (fullname.indexOf($scope.query.toLowerCase()) != -1)) {
                return true;
            }
            return false;
        };

        /**
         * Function is use to get response receiver and show message nto their window
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        // socket.on('received', function (data) {
        //     console.log("i m received/////");
        //     $scope.private_chat_history();
        //     if ($rootScope.to && data.from == $rootScope.to) {
        //         socket.emit("setRead", data);
        //         toastr.info(data.textMsg);
        //         var user = $localStorage.loggedInUserId;
        //         user['propertyId'] = data.propertyId;
        //         $scope.getUserforChat($localStorage.loggedInUserId);
        //         socket.on('done', function (status) {
        //             $scope.private_chat_history();
        //             socket.emit("pendingmsgs", $localStorage.loggedInUserId);
        //         })
        //     } else {
        //         console.log("=================================");
        //         console.log(data);
        //         toastr.info(data.textMsg, ' ', {
        //             allowHtml: true,
        //             timeOut: 5000000000,
        //             extendedTimeOut: 5000000000,
        //             onTap: function () {
        //                 console.log("i m tapping : ", $scope.userList);
        //                 // $state.go('chat', { id: data.from });

        //                 let user = {};
        //                 $scope.userList.forEach((usr) => {
        //                     if (usr._id === data.from) {
        //                         user = usr;
        //                     }
        //                 });

        //                 if ($state.current.name == "chat") {
        //                     $scope.select_user(user);
        //                 } else {
        //                     $state.go('chat', { id: user._id })
        //                 }
        //             }
        //         });
        //         var user = $localStorage.loggedInUserId;
        //         user['propertyId'] = data.propertyId;
        //         $scope.getUserforChat($localStorage.loggedInUserId);
        //         socket.emit("pendingmsgs", $localStorage.loggedInUserId);
        //     }
        // });

        /**
         * Function is use to check chat storage
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.checkChatStorage = function () {
            var obj = {};
            obj.propertyId = $stateParams.id;
            if ($localStorage.appointment === 'chat' && $localStorage.loggedInUserId && $localStorage.propertyId) {
                $scope.sellerChatStart();
            } else {

                $location.path('/chat/seller/' + obj.propertyId);
                PropertyService.getPropertyOwner().post(obj, function (response) {
                    if (response.code == 200) {
                        $rootScope.to = response.data[0].owner_id;
                        $location.path('/chat/seller/' + obj.propertyId);
                        $scope.authCheck(obj.propertyId);
                    } else {
                    }
                });

            }
        }
        /**
         * Function is use find the chat time
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.getDate = function () {
            var d = moment().format('YYYY-MM-DD h:mm:ss a');
            var n = moment().format("MMM Do") + ', ' + moment().format('LT');
            return n;
        }
        // console.log("DateTime : " + $scope.getDate());
        /**
         * Function is use to do chat start at buyer side
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.chatStart = function () {
            $scope.is_buyer = true;
            var propertyId = '596f4a2d863d1f316a7b1ef3';
            var seller_id = '59783809462b9f23cbfa26d0';
            if ($localStorage.appointment === 'chat' && $localStorage.loggedInUserId && $localStorage.propertyId) {
                var propertyId = $localStorage.propertyId;
            } else {
                $location.path('/chat/buyer/' + propertyId);
            }
            $scope.authCheck(propertyId);
        };
        /**
         * Function is use to do chat start at seller side
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 5-Aug-2017
         */
        $scope.sellerChatStart = function () {
            var propertyId = $stateParams.id;
            $scope.is_seller = true;
            if ($localStorage.appointment === 'chat' && $localStorage.loggedInUserId && $localStorage.propertyId) { } else {

                $location.path('/chat/seller/' + propertyId);
            }
            $scope.authCheck(propertyId);
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
                controller: function ($uibModalInstance, $scope, chatService) {
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
                        if (id) {
                            blockUI.start();
                            var obj = {};
                            obj.sender_id = $localStorage.userData._id;
                            obj.receiver_id = id;
                            obj.firstname = $localStorage.userData.firstname;
                            obj.lastname = $localStorage.userData.lastname;
                            obj.message = message;
                            obj.time = $scope.getDate();
                            chatService.sendMessage().post(obj, function (response) {
                                if (response.code == 200) {
                                    toastr.success('Successfully sent message to agent');
                                    $scope.cancel();
                                    blockUI.stop();
                                } else {
                                    toastr.warning('Server is busy please try a while');
                                    blockUI.stop();
                                }
                            });
                        } else {
                            toastr.warning('Please select reciever from chat windows');
                        }
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
            }, function () { });
        };


        $scope.timeUntil = function (stDate) {

            // Utility to add leading zero
            function z(n) {
                return (n < 10 ? '0' : '') + n;
            }

            // Convert string to date object
            var d = new Date(new Date(stDate).getTime() + 15 * 60000);
            var diff = d - new Date();
            // Allow for previous times
            // console.log(d, "d SSSSSSSSSS");
            var sign = diff < 0 ? ' ' : '';
            diff = Math.abs(diff);
            // Get time components
            if (diff > 0) {
                var hours = diff / 3.6e6 | 0;
                var mins = diff % 3.6e6 / 6e4 | 0;
                var secs = Math.round(diff % 6e4 / 1e3);

                // console.log("***************************");
                // console.log("diff", diff);
                // console.log("hours", diff / 3.6e6);
                // console.log("mins", mins);
                // console.log("secs", secs);
                // Return formatted string
                return sign + z(mins) + ':' + z(secs);
            }
        }

        $scope.load_notification_list = function () {
            $rootScope.messageData = [];
            $rootScope.unReadMessages = [];
            var obj = {};
            obj.user_id = $localStorage.loggedInUserId;
            $scope.imageUrl = baseUrl + '/user_image/';
            userService.messageList().post(obj, function (response) {
                if (response.code == 200) {
                    $rootScope.messageData = response.data;
                    $rootScope.unReadMessages = response.data;
                    console.log("called", response);
                }
            });
        }

        $scope.updateNotificationStatus = function (to_id) {
            var obj = {};
            obj.user_id = $localStorage.loggedInUserId;
            obj.from_user_id = to_id;
            chatService.markMessageAsRead().post(obj, function (response) {
                if (response.code == 200) {
                    console.log("testing 2");
                    $rootScope.messageData = [];
                }
            });
        }

        $scope.updateChatReadStatus = function (to) {
            var obj = {};
            obj.from = to;
            obj.to = $localStorage.loggedInUserId;
            chatService.updateChatIsRead().post(obj, function (response) {
            });
        }


        $scope.getDateFormat = function (date) {
            let format = ""
            let msgDateYear = moment(date).format("YYYY")
            let currentDateYear = moment().format('YYYY')
            if (msgDateYear == currentDateYear) {
                format = moment(date).format("MMM Do, hh:mm A")
            } else {
                format = moment(date).format("MMM Do YYYY, hh:mm A")
            }
            return format
        }

        $scope.getDateFormatMain = function (date) {
            let format = ""
            let msgDateYear = moment(date).format("YYYY")
            let currentDateYear = moment().format('YYYY')
            if (msgDateYear == currentDateYear) {
                format = moment(date).format("MMM Do, hh:mm A")
            } else {
                format = moment(date).format("MMM Do, YYYY")
            }
            return format
        }
    }
}());
