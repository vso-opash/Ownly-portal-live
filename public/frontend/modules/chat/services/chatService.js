'use strict';
angular.module('SYNC').factory('chatService', function($resource, $rootScope) {
    return {
        saveProperty: function() {
            return $resource('/properties/save_properties/', null, {
                post: {
                    method: 'POST',
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }
            })
        },
        tenantList: function() {
            return $resource(webservices.tenantList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        sendMessage: function() {
            return $resource(webservices.sendMessage, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getChatUserList: function() {
            return $resource(webservices.getChatUserList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getIndividualChat: function() {
            return $resource(webservices.getIndividualChatCount, null, {
                post: { method: 'POST' }
            })
        },
        updateChatIsRead: function() {
            return $resource(webservices.updateChatIsRead, null, {
                post: { method: 'POST' }
            })
        },
        UserChatMsgCountBuyer: function() {
            return $resource(webservices.UserChatMsgCountBuyer, null, {
                post: { method: 'POST' }
            })
        },
        getUserMessage:  function() {
            return $resource(webservices.getUserMessage, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        unreadChatNotification: function() {
                return $resource(webservices.unreadChatNotification, null, {
                    post: { method: 'POST' }
                })
            }
            ,allUnreadChatNotificationSeller : function() {
                return $resource(webservices.unreadChatNotification, null, {
                    post: { method: 'POST' }
                })
            }
            // unreadChatNotificationSeller: function() {
            //     return $resource(webservices.unreadChatNotificationSeller, null, {
            //         post: { method: 'POST' }
            //     })
            // }
            ,
            markMessageAsRead: function() {
                return $resource(webservices.markMessageAsRead, null, {
                    post: {
                        method: 'POST'
                    }
                })
            }
    }

});

// angular.module('socketService', [])
// .factory('socket', function($rootScope) {
//     var socket = io.connect();
//     return {
//         on: function(eventName, callback) {
//             socket.on(eventName, function() {
//                 var args = arguments;
//                 $rootScope.$apply(function() {
//                     callback.apply(socket, args);
//                 });
//             });
//         },
//         emit: function(eventName, data, callback) {
//             socket.emit(eventName, data, function() {
//                 var args = arguments;
//                 $rootScope.$apply(function() {
//                     if (callback) {
//                         callback.apply(socket, args);
//                     }
//                 });
//             })
//         }
//     };
// })
// .factory("Chat", function($rootScope, $resource) {
//     return {
//         read: function() {
//             return $resource('/chat/set_read');
//         },
//         readAll: function() {
//             return $resource('/chat/set_readall');
//         }
//     }
// });