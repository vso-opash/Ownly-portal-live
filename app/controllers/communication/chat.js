'use strict';
var _ = require('underscore');
var mongoose = require('mongoose');
var chatModel = require('../../models/communication/Chats.js'); //To manage chat by user
var notificationModel = require('../../models/communication/Notifications.js'); //To manage notification
var userModel = require('../../models/users/Users.js'); //To manage chat by user
mongoose.Promise = require('bluebird');
mongoose.Promise = global.Promise;


exports.chatConfig = function (io, usernames) {
    //verify authentication 
    io.on('connection', function (socket) {
        console.log("socket     " , socket);
        // ===================================Chat section======================================================
        //get all penging message
        socket.on("pendingmsgs", function (data) {
            // console.log("1----------------------------------------------------");
            getUsersWithTotalCount(data, function (err, result) {
                if (!err) {
                    result.userList = _.sortBy(result.userList, 'msgcount');
                    console.log('msgcount',result.userList)
                    socket.emit("pendingmsgsRes", result);
                } else {
                    socket.emit("pendingmsgsResErr", err);
                }
            });
        });

        /* @function :addUser
         * @created  : 
         * @purpose  : request to get friends list with pending message count
         */
        socket.on("getUser", function (data) {
            // console.log("2----------------------------------------------------");
            // console.log("getUser", data);
            getEmployeeWithCount(data, function (err, result) {
                if (!err) {
                    result.userList = _.sortBy(result.userList, 'msgcount');
                    socket.emit("getUserRes", result);
                } else {
                    socket.emit("getUserResErr", err);
                }
            });
        });

        /* @function :addUser
         * @created  : 
         * @purpose  : request to get friends list with pending message count
         */
        socket.on("getAppliedUsers", function (data) {
            // console.log("3----------------------------------------------------");
            getAppliedUsersWithCount(data, function (err, result) {
                if (!err) {
                    result.userList = _.sortBy(result.userList, 'msgcount');
                    //console.log('result.userList',result.userList);
                    socket.emit("getAppliedUsersRes", result);
                } else {
                    socket.emit("getAppliedUsersErr", err);
                }
            });
        })

        /* @function :addUser
         * @created  : 
         * @purpose  : request to get friends list with pending message count
         */
        socket.on("getAssignedUsers", function (data) {
            // console.log("4----------------------------------------------------");
            getAssignedUsersWithCount(data, function (err, result) {
                if (!err) {
                    result.userList = _.sortBy(result.userList, 'msgcount');
                    socket.emit("getAssignedUsersRes", result);
                } else {
                    socket.emit("getAssignedUsersErr", err);
                }
            });
        })

        /* @function :addUser
         * @created  : 
         * @purpose  : request to add user to chat system
         */
        var onlineUser = [];
        socket.on('addUser', function (user) {
            // console.log("5----------------------------------------------------");
            // console.log('user added', user);
            socket.username = user.id;
            usernames[user.id] = socket.id;
            onlineUser[socket.id] = user.id;
            io.sockets.emit('user', usernames);
            io.sockets.emit('user_connected', usernames);
            userModel.findOneAndUpdate({ '_id': user.id }, {
                $set: {
                    "is_online": true
                }
            }, function (err, res) {
                // console.log('user.id', user.id);
                if (err) {
                    console.log('err', err);
                } else {
                    console.log('user online');
                }
            });
        });
        socket.on('disconnect', function () {
            // console.log("6----------------------------------------------------");
            userModel.findOneAndUpdate({ '_id': onlineUser[socket.id] }, {
                $set: {
                    "is_online": false
                }
            }, function (err, res) {
                if (err) {
                    console.log('err', err);
                } else {
                    console.log('user offline');
                }
            });
        });
        /**
         * Disputes Group chat start from here 
         *
         */
        /* @function :addGroupUser
        * @created  : 
        * @purpose  : request to add group of users to chat system
        */
        socket.on('addDisputeUsers', function (user) {
            //New user joins the default room
            socket.join(user.disputeId);
            //Tell all those in the room that a new user joined
            io.in(user.disputeId).emit('disputeUserJoined', user);
            onlineUser[socket.id] = user.id;
            userModel.findOneAndUpdate({ '_id': user.id }, {
                $set: {
                    "is_online": true
                }
            }, function (err, res) {
                //console.log('user.id', user.id);
                if (err) {
                    console.log('err', err);
                } else {
                    chatModel.findOneAndUpdate({
                        //from: user.id, is_available: true, group_id: { $ne: user.disputeId }
                        $or: [{
                            from: user.id, is_available: true, group_id: { $ne: user.disputeId }
                        }, {
                            to: user.id, is_available: true, group_id: { $ne: user.disputeId }
                        }]
                    }, {
                        $set: {
                            "is_available": false
                        }
                    }).sort({ '_id': 1 }).exec(function (err, chatData) {
                        if (err) {
                            console.log(err)
                        } else {
                            // console.log('chatData',chatData);
                            if (chatData != null) {
                                // console.log('if called');
                                socket.leave(chatData.dispute_id);
                                io.in(chatData.group_id).emit('disputeUserLeaveChat', user);
                            }
                        }
                    });
                }
            });
        });
        /* @function :get chat group chat history
        * @created  : 
        * @purpose  : get request and send db stored private message when page load of 
        */
        socket.on('disputeGroupChatHistory', function (data) {
            var chatDataList = [];
            chatModel.find({
                group_id: data.disputeId
            }).sort({ '_id': 1 }).populate("from").populate("to").populate("proposal_id").populate("maintenance_id").exec(function (err, chatData) {
                if (err) {
                    if (err) console.log(err)
                } else {
                    chatDataList = _.last(chatData, 10);
                    //console.log('chatDataList', chatDataList);
                    io.in(data.disputeId).emit('disputeGroupChatResponse', chatData);
                }
            });
        });
        /* @function :group message sent 
        * @created  : 
        * @purpose  : To sent a message to each member in a group  
        */
        socket.on('disputeGroupMessageSent', function (data) {
            // console.log('data', data);
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_available: true,
                is_disputes_communication: true,
                group_id: data.disputeId,
                proposal_id: data.proposal_id,
                dispute_id: data.disputeId,
                // document_name: data.document_name,
                // document_path: data.document_path,
                // size: data.size,
                // is_file: (data.is_file==true)?true:false
            }
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    //Send message to those connected in the room
                    io.in(data.disputeId).emit('disputeGroupMessageRecieved', chatData);
                }
            });
        });
        /* @function :group message sent with files 
        * @created  : 
        * @purpose  : To sent a file to each member in a group  
        */
        socket.on('disputeGroupMessageSentWithFile', function (data) {
            // console.log('data', data);
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_available: true,
                group_id: data.disputeId,
                is_disputes_communication: true,
                document_name: data.document_name,
                document_path: data.document_path,
                dispute_id: data.disputeId,
                size: data.size,
                is_file: (data.is_file == true) ? true : false
            }
            // console.log('obj', obj);
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                // console.log('chatData', chatData);
                if (err) {
                    console.log(err);
                } else {
                    //Send message to those connected in the room
                    io.in(data.disputeId).emit('disputeGroupMessageRecieved', chatData);
                }
            });
        });
        /* @function :addGroupUser
         * @created  : 
         * @purpose  : request to add group of users to chat system
         */
        socket.on('addUsers', function (user) {
            // console.log("10----------------------------------------------------");
            //New user joins the default room
            socket.join(user.agreementId);
            //Tell all those in the room that a new user joined
            io.in(user.agreementId).emit('user joined', user);
            onlineUser[socket.id] = user.id;
            userModel.findOneAndUpdate({ '_id': user.id }, {
                $set: {
                    "is_online": true
                }
            }, function (err, res) {
                //console.log('user.id', user.id);
                if (err) {
                    console.log('err', err);
                } else {
                    //console.log('user online');
                    chatModel.findOneAndUpdate({
                        //from: user.id, is_available: true, group_id: { $ne: user.maintenanceId }
                        $or: [{
                            from: user.id, is_available: true, group_id: { $ne: user.agreementId }
                        }, {
                            to: user.id, is_available: true, group_id: { $ne: user.agreementId }
                        }]
                    }, {
                        $set: {
                            "is_available": false
                        }
                    }).sort({ '_id': 1 }).exec(function (err, chatData) {
                        if (err) {
                            console.log(err)
                        } else {
                            //console.log('chatData', chatData);
                            if (chatData != null) {
                                socket.leave(chatData.group_id);
                                io.in(chatData.group_id).emit('agreementUserLeaveChat', user);
                            }
                        }
                    });
                }
            });
        });


        /* @function :addUser
         * @created  : 
         * @purpose  : get request and send db stored private message when page load of 
         */
        socket.on('privateChatHistory', function (data) {
            // console.log("11----------------------------------------------------");
            var chatDataList = [];
            // console.log("I m here to call you");
            // console.log('data sdaf', data);
            // console.log("here  ", typeof data.from);
            // console.log("here  ", typeof data.to);
            chatModel.find({
                $or: [{
                    from: data.from,
                    to: data.to
                }, {
                    from: data.to,
                    to: data.from
                }]
            }).sort({ '_id': 1 }).populate("from").populate("to").exec(function (err, chatData) {
                if (err) {
                    if (err) console.log("Error : ", err);
                } else {
                    // console.log("chatDataList");
                    // console.log(chatDataList);
                    chatDataList = _.last(chatData, 10);
                    // console.log('chatDataList ', chatDataList);
                    io.to(usernames[data.from]).emit('privateChatHistoryRes', chatDataList);
                }
            })
        })
        /* @function :addUser
         * @created  : 
         * @purpose  : get request and send db stored private message when page load of 
         */
        socket.on('privateChatDisputeHistory', function (data) {
            var chatDataList = [];
            // console.log('data sdaf', data);
            chatModel.find({
                $or: [{
                    from: data.from,
                    to: data.to,
                    dispute_id: data.dispute_id,
                    is_disputes_communication: data.is_disputes_communication
                }, {
                    from: data.to,
                    to: data.from,
                    dispute_id: data.dispute_id,
                    is_disputes_communication: data.is_disputes_communication
                }]
            }).sort({ '_id': 1 }).populate("from").populate("to").exec(function (err, chatData) {
                if (err) {
                    if (err) console.log(err)
                } else {
                    chatDataList = _.last(chatData, 10);
                    // console.log('chatDataList', chatDataList);
                    //io.to(usernames[data.from]).emit('privateChatHistoryRes', chatDataList);
                    io.to(usernames[data.to]).emit('privateChatHistoryRes', chatDataList);
                }
            })
        })
        /* @function :get chat group chat history
         * @created  : 
         * @purpose  : get request and send db stored private message when page load of 
         */
        socket.on('groupChatHistory', function (data) {
            // console.log("15----------------------------------------------------");
            var chatDataList = [];
            // console.log('data sdaf', data);
            chatModel.find({
                group_id: data.agreementId, is_general_communication: true
            }).sort({ '_id': 1 }).populate("from").populate("to").exec(function (err, chatData) {
                if (err) {
                    if (err) console.log(err)
                } else {
                    chatDataList = _.last(chatData, 10);
                    // console.log('chatDataList', chatDataList);
                    io.in(data.agreementId).emit('groupChatResponse', chatData);
                }
            })
        })
        socket.on('group_message_sent', function (data) {
            // console.log("16----------------------------------------------------");
            // console.log('data', data);
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_general_communication: true,
                group_id: data.agreementId,
                is_available: true
                // document_name: data.document_name,
                // document_path: data.document_path,
                // size: data.size,
                // is_file: (data.is_file==true)?true:false
            }
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    //Send message to those connected in the room
                    io.in(data.agreementId).emit('group_message_recieved', chatData);
                }
            });
        });
        socket.on('group_message_sent_with_file', function (data) {
            // console.log("17----------------------------------------------------");
            // console.log('data', data);
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_general_communication: true,
                group_id: data.agreementId,
                document_name: data.document_name,
                document_path: data.document_path,
                size: data.size,
                is_available: true,
                is_file: (data.is_file == true) ? true : false
            }
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    //Send message to those connected in the room
                    io.in(data.agreementId).emit('group_message_recieved', chatData);
                }
            });
        });
        /* @function :addUser
         * @created  : 
         * @purpose  : get request for private message from one user to another
                        send response to both sender and receiver
         */
        socket.on('private message', function (data) {
            // console.log("18----------------------------------------------------");
            var to = data.to;
            // console.log(data);
            var receiver = usernames[data.to];
            var sender = usernames[data.from];
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                document_name: data.document_name,
                document_path: data.document_path,
                created: Date.now(),
                size: data.size,
                is_file: (data.is_file == true) ? true : false
            }
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    var to_users = [];
                    to_users.push({ "users_id": mongoose.Types.ObjectId(data.to) });
                    var noti = {
                        subject: "Message from " + data.firstname + " " + data.lastname + " ",
                        message: data.textMsg,
                        from_user: data.from,
                        to_users: to_users,
                        type: 3
                    }
                    var notification_ = new notificationModel(noti);
                    notification_.save(function (err, notificationData) { });

                    // sending response to both sender and receiver
                    io.to(receiver).volatile.emit('received', data);
                    io.to(sender).volatile.emit('sent', data);
                }
            });
        });
        /* @function :message sent for dispute
         * @created  : 
         * @purpose  : get request for private message from one user to another
                        send response to both sender and receiver
         */
        socket.on('private_dispute_message', function (data) {
            var to = data.to;
            //console.log("data",data);
            var receiver = usernames[data.to];
            var sender = usernames[data.from];
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                dispute_id: data.dispute_id,
                is_disputes_communication: data.is_disputes_communication,
                document_name: data.document_name,
                document_path: data.document_path,
                size: data.size,
                is_file: (data.is_file == true) ? true : false
            }
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    // sending response to both sender and receiver
                    io.to(receiver).volatile.emit('received', data);
                    io.to(sender).volatile.emit('sent', data);
                }
            });
        });
        /* @function :addUser
         * @created  : 
         * @purpose  : to notify that message is read by another user
         */
        socket.on('setRead', function (data) {
            // console.log("40----------------------------------------------------");
            var sender = usernames[data.from._id];
            var receiver = usernames[data.to._id];
            setRead(data, function () {
                io.to(receiver).volatile.emit('done', "success");
                io.to(sender).volatile.emit('done', "success");
            });
        })

        /* @function :addUser
         * @created  : 
         * @purpose  : to notify that all message is read by another user
         */
        socket.on('setReadAll', function (data) {
            // console.log("21----------------------------------------------------");
            // console.log('data', data);
            var sender = usernames[data.from._id];
            var receiver = usernames[data.to._id];
            setReadAll(data, function () {
                io.to(receiver).volatile.emit('open', "success");
                io.to(sender).volatile.emit('open', "success");
            });
        })
        /**
         * Maintenance Group chat start from here 
         *
         */
        /* @function :addGroupUser
            * @created  : 
            * @purpose  : request to add group of users to chat system
            */
        socket.on('addMaintenanceUsers', function (user) {
            //New user joins the default room
            socket.join(user.maintenanceId);
            //Tell all those in the room that a new user joined
            io.in(user.maintenanceId).emit('maintenanceUserJoined', user);
            onlineUser[socket.id] = user.id;
            userModel.findOneAndUpdate({ '_id': user.id }, {
                $set: {
                    "is_online": true
                }
            }, function (err, res) {
                //console.log('user.id', user.id);
                if (err) {
                    console.log('err', err);
                } else {
                    chatModel.findOneAndUpdate({
                        //from: user.id, is_available: true, group_id: { $ne: user.maintenanceId }
                        $or: [{
                            from: user.id, is_available: true, group_id: { $ne: user.maintenanceId }
                        }, {
                            to: user.id, is_available: true, group_id: { $ne: user.maintenanceId }
                        }]
                    }, {
                        $set: {
                            "is_available": false
                        }
                    }).sort({ '_id': 1 }).exec(function (err, chatData) {
                        if (err) {
                            console.log(err)
                        } else {
                            // console.log('chatData',chatData);
                            if (chatData != null) {
                                // console.log('if called');
                                socket.leave(chatData.maintenance_id);
                                io.in(chatData.group_id).emit('maintenanceUserLeaveChat', user);
                            }
                        }
                    });
                }
            });
        });
        /* @function :get chat group chat history
        * @created  : 
        * @purpose  : get request and send db stored private message when page load of 
        */
        socket.on('maintenanceGroupChatHistory', function (data) {
            // console.log("data   ", data);
            var chatDataList = [];
            chatModel.find({
                // group_id: data.maintenanceId,
                maintenance_id: data.maintenanceId,
                // is_maintenance_chat: true
            }).populate("from").populate("to").populate("proposal_id").populate("maintenance_id").exec(function (err, chatData) {
                if (err) {
                    if (err) console.log(err)
                } else {
                    // chatDataList = _.last(chatData, 10);
                    chatDataList = chatData;
                    // console.log('chatDataList      ', chatDataList);
                    io.in(data.maintenanceId).emit('maintenanceGroupChatResponse', chatData);
                }
            });
        })

        socket.on('maintenanceSingleChatHistory', function (data) {
            // console.log("data   ", data);
            var chatDataList = [];
            chatModel.find({
                maintenance_id: data.maintenanceId,
                // is_maintenance_chat: true
            }).populate("from").populate("to").populate("proposal_id").populate("maintenance_id").exec(function (err, chatData) {
                if (err) {
                    if (err) console.log(err)
                } else {
                    chatDataList = chatData;
                    io.in(data.maintenanceId).emit('maintenanceGroupChatResponse', chatData);
                }
            });
        })

        /* @function :group message sent 
        * @created  : 
        * @purpose  : To sent a message to each member in a group  
        */
        socket.on('maintenanceGroupMessageSent', function (data) {
            // console.log('data', data);
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_available: true,
                is_maintenance_chat: true,
                group_id: data.maintenanceId,
                proposal_id: data.proposal_id,
                maintenance_id: data.maintenanceId,
                // document_name: data.document_name,
                // document_path: data.document_path,
                // size: data.size,
                // is_file: (data.is_file==true)?true:false
            }
            if (data.is_status) {
                obj.is_status = data.is_status;
            }
            // console.log("obj.is_status   ", obj.is_status);
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    //Send message to those connected in the room
                    io.in(data.maintenanceId).emit('maintenanceGroupMessageRecieved', chatData);
                }
            });
        });
        /* @function :group message sent with files 
        * @created  : 
        * @purpose  : To sent a file to each member in a group  
        */
        socket.on('maintenanceGroupMessageSentWithFile', function (data) {
            // console.log('data', data);
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_maintenance_chat: true,
                is_available: true,
                group_id: data.maintenanceId,
                document_name: data.document_name,
                document_path: data.document_path,
                maintenance_id: data.maintenanceId,
                size: data.size,
                is_file: (data.is_file == true) ? true : false
            }
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    //Send message to those connected in the room
                    io.in(data.maintenanceId).emit('maintenanceGroupMessageRecieved', chatData);
                }
            });
        });

        /* @function :message sent to specitif user in MR Details Page
        * @created  : 
        * @purpose  : To sent a message to user for specific MR
        */
        socket.on('maintenanceSingleMessageSent', function (data) {
            // console.log('data', data);
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_available: true,
                is_maintenance_chat: true,
                proposal_id: data.proposal_id,
                maintenance_id: data.maintenanceId
            }
            if (data.is_status) {
                obj.is_status = data.is_status;
            }
            // console.log("obj.is_status   ", obj.is_status);
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    //Send message to those connected in the room
                    io.in(data.maintenanceId).emit('maintenanceSingleMessageRecieved', chatData);
                }
            });
        });

        /* @function : file sent to specitif user in MR Details Page
        * @created  : 
        * @purpose  : To sent a file to user for specific MR
        */
        socket.on('maintenanceSingleMessageSentWithFile', function (data) {
            // console.log('data', data);
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_maintenance_chat: true,
                is_available: true,
                document_name: data.document_name,
                document_path: data.document_path,
                maintenance_id: data.maintenanceId,
                size: data.size,
                is_file: (data.is_file == true) ? true : false
            }
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    //Send message to those connected in the room
                    io.in(data.maintenanceId).emit('maintenanceSingleMessageRecieved', chatData);
                }
            });
        });



        /**
         * Maintenance Group chat start from here 
         *
         */
        /* @function :addGroupUser
            * @created  : 
            * @purpose  : request to add group of users to chat system
            */
        socket.on('addNoticeBoardUsers', function (user) {
            //New user joins the default room
            socket.join(user.maintenanceId);
            //Tell all those in the room that a new user joined
            io.in(user.maintenanceId).emit('noticeBoardUserJoined', user);
            onlineUser[socket.id] = user.id;
            userModel.findOneAndUpdate({ '_id': user.id }, {
                $set: {
                    "is_online": true
                }
            }, function (err, res) {
                //console.log('user.id', user.id);
                if (err) {
                    console.log('err', err);
                } else {
                    console.log('user online');
                    chatModel.findOneAndUpdate({
                        //from: user.id, is_available: true, group_id: { $ne: user.maintenanceId }
                        $or: [{
                            from: user.id, is_available: true, group_id: { $ne: user.maintenanceId }
                        }, {
                            to: user.id, is_available: true, group_id: { $ne: user.maintenanceId }
                        }]
                    }, {
                        $set: {
                            "is_available": false
                        }
                    }).sort({ '_id': 1 }).exec(function (err, chatData) {
                        if (err) {
                            console.log(err)
                        } else {
                            // console.log('chatData',chatData);
                            if (chatData != null) {
                                // console.log('if called');
                                //console.log('chatData',chatData);
                                //socket.leave(user.maintenanceId);
                                socket.leave(chatData.maintenance_id);
                                io.in(chatData.group_id).emit('noticeBoardUserLeaveChat', user);
                            }
                        }
                    });
                }
            });
        });
        /* @function :get chat group chat history
        * @created  : 
        * @purpose  : get request and send db stored private message when page load of 
        */
        socket.on('noticeBoardGroupChatHistory', function (data) {
            var chatDataList = [];
            chatModel.find({
                group_id: data.maintenanceId, is_maintenance_chat: true
            }).sort({ '_id': 1 }).populate("from").populate("to").populate("proposal_id").populate("maintenance_id").exec(function (err, chatData) {
                if (err) {
                    if (err) console.log(err)
                } else {
                    chatDataList = _.last(chatData, 10);
                    //console.log('chatDataList', chatDataList);
                    io.in(data.maintenanceId).emit('noticeBoardGroupChatResponse', chatData);
                }
            });
        })
        /* @function :group message sent 
        * @created  : 
        * @purpose  : To sent a message to each member in a group  
        */
        socket.on('noticeBoardGroupMessageSent', function (data) {
            //console.log('data', data);
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_available: true,
                is_maintenance_chat: true,
                group_id: data.maintenanceId,
                proposal_id: data.proposal_id,
                maintenance_id: data.maintenanceId,
                // document_name: data.document_name,
                // document_path: data.document_path,
                // size: data.size,
                // is_file: (data.is_file==true)?true:false
            }
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    //Send message to those connected in the room
                    io.in(data.maintenanceId).emit('noticeBoardGroupMessageRecieved', chatData);
                }
            });
        });
        /* @function :group message sent with files 
        * @created  : 
        * @purpose  : To sent a file to each member in a group  
        */
        socket.on('noticeBoardGroupMessageSentWithFile', function (data) {
            // console.log('data', data);
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_maintenance_chat: true,
                is_available: true,
                group_id: data.maintenanceId,
                document_name: data.document_name,
                document_path: data.document_path,
                maintenance_id: data.maintenanceId,
                size: data.size,
                is_file: (data.is_file == true) ? true : false
            }
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    //Send message to those connected in the room
                    io.in(data.maintenanceId).emit('noticeBoardGroupMessageRecieved', chatData);
                }
            });
        });

        /* @function :chat message sent 
        * @created  : 
        * @purpose  : To sent a message to each member in a group  
        */
        socket.on('ChatMessageSent', function (data) {
            console.log('socket.on => ', data);
            var socket_id = this.id;
            // console.log("socker ", this.id);
            var obj = {
                from: data.from,
                to: data.to,
                sender_role_id: data.role_id,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_available: true,
                group_id: null
            }
            if (data.agency_id) {
                obj.agencyPrincipleId = data.agency_id
            }
            console.log('messgae sent :: chat obj => ', obj);
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log('Error occured while saving chat ==>', err);
                } else {
                    console.log('chatData :: check for saved chat => ', chatData);
                    var to_users = [];
                    to_users.push({ "users_id": mongoose.Types.ObjectId(data.to) });
                    var noti = {
                        subject: "Message from " + data.firstname + " " + data.lastname + " ",
                        message: data.textMsg,
                        from_user: data.from,
                        to_users: to_users,
                        type: 3
                    }
                    var notification_ = new notificationModel(noti);
                    notification_.save(function (err, notificationData) { });

                    // console.log("i m calling....", data.to);
                    // console.log("io.in    ", io.in);
                    //Send message to those connected in the room
                    // io.in(data.to).emit('chatMessageRecieved', chatData);
                    io.to(usernames[data.to]).emit('chatMessageRecieved', chatData);
                }
            });
        });
        /* @function :chat message sent with files 
        * @created  : 
        * @purpose  : To sent a file to each member in a group  
        */
        socket.on('ChatMessageSentWithFile', function (data) {
            var obj = {
                from: data.from,
                to: data.to,
                property_id: data.from.propertyId,
                msg: data.textMsg,
                time: data.time,
                isRead: false,
                is_available: true,
                group_id: null,
                document_name: data.document_name,
                document_path: data.document_path,
                size: data.size,
                is_file: (data.is_file == true) ? true : false
            }
            var msg = new chatModel(obj);
            msg.save(function (err, chatData) {
                if (err) {
                    console.log(err);
                } else {
                    //Send message to those connected in the room
                    io.in(usernames[data.to]).emit('chatMessageRecieved', chatData);
                }
            });
        });


        /* @function :get chat group chat history
        * @created  : 
        * @purpose  : get request and send db stored private message when page load of 
        */
        socket.on('ChatMessageHistory', function (data) {
            chatModel.find({
                $or: [{
                    from: data.from,
                    to: data.to
                }, {
                    from: data.to,
                    to: data.from
                }]
            }).sort({ '_id': 1 }).populate("from").populate("to").exec(function (err, chatData) {
                if (err) {
                    if (err) console.log("Error : ", err);
                } else {
                    // console.log("usernames     ", usernames, "   ", data.to);
                    io.to(usernames[data.from]).emit('privateWindowChatHistory', chatData, data.from, data.to);
                    io.to(usernames[data.to]).emit('privateWindowChatHistory', chatData, data.from, data.to);
                }
            });
        });

        // ===================================Chat section end======================================================
        console.info('--------------------------')
        console.info('connection end =>')
        console.info('--------------------------')
        exports.test = function (obj) {
            getNotification(obj.to, function (data) {
                io.to(usernames[obj.to]).volatile.emit('notification', data)
            })
        }
        console.info('--------------------------')
        console.info('connection export end =>')
        console.info('--------------------------')
    });

};

