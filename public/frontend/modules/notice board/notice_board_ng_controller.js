/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 */
(function () {
    angular.module('SYNC')
        .controller("NoticeBoardCtrl", NoticeBoardCtrl);
    NoticeBoardCtrl.$inject = [
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
        'noticeBoardService',
        'socket',
        'uiCalendarConfig',
    ];
    function NoticeBoardCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $http, $filter, $window, $location, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AlertService, toastr, blockUI, blockUIConfig, $anchorScroll, noticeBoardService, socket, uiCalendarConfig) {
        $scope.pagination = {
            current: 1
        };
        $scope.inspection = [];
        $scope.eventSources2 = [$scope.inspection];

        $scope.fileImageUrl = baseUrl + '/document/';
        $scope.userImageUrl = baseUrl + '/user_image/';
        $scope.newArray2 = [];
        $scope.userId = $localStorage.loggedInUserId; //for checking the created by post in html page
        $scope.roleAccess = [];
        $scope.roleList = noticeBoardRoles;
        $scope.notice = {};
        $scope.legibleRole = [];
        $scope.notice.enable_thread_post = true;
        $scope.filterMatch = 'By best match';
        $scope.propertyImageUrl = baseUrl + '/property_image/';
        $scope.user = [];
        $scope.selectedAll = false;
        $scope.noticeProperties = [];
        $rootScope.editNoticeProperties = [];
        $rootScope.checkedListProperty = [];
        $scope.canCreateNoticeBoard = false;
        if ($localStorage.role_id == roleId.runStrataManagementCompany || $localStorage.role_id == roleId.workForStrataManagementCompany) {
            $scope.canCreateNoticeBoard = true;
        }
        $scope.openAddModal = function () {
            // if ($localStorage.role_id == roleId.runStrataManagementCompany || $localStorage.role_id == roleId.workForStrataManagementCompany) {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/notice board/views/create_notice.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    // $scope.roleIndex = [];
                    $scope.item = {};
                    $scope.item.Selected = "";
                    $scope.notice = {};
                    $scope.noticeProperties = [];
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $scope.item = {};
                        $scope.item.Selected = "";
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.agencyCount = 0;
                    $scope.agentCount = 0;
                    $scope.ownerCount = 0;
                    $scope.tenantCount = 0;
                    $scope.totalCount = 0;
                    $scope.getUsersCount = function (propertyData) {
                        var propertyIds = [];
                        angular.forEach(propertyData, function (value, key) {
                            propertyIds.push(value._id);
                        });
                        var postData = {
                            "property_arr": propertyIds
                        }
                        noticeBoardService.getUserCount().post(postData, function (response) {
                            if (response.code == 200) {
                                $scope.agencyCount = response.agencyCnt;
                                $scope.agentCount = response.agentCnt;
                                $scope.ownerCount = response.ownerCnt;
                                $scope.tenantCount = response.tenantCnt;
                                $scope.totalCount = ($scope.agencyCount + $scope.agentCount + $scope.ownerCount + $scope.tenantCount);
                            }
                        });
                    }
                    $scope.setCustomUserValue = function (customValue) {
                        // console.log('value', customValue);
                    }
                    $scope.getAgencyProperty = function () {
                        blockUI.start();
                        noticeBoardService.getPropertyList().get(function (response) {
                            if (response.code == 200) {
                                $scope.propertyList = response.data;
                                if ($scope.propertyList.length == 0 && response.data.length == $scope.propertyList.length) {
                                    $state.go('noticeBoardListing');
                                    // console.log('No record found');
                                    $scope.cancel();
                                } else {
                                    // $scope.noticeRoles = [];
                                    $scope.Items = noticeBoardRoles;
                                }
                                blockUI.stop();
                            } else {
                                $state.go('noticeBoardListing');
                                toastr.warning("You are not associated with any property to create notice board");
                                blockUI.stop();
                                $scope.cancel();
                            }
                        });
                        blockUI.stop();
                    };
                    $scope.allOption = "All";
                    var modelScope = {
                        "checkboxModel": "checkboxModel",
                        "selectedItems": "selectedItems"
                    };
                    $scope.data = [0, 1, 2, 3];
                    $scope.checkboxModel = [];
                    $scope.selectedItems = [];

                    $scope.onClickFn = function (val) {
                        if (val == $scope.allOption)
                            resultsFnAll();
                        else
                            addorRemoveItems(val);
                    };
                    function addorRemoveItems(val) {
                        if ($scope[modelScope.checkboxModel][val]) {
                            $scope[modelScope.selectedItems].push(val);
                        } else if (!$scope[modelScope.checkboxModel][val]) {
                            $scope[modelScope.selectedItems].splice($scope[modelScope.selectedItems].indexOf(val), 1);
                        };

                        if ($scope[modelScope.selectedItems].length >= ($scope.data.length))
                            $scope[modelScope.checkboxModel][$scope.allOption] = true;
                        else
                            $scope[modelScope.checkboxModel][$scope.allOption] = false;
                    };
                    function resultsFnAll() {
                        var allVal = $scope[modelScope.checkboxModel][$scope.allOption];
                        if (allVal)
                            $scope[modelScope.selectedItems] = angular.copy($scope.data);
                        else
                            $scope[modelScope.selectedItems] = [];

                        for (property in $scope["data"]) {
                            $scope[modelScope.checkboxModel][$scope["data"][property]] = allVal;
                        };
                    };
                    $scope.saveNotice = function (notice) {
                        blockUI.start();
                        var propertyIds = [];
                        angular.forEach($scope.noticeProperties, function (value, key) {
                            propertyIds.push(value._id);
                        });
                        if ($scope.createNoticeForm.$invalid == false && ($scope.selectedItems.length || $scope.selectedAll == true) && $scope.noticeProperties.length > 0) {
                            if ($scope.checkboxModel[$scope.allOption] == false) {
                                var obj = {};
                                obj = notice;
                                obj.propertiesArr = propertyIds;
                                obj.created_by = $localStorage.loggedInUserId;
                                if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                    obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                                }
                                obj.assign_to_roles = [];
                                angular.forEach($scope.selectedItems, function (value, key) {
                                    obj.assign_to_roles[key] = _.pick($scope.Items[value], '_id');
                                    if ($scope.selectedItems.length == obj.assign_to_roles.length) {
                                        noticeBoardService.addNoticeBoard().post(obj, function (response) {
                                            if (response.code == 200) {
                                                toastr.success("Successfully created Notice board");
                                                $scope.noticeBoardList();
                                                $scope.cancel();
                                                blockUI.stop();
                                            } else {
                                                toastr.warning("Server is busy please try after some time");
                                                blockUI.stop();
                                            }
                                        });
                                    }
                                });
                            } else {
                                var obj = {};
                                obj = notice;
                                obj.created_by = $localStorage.loggedInUserId;
                                obj.propertiesArr = propertyIds;
                                if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                    obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                                }
                                obj.assign_to_roles = [];
                                angular.forEach($scope.Items, function (value, key) {
                                    obj.assign_to_roles[key] = _.pick($scope.Items[key], '_id');
                                    if ($scope.Items.length == obj.assign_to_roles.length) {
                                        noticeBoardService.addNoticeBoard().post(obj, function (response) {
                                            if (response.code == 200) {
                                                toastr.success("Successfully created Notice board");
                                                $scope.item.Selected = false;
                                                $scope.selectedAll = false;
                                                $scope.noticeBoardList();
                                                $scope.cancel();
                                                blockUI.stop();
                                            } else {
                                                toastr.warning("Server is busy please try after some time");
                                                blockUI.stop();
                                            }
                                        });
                                    }
                                });
                            }
                        } else {
                            toastr.error('Please fill the form completely');
                        }
                        blockUI.stop();
                    };
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
            // } else {
            //     toastr.warning('You do not have access permission');
            // }
        };
        $scope.noticeBoardList = function () {
            $scope.selectedTab('All');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            blockUI.start();
            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                var obj = {};
                obj.role_id = $localStorage.role_id;
                obj.user_id = $localStorage.loggedInUserId;
                obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                noticeBoardService.noticeBoardListing().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.noticeList = response.data;
                        blockUI.stop();
                    } else {
                        $scope.noticeList = [];
                        blockUI.stop();
                    }
                });
                blockUI.stop();
            } else {
                toastr.error('You are not associated with any property to view the notice board');
                blockUI.stop();
            }
        };
        // $scope.getCoustomMemberList = function(){
        //     if($scope.noticeData && $scope.noticeData.property_id_arr){
        //         var result = $scope.noticeData.property_id_arr.map(a => a._id);
        //         console.log("here is yours result ::>",result);
        //     }
        // }
        // $scope.$watch('propertyList', function (newValue, oldValue) {
        //    console.log("newValue>>>>",newValue,oldValue);
        // }, true);
        // $scope.getStatisticsByPropertyId = function(){
        //     console.log("here is data:::>",$scope.noticeProperties);
        // }
        // $scope.getStatistics = function(){

        // }
        /**
* Function is to be called on page click
* @access private
* @return json
* Created 
* @smartData Enterprises (I) Ltd
* Created Date 22-Nov-2017
*/
        $scope.pageChanged = function (page) {
            if (document.getElementById("postView")) {
                var elmnt = document.getElementById("postView");
                elmnt.scrollIntoView();
            } else {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
        }
        $scope.openCreatePostModal = function (role) {
            // if ($localStorage.role_id == roleId.runStrataManagementCompany || $localStorage.role_id == roleId.workForStrataManagementCompany) {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/notice board/views/create_post.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    // $scope.roleIndex = [];
                    $scope.is_customPic = false;
                    $scope.item = {};
                    $scope.data = [];
                    $scope.custom = false;
                    $scope.item.Selected = "";
                    $scope.customSelectedUserList = [];
                    $scope.is_customPic = false;
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $scope.item = {};
                        $scope.item.Selected = "";
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.showCustom = function (checkedValue) {
                        // console.log('checkedValue', checkedValue);
                        if (checkedValue == true) {
                            $scope.is_customPic = true;
                        } else {
                            $scope.is_customPic = false;
                        }
                    }
                    $scope.noticeForRoles = function () {
                        blockUI.start();
                        $scope.Items = role;
                        angular.forEach($scope.Items, function (value, key) {
                            $scope.data[key] = key;
                            // if($scope.data.length == $scope.Items.length){
                            //     $scope.watcherInfo();
                            //     blockUI.stop();
                            // }

                        });
                        blockUI.stop();
                    };
                    $scope.agencyCount = 0;
                    $scope.agentCount = 0;
                    $scope.ownerCount = 0;
                    $scope.tenantCount = 0;
                    $scope.totalCount = 0;
                    $scope.customUserList = [];
                    $scope.getUsersCounts = function (propertyData) {
                        var postData = {
                            "property_arr": propertyData
                        }
                        noticeBoardService.getUserCount().post(postData, function (response) {
                            if (response.code == 200) {
                                // console.log('response',response);
                                $scope.agencyCount = response.agencyCnt;
                                $scope.agentCount = response.agentCnt;
                                $scope.ownerCount = response.ownerCnt;
                                $scope.tenantCount = response.tenantCnt;
                                $scope.totalCount = ($scope.agencyCount + $scope.agentCount + $scope.ownerCount + $scope.tenantCount);
                                angular.forEach(response.data, function (value, key) {
                                    if (value.created_by)
                                        $scope.customUserList.push(value.created_by);
                                    if (value.owned_by)
                                        $scope.customUserList.push(value.owned_by);
                                    if (value.created_by_agency_id)
                                        $scope.customUserList.push(value.created_by_agency_id);
                                });
                                // angular.forEach($scope.customUserList, function (value, key) {
                                //     var obj1 = {};
                                //     obj1 = value;
                                //     console.log(value ,"obj1");
                                //     var fullname = obj1.firstname + " " + obj1.lastname;
                                //     var editedEmail = obj1.email;
                                //     obj1 = _.extend(obj1, { fullName: $scope.fullname+ "-" + editedEmail });
                                //     $scope.customUserList[key] = obj1;

                                // });
                                // console.log('$scope.customUserList', $scope.customUserList[0]);
                            }
                        });
                    }
                    $scope.getPropertyIds = function () {
                        var propertyIds = [];
                        angular.forEach($rootScope.editNoticeProperties, function (value, key) {
                            propertyIds.push(value._id);
                        });
                        $scope.getUsersCounts(propertyIds);
                    }();
                    $scope.watcherInfo = function () {
                        blockUI.start();
                        var obj1 = {};
                        // if ($localStorage.role_id == roleId.agent && $localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                        if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                            obj1.id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                            noticeBoardService.getWatchersList().get(obj1, function (response) {
                                if (response.code == 200) {
                                    $scope.watcher = response.data;
                                    angular.forEach($scope.watcher, function (value, key) {
                                        value.fullName = value.firstname + " " + value.lastname;
                                    });
                                    blockUI.stop();
                                } else {
                                    $scope.watcher = [];
                                    blockUI.stop();
                                }
                            });
                        }
                        blockUI.stop();
                    }
                    $scope.allOption = "All";
                    var modelScope = {
                        "checkboxModel": "checkboxModel",
                        "selectedItems": "selectedItems"
                    };
                    $scope.checkboxModel = [];
                    $scope.selectedItems = [];

                    $scope.onClickFn = function (val) {
                        if (val == $scope.allOption)
                            resultsFnAll();
                        else
                            addorRemoveItems(val);
                    };
                    function addorRemoveItems(val) {
                        if ($scope[modelScope.checkboxModel][val]) {
                            $scope[modelScope.selectedItems].push(val);
                        } else if (!$scope[modelScope.checkboxModel][val]) {
                            $scope[modelScope.selectedItems].splice($scope[modelScope.selectedItems].indexOf(val), 1);
                        };
                        // console.log("$s", $scope.custom);
                        // console.log("$scope[modelScope.selectedItems].length >= ($scope.data.length) && $scope.custom==true", $scope[modelScope.selectedItems].length >= ($scope.data.length));
                        if ($scope[modelScope.selectedItems].length >= ($scope.data.length)) {
                            $scope[modelScope.checkboxModel][$scope.allOption] = true;
                        } else {
                            $scope[modelScope.checkboxModel][$scope.allOption] = false;
                        }
                    };
                    function resultsFnAll() {
                        var allVal = $scope[modelScope.checkboxModel][$scope.allOption];
                        if (allVal) {
                            $scope[modelScope.selectedItems] = angular.copy($scope.data);
                            // $scope.custom=true;
                        } else {
                            $scope[modelScope.selectedItems] = [];
                            //$scope.custom=false;
                        }
                        for (property in $scope["data"]) {
                            $scope[modelScope.checkboxModel][$scope["data"][property]] = allVal;
                        };
                    };
                    // $scope.customMember = function(){
                    //     console.log("called");
                    //     if($scope.custom==false){
                    //         console.log("called",$scope.newArray2);
                    //         $scope.newArray2 = [];
                    //     }
                    // }();
                    $scope.noticePost = function (notice, status) {

                        blockUI.start();
                        if ($scope.addPostForm.$invalid == false && ($scope.selectedItems.length || $scope.selectedAll == true)) {
                            if ($scope.checkboxModel[$scope.allOption] == false) {
                                var obj = {};
                                obj = notice;
                                obj.noticeboard_id = $stateParams.id;
                                obj.created_by = $localStorage.loggedInUserId;
                                if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                    obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                                }
                                obj.assign_to_roles = [];
                                angular.forEach($scope.selectedItems, function (value, key) {
                                    obj.assign_to_roles[key] = _.pick($scope.Items[value], '_id');
                                    // console.log('obj',obj);
                                    // console.log('customList',customList);
                                    //obj.assign_to_users
                                    if ($scope.selectedItems.length == obj.assign_to_roles.length) {
                                        noticeBoardService.addNoticePost().post(obj, function (response) {
                                            if (response.code == 200) {
                                                toastr.success("Successfully created Notice post");
                                                $scope.getNoticeBoardDetailPage();
                                                $scope.cancel();
                                                blockUI.stop();
                                            } else {
                                                toastr.warning("Server is busy please try after some time");
                                                blockUI.stop();
                                            }
                                        });
                                        // }
                                    }
                                });
                            } else {
                                var obj = {};
                                obj = notice;
                                obj.created_by = $localStorage.loggedInUserId;
                                obj.noticeboard_id = $stateParams.id;
                                if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                    obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                                }
                                obj.assign_to_roles = [];
                                angular.forEach($scope.Items, function (value, key) {
                                    obj.assign_to_roles[key] = _.pick($scope.Items[key], '_id');
                                    if ($scope.Items.length == obj.assign_to_roles.length) {
                                        noticeBoardService.addNoticePost().post(obj, function (response) {
                                            if (response.code == 200) {
                                                toastr.success("Successfully created Notice post");
                                                $scope.item.Selected = false;
                                                $scope.selectedAll = false;
                                                $scope.getNoticeBoardDetailPage();
                                                $scope.cancel();
                                                blockUI.stop();
                                            } else {
                                                toastr.warning("Server is busy please try after some time");
                                                blockUI.stop();
                                            }
                                        });
                                    }
                                });
                            }
                        } else {
                            toastr.error('Please fill the form completely');
                        }
                        blockUI.stop();
                    };

                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
            // } else {
            //     toastr.warning('You do not have access permission');
            // }
        };
        $scope.getNoticeBoardDetailPage = function () {
            blockUI.start();
            var obj = {};
            obj.id = $stateParams.id;
            noticeBoardService.getNoticeBoardDetail().get(obj, function (response) {
                if (response.code == 200) {
                    $scope.roleInfo = [];
                    $scope.noticeData = response.data[0];
                    // console.log("$scope.noticeData");
                    // console.log($scope.noticeData);
                    $rootScope.editNoticeProperties = response.data[0].property_id_arr;
                    $scope.roleInfo = $scope.noticeData.assign_to_roles;
                    angular.forEach($scope.roleInfo, function (value, key) {
                        var obj1, obj2;
                        obj1 = value.role_id._id;
                        obj2 = value.role_id.description;
                        $scope.roleAccess[key] = _.extend({ _id: obj1 }, { name: obj2 })

                    });
                    blockUI.stop();
                } else {
                    toastr.warning("Server is busy please try after some time");
                    blockUI.stop();
                }
            });
        };
        $scope.goToPostDetail = function (id) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $location.path('/notice_post_detail/' + id);
        };
        $scope.postNoticeDetailPage = function () {
            blockUI.start();
            var obj = {};
            obj.id = $stateParams.id;
            noticeBoardService.getPostDetail().get(obj, function (response) {
                if (response.code == 200) {
                    $scope.noticePost = response.data;
                    blockUI.stop();
                } else {
                    toastr.warning("Server is busy please try after some time");
                    blockUI.stop();
                }
            });
        };
        $scope.openEditPost = function (role) {
            // if ($localStorage.role_id == roleId.runStrataManagementCompany || $localStorage.role_id == roleId.workForStrataManagementCompany) {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/notice board/views/edit_post.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    // $scope.roleIndex = [];
                    $scope.item = {};
                    $scope.data = [];
                    $scope.selectedItems = [];
                    $scope.item.Selected = "";
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $scope.item = {};
                        $scope.item.Selected = "";
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.noticeForRoles = function (role, noticeRole) {
                        $scope.Items = noticeRole;
                        //$scope.Items = role;
                        angular.forEach(role, function (value1, key1) {
                            angular.forEach($scope.Items, function (value2, key2) {
                                $scope.data[key2] = key2;
                                if (_.isEqual(value1._id, value2._id)) {
                                    $scope[modelScope.checkboxModel][key2] = true;
                                    $scope.onClickFn(key2);
                                }
                            });
                        });
                    };
                    $scope.postNoticeDetail = function () {
                        blockUI.start();
                        var obj = {};
                        obj.id = $stateParams.id;
                        noticeBoardService.getPostDetail().get(obj, function (response) {
                            if (response.code == 200) {
                                $scope.roleInfo = [];
                                $scope.noticeBoardRole = [];
                                $scope.noticeBoardRoleInfo = [];
                                $scope.notice = response.data;
                                $scope.roleInfo = $scope.notice.assign_to_roles;
                                $scope.noticeBoardRoleInfo = $scope.notice.noticeboard_id.assign_to_roles;
                                // console.log("$scope.noticeBoardRoleInfo", $scope.noticeBoardRoleInfo);
                                angular.forEach($scope.roleInfo, function (value, key) {
                                    var obj1, obj2;
                                    obj1 = value.role_id._id;
                                    obj2 = value.role_id.description;
                                    $scope.roleAccess[key] = _.extend({ _id: obj1 }, { name: obj2 })
                                    if ($scope.roleInfo.length == $scope.roleAccess.length) {
                                        //$scope.noticeForRoles($scope.roleAccess);
                                        angular.forEach($scope.noticeBoardRoleInfo, function (value2, key2) {
                                            var obj3, obj4;
                                            obj3 = value2.role_id._id;
                                            obj4 = value2.role_id.description;
                                            $scope.noticeBoardRole[key2] = _.extend({ _id: obj3 }, { name: obj4 })
                                            if ($scope.noticeBoardRole.length == $scope.noticeBoardRoleInfo.length) {
                                                // console.log("$scope.noticeBoardRole", $scope.noticeBoardRole);
                                                $scope.noticeForRoles($scope.roleAccess, $scope.noticeBoardRole);
                                            }
                                        });
                                    }
                                });
                                blockUI.stop();
                            } else {
                                toastr.warning("Server is busy please try after some time");
                                blockUI.stop();
                            }
                        });
                    };
                    $scope.allOption = "All";
                    var modelScope = {
                        "checkboxModel": "checkboxModel",
                        "selectedItems": "selectedItems"
                    };
                    $scope.checkboxModel = [];
                    $scope.onClickFn = function (val) {
                        if (val == $scope.allOption)
                            resultsFnAll();
                        else {
                            addorRemoveItems(val);
                        }

                    };
                    $scope.agencyCount = 0;
                    $scope.agentCount = 0;
                    $scope.ownerCount = 0;
                    $scope.tenantCount = 0;
                    $scope.totalCount = 0;
                    $scope.customUserList = [];
                    $scope.getUsersCounts = function (propertyData) {
                        var postData = {
                            "property_arr": propertyData
                        }
                        noticeBoardService.getUserCount().post(postData, function (response) {
                            if (response.code == 200) {
                                // console.log('response',response);
                                $scope.agencyCount = response.agencyCnt;
                                $scope.agentCount = response.agentCnt;
                                $scope.ownerCount = response.ownerCnt;
                                $scope.tenantCount = response.tenantCnt;
                                $scope.totalCount = ($scope.agencyCount + $scope.agentCount + $scope.ownerCount + $scope.tenantCount);
                                angular.forEach(response.data, function (value, key) {
                                    if (value.created_by)
                                        $scope.customUserList.push(value.created_by);
                                    if (value.owned_by)
                                        $scope.customUserList.push(value.owned_by);
                                    if (value.created_by_agency_id)
                                        $scope.customUserList.push(value.created_by_agency_id);
                                });
                                // console.log('$scope.customUserList', $scope.customUserList);
                            }
                        });
                    }

                    $scope.getPropertyIds = function () {
                        var propertyIds = [];
                        angular.forEach($scope.noticePost.noticeboard_id.property_id_arr, function (value, key) {
                            propertyIds.push(value._id);
                        });
                        $scope.getUsersCounts(propertyIds);
                    }();

                    function addorRemoveItems(val) {
                        if ($scope[modelScope.checkboxModel][val]) {
                            $scope[modelScope.selectedItems].push(val);
                        } else if (!$scope[modelScope.checkboxModel][val]) {
                            $scope[modelScope.selectedItems].splice($scope[modelScope.selectedItems].indexOf(val), 1);
                        };

                        if ($scope[modelScope.selectedItems].length >= ($scope.data.length))
                            $scope[modelScope.checkboxModel][$scope.allOption] = true;
                        else
                            $scope[modelScope.checkboxModel][$scope.allOption] = false;
                    };
                    function resultsFnAll() {
                        var allVal = $scope[modelScope.checkboxModel][$scope.allOption];
                        if (allVal)
                            $scope[modelScope.selectedItems] = angular.copy($scope.data);
                        else
                            $scope[modelScope.selectedItems] = [];

                        for (property in $scope["data"]) {
                            $scope[modelScope.checkboxModel][$scope["data"][property]] = allVal;
                        };
                    };

                    $scope.editNoticePost = function (notice) {
                        blockUI.start();
                        if ($scope.addPostForm.$invalid == false && ($scope.selectedItems.length || $scope.selectedAll == true)) {
                            // if ($scope.checkboxModel[$scope.allOption] == false) {
                            var obj = {};
                            obj.title = notice.title;
                            // obj.agenda_resolution = notice.agenda_resolution;
                            obj.description = notice.description;
                            obj.enable_thread_post = notice.enable_thread_post;
                            obj.noticeboard_id = notice.noticeboard_id._id;
                            obj.noticeboardpost_id = notice._id
                            obj.created_by = $localStorage.loggedInUserId;
                            if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                            }
                            obj.assign_to_roles = [];
                            angular.forEach($scope.selectedItems, function (value, key) {
                                obj.assign_to_roles[key] = _.pick($scope.Items[value], '_id');
                                if ($scope.selectedItems.length == obj.assign_to_roles.length) {
                                    noticeBoardService.editPost().post(obj, function (response) {
                                        if (response.code == 200) {
                                            toastr.success("Successfully created Notice post");
                                            $scope.postNoticeDetailPage();
                                            $scope.cancel();
                                            blockUI.stop();
                                        } else {
                                            toastr.warning("Server is busy please try after some time");
                                            blockUI.stop();
                                        }
                                    });
                                }
                            });
                            // } else {
                            //     var obj = {};
                            //     obj = notice;
                            //     obj.created_by = $localStorage.loggedInUserId;
                            //     obj.noticeboard_id = $stateParams.id;
                            //     if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                            //         obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                            //     }
                            //     obj.assign_to_roles = [];
                            //     angular.forEach($scope.Items, function (value, key) {
                            //         obj.assign_to_roles[key] = _.pick($scope.Items[key], '_id');
                            //         if ($scope.Items.length == obj.assign_to_roles.length) {
                            //             noticeBoardService.addNoticePost().post(obj, function (response) {
                            //                 if (response.code == 200) {
                            //                     toastr.success("Successfully created Notice post");
                            //                     $scope.item.Selected = false;
                            //                     $scope.selectedAll = false;
                            //                     $scope.postNoticeDetailPage();
                            //                     $scope.cancel();
                            //                     blockUI.stop();
                            //                 } else {
                            //                     toastr.warning("Server is busy please try after some time");
                            //                     blockUI.stop();
                            //                 }
                            //             });
                            //         }
                            //     });
                            // }
                        } else {
                            toastr.error('Please fill the form completely');
                        }
                        blockUI.stop();
                    };

                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
            // } else {
            //     toastr.warning('You do not have access permission');
            // }
        };
        $scope.deletePost = function (id, noticeBoardId) {
            swal({
                title: "Are you sure?",
                text: "You want to delete the post?",
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
                var obj = {};
                obj.id = id;
                blockUI.start();
                noticeBoardService.deletePost().get(obj, function (response) {
                    if (response.code == 200) {
                        toastr.success('Successfully deleted post');
                        if ($state.current.name == "noticePostDetail") {
                            $location.path('/notice_board_detail/' + noticeBoardId);
                        } else {
                            $scope.getNoticeBoardDetailPage();
                        }
                        blockUI.stop();
                    } else {
                        toastr.warning('Server is busy please try latter');
                        blockUI.stop();
                    }

                });
            });
        }
        $scope.isAll = true;
        $scope.isFavourites = false;
        $scope.selectedTab = function (selection) {
            if (selection == 'All') {
                $scope.isAll = true;
                $scope.isFavourites = false;
            }
            else {
                $scope.isAll = false;
                $scope.isFavourites = true;
                $scope.getFavoriteNoticeBoardList();
            }
        }
        $scope.isAllSelected = true;
        $scope.isActive = false;
        $scope.isArchive = false;
        $scope.selectPostTab = function (selection) {
            if (selection == 'All') {
                $scope.isAllSelected = true;
                $scope.isActive = false;
                $scope.isArchive = false;
            } else if (selection == 'Active') {
                $scope.isAllSelected = false;
                $scope.isActive = true;
                $scope.isArchive = false;
            } else {
                $scope.isAllSelected = false;
                $scope.isActive = false;
                $scope.isArchive = true;
            }
        }
        $scope.getFavoriteNoticeBoardList = function () {
            var userId = $localStorage.loggedInUserId;
            if (userId) {
                var postData = {
                    "user_id": $localStorage.loggedInUserId
                }
                noticeBoardService.getFavNoticeBoard().post(postData, function (response) {
                    if (response.code == 200) {
                        $scope.favNoticeBoardList = response.data;
                        blockUI.stop();
                    } else {
                        $scope.noticeList = [];
                        blockUI.stop();
                    }
                });
            }
        }
        $scope.propertyInspectionAddress = '';
        $scope.propertyInspectionDate = '';
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 650,
                editable: true,
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                eventTextColor: '#000000',
                eventRender: function (event, element, view) {

                },
                selectable: true,
                eventClick: function (calEvent, jsEvent, view) {
                    var dateStart = moment('2018-2-31');
                    var dateEnd = moment('2018-12-27');
                    var timeValues = [];
                    // swal({
                    //     title: 'Inspection',
                    //     text: 'Property : ' + calEvent.title + '\n' +
                    //     'Date :' +  moment(calEvent.start).format('DD-MM-YYYY') + '\n' +
                    //     'Owner :' + calEvent.name,
                    //     imageUrl: '/assets/images/logo_color_blue.png',
                    //     imageWidth: 10,
                    //     imageHeight: 10,
                    //     maxHeight: 45,
                    //     confirmButtonColor: '#09f'
                    // })
                    $scope.propertyInspectionDate = moment(calEvent.start).format('MMMM DD, YYYY');
                    $scope.propertyInspectionAddress = calEvent.title;
                },
                eventMouseover: false,
                eventLimit: 2, // for all non-agenda views
                views: {
                    agenda: {
                        eventLimit: 25 // adjust to 6 only for agendaWeek/agendaDay
                    }
                },
                dayClick: function (date, allDay, jsEvent, view) {
                    // blockUI.start();
                    // var dayNumber = moment(date).format('DDD');
                    // var yearNumber = moment(date).format('YYYY');
                    // var obj = {};
                    // obj.userId = $localStorage.loggedInUserId;
                    // obj.dayNumber = parseInt(dayNumber);
                    // obj.yearNumber = parseInt(yearNumber);
                    // AppointmentService.userConfirmedAppointmentDashboard().post(obj, function (response) {
                    //     $scope.imageUrl = baseUrl + '/uploads';
                    //     if (response.code == 200) {
                    //         blockUI.stop();
                    //         $scope.appointmentBuyerDashboard = response.data;
                    //     } else {
                    //         blockUI.stop();
                    //         $scope.appointmentBuyerDashboard = [];
                    //     }
                    // })
                }

            }
        };
        $scope.inspectionDate = [];
        $scope.getInspectionOnCalendar = function () {
            var loggedInId = $localStorage.loggedInUserId;
            var agencyId = '';
            if ($localStorage.userData.agency_id) {
                agencyId = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
            }
            var postData = {
                "request_by_id": loggedInId,
                "request_by_role": $localStorage.role_id,
                "agency_id": agencyId
            };
            noticeBoardService.getInspectionDate().post(postData, function (response) {
                if (response.code == 200) {
                    $scope.inspectionDate = response.data;
                    //console.log('result',response.data);
                    angular.forEach(response.data, function (element, key) {
                        if (element.inspection_date && element.inspection_date.length > 0) {
                            angular.forEach(element.inspection_date, function (inspectionData, key) {
                                $scope.inspection.push({
                                    title: element.property_id.address,
                                    start: moment(inspectionData).format('YYYY-MM-DD'),
                                    name: element.owner_id.firstname + ' ' + element.owner_id.lastname,
                                    color: '#FDC614'
                                });
                            });
                        }
                    });
                }
                $rootScope.eventSources2 = [$scope.inspection];
                // console.log('$scope.inspection', $scope.inspection);
            });
        }
        $scope.addToFav = function (noticeBoardId, favValue) {
            if (noticeBoardId) {
                var postData = {
                    "fav_by": $localStorage.loggedInUserId,
                    "noticeboard_id": noticeBoardId,
                    "fav_status": (favValue == 1) ? 2 : 1
                }
                noticeBoardService.addToFavourite().post(postData, function (response) {
                    if (response.code == 200) {
                        toastr.success(response.message);
                        $scope.noticeBoardList();
                    } else {
                        toastr.warning('Server is busy please try latter');
                    }
                });
            }
        }
        $scope.deleteNoticeBoardData = function (noticeBoardId, showId) {
            swal({
                title: "Are you sure?",
                text: "You want to delete the Notice board?",
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
                var obj = {};
                obj.id = noticeBoardId;
                blockUI.start();
                noticeBoardService.deleteNoticeBoard().get(obj, function (response) {
                    if (response.code == 200) {
                        toastr.success("Noticeboard " + showId + " deleted successfully");
                        $state.go("noticeBoardListing");
                        blockUI.stop();
                    } else {
                        toastr.warning('Server is busy please try latter');
                        blockUI.stop();
                    }

                });
            });
        };

        $scope.openEditNoticeBoardModal = function (id, role, pid) {
            // if ($localStorage.role_id == roleId.runStrataManagementCompany || $localStorage.role_id == roleId.workForStrataManagementCompany) {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/notice board/views/edit_notice_board.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope, $rootScope, $route) {
                    // $scope.roleIndex = [];
                    $scope.item = {};
                    $scope.notice = {};
                    $scope.item.Selected = "";
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $scope.item = {};
                        $scope.item.Selected = "";
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.noticeBoardInit = function () {
                        $scope.Items = noticeBoardRoles;
                        $scope.notice.property_id = pid;
                        //$scope.Items = role;
                        angular.forEach(role, function (value1, key1) {
                            angular.forEach($scope.Items, function (value2, key2) {
                                $scope.data[key2] = key2;
                                if (_.isEqual(value1._id, value2._id)) {
                                    $scope[modelScope.checkboxModel][key2] = true;
                                    $scope.onClickFn(key2);
                                }
                            });
                        });
                    };
                    $scope.agencyCount = 0;
                    $scope.agentCount = 0;
                    $scope.ownerCount = 0;
                    $scope.tenantCount = 0;
                    $scope.totalCount = 0;
                    $scope.getEditUsersCount = function (propertyData) {
                        var propertyIds = [];
                        angular.forEach(propertyData, function (value, key) {
                            propertyIds.push(value._id);
                        });
                        var postData = {
                            "property_arr": propertyIds
                        }
                        noticeBoardService.getUserCount().post(postData, function (response) {
                            if (response.code == 200) {
                                $scope.agencyCount = response.agencyCnt;
                                $scope.agentCount = response.agentCnt;
                                $scope.ownerCount = response.ownerCnt;
                                $scope.tenantCount = response.tenantCnt;
                                $scope.totalCount = ($scope.agencyCount + $scope.agentCount + $scope.ownerCount + $scope.tenantCount);
                            }
                        });
                    }
                    $scope.getEditUsersCountInit = function () {
                        var propertyIds = [];
                        $rootScope.editNoticeProperties
                        angular.forEach($rootScope.editNoticeProperties, function (value, key) {
                            propertyIds.push(value._id);
                        });
                        var postData = {
                            "property_arr": propertyIds
                        }
                        noticeBoardService.getUserCount().post(postData, function (response) {
                            if (response.code == 200) {
                                $scope.agencyCount = response.agencyCnt;
                                $scope.agentCount = response.agentCnt;
                                $scope.ownerCount = response.ownerCnt;
                                $scope.tenantCount = response.tenantCnt;
                                $scope.totalCount = ($scope.agencyCount + $scope.agentCount + $scope.ownerCount + $scope.tenantCount);
                            }
                        });
                    }();
                    $scope.getAgencyProperty = function () {
                        blockUI.start();
                        var obj = {};
                        obj.request_by_id = $localStorage.loggedInUserId;
                        obj.request_by_role = $localStorage.role_id;;
                        if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                            obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                        }
                        noticeBoardService.getPropertyList().get(function (response) {
                            if (response.code == 200) {
                                $scope.propertyList = response.data;
                                $rootScope.checkedListProperty = $scope.propertyList;
                                angular.forEach($rootScope.checkedListProperty, function (n) {
                                    angular.forEach($rootScope.editNoticeProperties, function (m) {
                                        if (n._id == m._id) {
                                            n.ticked = true;
                                        }
                                    });
                                });
                                if ($scope.propertyList.length == 0 && response.data.length == $scope.propertyList.length) {
                                    $state.go('noticeBoardListing');
                                    // console.log('No record found');
                                    $scope.cancel();
                                } else {
                                    // $scope.noticeRoles = [];
                                    $scope.Items = noticeBoardRoles;
                                }
                                blockUI.stop();
                            } else {
                                $state.go('noticeBoardListing');
                                toastr.warning("You are not associated with any property to create notice board");
                                blockUI.stop();
                                $scope.cancel();
                            }
                        });
                        blockUI.stop();
                    };
                    $scope.allOption = "All";
                    var modelScope = {
                        "checkboxModel": "checkboxModel",
                        "selectedItems": "selectedItems"
                    };
                    $scope.data = [0, 1, 2, 3];


                    $scope.checkboxModel = [];
                    $scope.selectedItems = [];

                    $scope.onClickFn = function (val) {
                        if (val == $scope.allOption)
                            resultsFnAll();
                        else
                            addorRemoveItems(val);
                    };
                    function addorRemoveItems(val) {
                        if ($scope[modelScope.checkboxModel][val]) {
                            $scope[modelScope.selectedItems].push(val);
                        } else if (!$scope[modelScope.checkboxModel][val]) {
                            $scope[modelScope.selectedItems].splice($scope[modelScope.selectedItems].indexOf(val), 1);
                        };

                        if ($scope[modelScope.selectedItems].length >= ($scope.data.length))
                            $scope[modelScope.checkboxModel][$scope.allOption] = true;
                        else
                            $scope[modelScope.checkboxModel][$scope.allOption] = false;
                    };
                    function resultsFnAll() {
                        var allVal = $scope[modelScope.checkboxModel][$scope.allOption];
                        if (allVal)
                            $scope[modelScope.selectedItems] = angular.copy($scope.data);
                        else
                            $scope[modelScope.selectedItems] = [];

                        for (property in $scope["data"]) {
                            $scope[modelScope.checkboxModel][$scope["data"][property]] = allVal;
                        };
                    };
                    $scope.saveNotice = function (notice) {
                        blockUI.start();
                        var propertyIds = [];
                        angular.forEach($scope.newEditNoticeProperties, function (value, key) {
                            propertyIds.push(value._id);
                        });
                        if ($scope.createNoticeForm.$invalid == false && ($scope.selectedItems.length || $scope.selectedAll == true)) {
                            if ($scope.checkboxModel[$scope.allOption] == false) {
                                var obj = {};
                                obj = notice;
                                obj.propertiesArr = propertyIds;
                                obj.created_by = $localStorage.loggedInUserId;
                                if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                    obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                                }
                                // obj.assign_to_roles = [];
                                angular.forEach($scope.selectedItems, function (value, key) {
                                    obj.assign_to_roles[key] = _.pick($scope.Items[value], '_id');
                                    if ($scope.selectedItems.length == obj.assign_to_roles.length) {
                                        noticeBoardService.editNoticeboard().post(obj, function (response) {
                                            if (response.code == 200) {
                                                toastr.success("Successfully created Notice board");
                                                $scope.noticeBoardList();
                                                $scope.getNoticeBoardDetailPage();
                                                $scope.cancel();
                                                blockUI.stop();
                                            } else {
                                                toastr.warning("Server is busy please try after some time");
                                                blockUI.stop();
                                            }
                                        });
                                    }
                                });
                            } else {
                                var obj = {};
                                obj = notice;
                                obj.created_by = $localStorage.loggedInUserId;
                                obj.propertiesArr = propertyIds;
                                if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
                                    obj.agency_id = ($localStorage.userData.agency_id._id) ? $localStorage.userData.agency_id._id : $localStorage.userData.agency_id;
                                }
                                obj.assign_to_roles = [];
                                angular.forEach($scope.Items, function (value, key) {
                                    obj.assign_to_roles[key] = _.pick($scope.Items[key], '_id');
                                    if ($scope.Items.length == obj.assign_to_roles.length) {
                                        //console.log("here is data",obj);
                                        noticeBoardService.editNoticeboard().post(obj, function (response) {
                                            if (response.code == 200) {
                                                toastr.success("Successfully created Notice board");
                                                $scope.item.Selected = false;
                                                $scope.selectedAll = false;
                                                $scope.getNoticeBoardDetailPage();
                                                $scope.noticeBoardList();
                                                $scope.cancel();
                                                blockUI.stop();
                                            } else {
                                                toastr.warning("Server is busy please try after some time");
                                                blockUI.stop();
                                            }
                                        });
                                    }
                                });
                            }
                        } else {
                            toastr.error('Please fill the form completely');
                        }
                        blockUI.stop();
                    };

                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
            // } else {
            //     toastr.warning('You do not have access permission');
            // }
        };
        /**
         * Chat functionality starts from here 
         */

        //To initialize the basic chat functionality
        $scope.privateMessage = [];
        $scope.chatInitialize = function () {
            if ($localStorage.loggedInUserId) {
                //add user to the group
                // console.log('$stateParams.id', $stateParams.id);
                socket.emit("addNoticeBoardUsers", {
                    id: $localStorage.loggedInUserId,
                    maintenanceId: $stateParams.id,
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
        socket.on('noticeBoardUserJoined', function (data) {
            //to check added users 
            // console.log('data', data);
            if (data.id == $localStorage.loggedInUserId) {
                toastr.info('You are online to the chat');
            } else {
                toastr.info(data.firstName + ' ' + data.lastName + ' have joined the chat');
            }
            socket.emit('noticeBoardGroupChatHistory', { maintenanceId: $stateParams.id, userId: $localStorage.loggedInUserId });
        });
        //group chat response come here 
        socket.on('noticeBoardUserLeaveChat', function (leaveData) {
            // console.log('leaveData', leaveData);
            if (leaveData.id != $localStorage.loggedInUserId) {
                toastr.info(leaveData.firstName + ' ' + leaveData.lastName + ' is offline now');
            }
        });
        //group chat Leave 
        socket.on('noticeBoardGroupChatResponse', function (data) {
            // console.log('data', data);
            var box = document.getElementById('conversation');
            box.scrollTop = box.scrollHeight;
            $scope.privateMessage = data;
        });
        //group chat messages recived here for notification purpose
        socket.on('noticeBoardGroupMessageRecieved', function (message) {
            // console.log('message', message);
            if (message.from != $localStorage.loggedInUserId) {
                toastr.info('user message', message.msg);
            }
            socket.emit('noticeBoardGroupChatHistory', { maintenanceId: $stateParams.id });
        });
        //get current data functionality 
        $scope.getDate = function () {
            var d = moment().format('YYYY-MM-DD h:mm:ss a');
            var n = moment().format("MMM Do") + ', ' + moment().format('LT');
            return n;
        }
        // get statistics data count 
        $scope.getStatisticsData = function () {
            noticeBoardService.getStatisticsData().post({}, function (response) {
                if (response.code == 200) {
                    $scope.statisticsData = response.data;
                } else {
                    toastr.warning('Something went wrong.');
                }
            })
        }
        //group messages sent from here 
        $scope.send_message = function (message) {
            //Listens for a new chat message
            var message = {
                from: $localStorage.loggedInUserId,
                to: $stateParams.id,
                textMsg: message,
                time: $scope.getDate(),
                maintenanceId: $stateParams.id
            }
            // $scope.chat.generalMsg = '';
            // console.log('message sent called', message);
            socket.emit('noticeBoardGroupMessageSent', message);
            //$scope.chat.generalMsg = '';
        }
        //group messages sent with counter proposal id 
        $scope.sentGeneralChatMessageWithCounterProposal = function (proposalData) {
            //Listens for a new chat message
            // console.log('message sent called', proposalData);
            var message = {
                from: $localStorage.loggedInUserId,
                to: $stateParams.id,
                textMsg: (proposalData.is_job_completed == true) ? 'Job completed' : 'Counter proposal',
                time: $scope.getDate(),
                maintenanceId: $stateParams.id,
                proposal_id: proposalData._id,
            }
            socket.emit('noticeBoardGroupMessageSent', message);
        }
        /**
         * file uploads
         * @param {*} file 
         */
        $scope.private_Message = '';
        $scope.uploadFile = function (file) {
            var postData = {
                from: $localStorage.loggedInUserId,
                to: $stateParams.id,
                textMsg: $scope.private_Message,
                time: $scope.getDate(),
                maintenanceId: $stateParams.id
            }
            // console.log('postData', postData);
            $scope.fileUpload(file, postData);
            // console.log('file', file);
        }
        /**
       * Function is use to upload on file either on select or drop
       * @access private
       * @return json
       * Created by 
       * @smartData Enterprises (I) Ltd
       * Created Date
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
                    socket.emit('noticeBoardGroupMessageSentWithFile', {
                        from: $localStorage.loggedInUserId,
                        to: $stateParams.id,
                        propertyId: $stateParams.id,
                        textMsg: 'File uploaded ' + response.data.data.document_name,
                        time: $scope.getDate(),
                        maintenanceId: $stateParams.id,
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
        };
        /**
         * Chat functionality ends here 
         */

    }
}());