var setRead = function (data, fn) {
    chatModel.find({
        "from": data.from._id,
        "property_id": data.property_id,
        "to": data.to._id
    }).sort({
        _id: -1
    }).limit(1).exec(function (err, result) {
        if (err) console.log(err);
        else {
            if (result.length)
                chatModel.update({
                    _id: result._id
                }, {
                    $set: {
                        "isRead": true
                    }
                }).exec(function (err, result2) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log("updated chat: ", result2);
                        return fn("done")
                    }
                })
        }
    });
}

var setReadAll = function (data, fn) {

    chatModel.find({
        "from": data.from._id,
        "property_id": data.property_id,
        "to": data.to._id,
        // "isRead": false
    }).exec(function (err, result) {
        if (err) console.log("err1", err);
        else {
            if (result.length) {
                chatModel.update({
                    "from": data.from._id,
                    "property_id": data.property_id,
                    "to": data.to._id,
                    "isRead": false
                }, {
                    $set: {
                        "isRead": true
                    }
                }, {
                    multi: true
                }).exec(function (err, result) {
                    if (err) {
                        console.log("err2", err);
                    } else {
                        return fn('done')
                    }
                })
            } else {
                return fn('done')
            }
        }
    });
}
var getUsersWithTotalCount = function (data, fn) {
    //get list of unread messages from others
    chatModel.find({
        "to": data._id,
        "isRead": false
    }).populate("from").populate("property_id").exec(function (err, result) {
        if (err) {
            return fn(err, null);
        } else {
            return fn(null, result);
        }
    });
}
var getEmployeeWithCount = function (data, fn) {
    //console.log('finalobddddsdygrty', data);
    chatModel.find({
        "to": data._id,
        property_id: data.propertyId
    }).populate('from').populate({ path: 'property_id', populate: { path: 'owner_id' } }).exec(function (err, result) {
        //console.log("result", result);
        var finalobj = {
            userList: []
        }
        if (err) {
            return fn(err, null);
            console.log(err)
        } else {

            var count = _.countBy(result, function (item) {
                return item.from;
            });
            //get user list
            // var roleId = (data.details.role == 1) ? 2 : 1;
            if (result) {
                var result = result;
                // var userList = [];
                var finalobj = {
                    userList: [],
                    propertyList: [],
                    totalcount: 0
                }

                var user = [];
                var property = [];
                var propertyData = [];
                var mergeData = [];
                var finalData = [];
                var users = [];
                var users1 = [];
                // console.log("result@@@@@@@@@@@",result);
                property = _.pluck(result, 'property_id');
                user = _.pluck(result, 'from');
                users = _.uniq(user);
                propertyData = _.uniq(property);
                // mergeData.push(propertyData);
                // mergeData.push(userList);
                // finalData= mergeData;
                users1 = _.flatten(users);
                //console.log("userList@@@@@@@@@@@@@@@@@@@@@@@", users1);
                finalobj.userList = users1;
                finalobj.propertyList = propertyData;
                // finalobj.property = propertyData;
                return fn(null, finalobj);
            } else {
                return fn(null, []);
            }
        }
    });
}
var getAppliedUsersWithCount = function (data, fn) {
    //console.log("\n\n\n getAppliedUsersWithCount@@@@@@@jtyumkyt@@@@@@@", data)
    //get list of unread messages from others
    chatModel.find({
        "from": data._id,
        property_id: data.propertyId
    }).populate('from').populate('to').exec(function (err, result) {
        //console.log('result', result);
        if (err) {
            return fn(err, null);
        } else {
            //console.log('result@@@@@@@@@@@@@@', result);
            //get count by sender
            var count = _.countBy(result, function (item) {
                // console.log("*********item",item);
                return item.from;
            });
            //get user list
            if (result) {
                var result = result;
                var userList = [];
                var finalobj = {
                    userList: [],
                    totalcount: 0
                }
                _.each(result, function (item, key) {
                    var obj = {};
                    if (count.hasOwnProperty(item.to._id) || count.hasOwnProperty(item.from._id)) {
                        obj = {
                            msgcount: count[item.to._id],
                            details: item.to,
                            property: item.property_id
                        }
                        // console.log('obj', obj);
                        finalobj.totalcount = finalobj.totalcount + count[item.to._id];
                        //userList.push(obj);
                        if (userList.length == 0) {
                            userList.push(obj);
                        } else {
                            _.each(userList, function (arrayItem, key) {
                                if (arrayItem.details._id != item.to._id)
                                    userList.push(obj);
                            });
                        }
                    } else {
                        obj = {
                            details: item.to,
                            property: item.property_id
                        }
                        if (userList.length == 0) {
                            userList.push(obj);
                        } else {
                            _.each(userList, function (arrayItem, key) {
                                if (arrayItem.details._id != item.to._id && arrayItem.details._id != item.from._id) {
                                    userList.push(obj);
                                }
                            });
                        }
                    }
                });
                var user = [];
                var property = [];
                var a = [];
                property = _.pluck(userList, 'property');
                user = _.pluck(userList, 'details');
                var user3 = [];
                user3 = _.uniq(property);

                //console.log("((((((((((((((unique***********r", _.uniq(property));
                finalobj.userList = user3;

                return fn(null, finalobj);
            } else {
                return fn(null, []);
            }
        }
    });
}
var getAssignedUsersWithCount = function (data, fn) {
    //get list of unread messages from others
    //console.log('finalobddd');
    chatModel.find({
        "to": data._id,
        property_id: data.propertyId,
        //"isRead": false
    }).populate('from').populate('to').populate('property_id').exec(function (err, result) {
        if (err) {
            return fn(err, null);
        } else {
            //console.log("result");
            //get count by sender
            var count = _.countBy(result, function (item) {
                return item.from;
            });
            var roleId = (data.role == 1) ? 2 : 1;
            if (result) {
                var result = result;
                var userList = [];
                var finalobj = {
                    userList: [],
                    totalcount: 0
                }
                _.each(result, function (item, key) {
                    var obj = {};
                    if (count.hasOwnProperty(item.from._id)) {
                        obj = {
                            msgcount: count[item.from._id],
                            details: item.from
                        }
                        finalobj.totalcount = finalobj.totalcount + count[item.from._id];
                        //userList[key].details._id!=item.from._id
                        if (userList.length == 0) {
                            userList.push(obj);
                        } else {
                            _.each(userList, function (arrayItem, key) {
                                if (arrayItem.details._id != item.from._id)
                                    userList.push(obj);
                            });
                        }
                    } else {
                        obj = {
                            details: item.from
                        }
                        if (userList.length == 0) {
                            userList.push(obj);
                        } else {
                            _.each(userList, function (arrayItem, key) {
                                if (arrayItem.details._id !== item.from._id && arrayItem.details._id != item.to._id) {
                                    userList.push(obj);
                                }
                            });
                        }
                    }
                });
                //console.log("userList,userList", userList);
                // var user = [];
                // var property = [];
                // var a = [];
                // user = _.pluck(userList, 'property');
                // property = _.pluck(userList, 'property');
                // a = _.pluck(userList, 'to');
                // console.log("a",a);
                // var user3 = [];
                // user3 = _.uniq(user);
                finalobj.userList = user3;
                finalobj.userList = userList;
                //console.log('finalobjeswdrfg', finalobj);
                return fn(null, finalobj);
            } else {
                return fn(null, []);
            }
        }
    });
}
var totalMessageCount = function (data) {
    //console.log("totalMessageCount ");
    chatModel.find({ $or: [{ "to": data }, { "isRead": false }] }).exec(function (err, result) {
        if (err) {
            console.log("error");
        } else if (result) {
            // console.log("inside msg count", result);
        }

    });
}

