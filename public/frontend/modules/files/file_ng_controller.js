/**
 * Super Angular Controller
 * @author 
 * @created 10 August
 */
(function () {
    angular.module('SYNC')
        .controller("MyFilesCtrl", MyFilesCtrl);
    MyFilesCtrl.$inject = [
        '$state',
        '$scope',
        '$localStorage',
        '$rootScope',
        '$uibModal',
        '$timeout',
        'Upload',
        '$filter',
        '$window',
        '$location',
        '$stateParams',
        'permissions',
        'APP_CONST',
        'Flash',
        'toastr',
        'blockUI',
        'fileService',
        'FileUploader',
        'SweetAlert'
    ];

    function MyFilesCtrl($state, $scope, $localStorage, $rootScope, $uibModal, $timeout, Upload, $filter, $window, $location, $stateParams, permissions, APP_CONST, Flash, toastr, blockUI, fileService, FileUploader, SweetAlert) {
        /*
        please write your function here
        */
        $scope.listView = true;
        $scope.grideView = false;
        $scope.imageUrl = baseUrl + '/document/';
        $scope.filePopup = [false];
        $scope.pagination = {
            current: 1
        };
        $scope.userImageUrl = baseUrl + '/user_image/';
        $scope.isSearchedFile = false;
        $scope.sortText = '';
        $scope.noticeProperties = [];
        $scope.filterBy = function (sortBy) {
            $scope.sortText = sortBy;
        }
        $scope.addToFav = function (documentId, status, selected) {
            if (documentId) {
                var userId = $localStorage.loggedInUserId;
                var obj = {
                    "created_by": userId,
                    "_id": documentId,
                    "is_favorite": !status
                };
                fileService.addToFav().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.documentList = [];
                        if (selected == 1) {
                            $scope.getDocumentList();
                        } else {
                            $scope.getFavDocumentList();
                        }
                        var msg = (!status == true ? "Successfully added document to your favorite list" : "Successfully removed document from your favorite list");
                        toastr.success(msg);
                        blockUI.stop();
                    } else {
                        toastr.error(response.message);
                        blockUI.stop();
                    }
                });
            }
        }
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
         * Function is use to show document list 
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.documentList = [];
        $scope.getDocumentList = function () {
            blockUI.start();
            $scope.selected = 1;
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            var userId = $localStorage.loggedInUserId;
            if (userId) {
                var obj = {
                    "created_by": userId
                };
                fileService.getDocumentList().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.documentList = response.data;
                        $scope.isSearchedFile = false;
                        // console.log('$scope.documentList',$scope.documentList);
                        angular.forEach($scope.documentList, function (value, key) {
                            if ((value.document_path).includes(".xlsx") || (value.document_path).includes(".xlsx")) {
                                value.document_type = "excel";
                            }
                            // else if((value.path).includes(".jpeg")||(value.path).includes(".jpg")||(value.path).includes(".png")||(value.path).includes(".gif")){
                            //     value.document_type = "pic";
                            // }
                            else if ((value.document_path).includes(".txt") || (value.document_path).includes(".doc")) {
                                value.document_type = "doc";
                            } else if ((value.document_path).includes(".pdf")) {
                                value.document_type = "pdf";
                            } else if ((value.document_path).includes(".ppt")) {
                                value.document_type = "ppt";
                            }
                        });

                        blockUI.stop();
                    } else {
                        $scope.documentList = [];
                        blockUI.stop();
                    }
                });
            }
        }
        /**
         * Function is use to show fav document list 
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.documentList = [];
        $scope.getFavDocumentList = function () {
            var userId = $localStorage.loggedInUserId;
            if (userId) {
                var obj = {
                    "created_by": userId
                };
                fileService.getFavDocumentList().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.documentList = response.data;
                        $scope.isSearchedFile = false;
                        // console.log('$scope.documentList',$scope.documentList);
                        blockUI.stop();
                    } else {
                        $scope.documentList = [];
                        blockUI.stop();
                    }
                });
            }
        }
        /**
         * FunctiodocumentIdn is use to show property list view
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
         * function is created to initialize function and variable when page load
         * created on 20-Dec-2017
         * 
         */
        $scope.filesInitialize = function () {
            $scope.getDocumentList();
        }
        /**
         * function is to show and hide file option
         * created on 22-Dec-2017
         * 
         */
        $scope.showFilePopup = function (key) {
            $scope.filePopup[key] = ($scope.filePopup[key] == false) ? true : false;
        }
        /**
         * function is used to delete the document 
         * created on 22-Dec-2017
         * 
         */
        $scope.deleteDocument = function (documentId, index, selected) {
            //console.log('index',index)
            $scope.filePopup[index] = ($scope.filePopup[index] == false) ? true : false;
            if (documentId) {
                var userId = $localStorage.loggedInUserId;
                var obj = {
                    "created_by": userId,
                    "_id": documentId
                };
                swal({
                    title: "Are you sure?",
                    text: "You want to Delete the file?",
                    // imageUrl: '/assets/images/logo1.png',
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
                    fileService.deleteDocument().post(obj, function (response) {
                        if (response.code == 200) {
                            $scope.documentList = [];
                            //$scope.filePopup=[false];
                            if (selected == 1) {
                                $scope.getDocumentList();
                            } else {
                                $scope.getFavDocumentList();
                            }
                            toastr.success(response.message);
                            blockUI.stop();
                        } else {
                            toastr.error(response.message);
                            blockUI.stop();
                        }
                    });
                });
            }
        }
        /**
         * Function is used to view image from property detail page
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 
         */
        $scope.openImages = function (document) {
            var modalInstance;
            $scope.path = document.document_path;
            $scope.document = document;
            modalInstance = $uibModal.open({
                templateUrl: '/frontend/modules/files/views/file_details.html',
                // <div><img class="" src="' + $scope.imageUrl + path + '" style="width:100%;hight:100%;"></div>
                controller: "MyFilesCtrl",
                scope: $scope

            });
            $scope.cancel = function () {
                modalInstance.dismiss('cancel');
            };
        }
        /**
         * Function is used to show tag users list
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 
         */
        $scope.is_clicked = [];
        $scope.showTags = function (key) {
            $scope.getUsersList();
            $scope.is_clicked[key] = true;
        }
        $scope.userList = [];
        $scope.getUsersList = function () {
            postData = {
                "user_id": $localStorage.loggedInUserId
            };
            fileService.getUsersList().post(postData, function (response) {
                if (response.code == 200) {
                    $scope.userList = response.data;
                }
            });
        }
        // $scope.addTag=function(userIds,documentId,key){
        //     console.log("userIds",userIds,"documentId",documentId,"key",key);
        //     var idsLength=userIds.length;
        //     for(var i=0;i<userIds.length;i++){
        //         var postData={
        //             "document_id": documentId,
        //             "is_tagged_by_id": $localStorage.loggedInUserId,
        //             "is_tagged_to_id": userIds,
        //             "created_by": userIds[i]
        //         }
        //         fileService.addUserToTag().post(postData, function (response) {
        //             if (response.code == 200) {
        //                 $scope.is_clicked[key]=false;
        //                 if(i==idsLength){
        //                     toastr.success(response.message);
        //                 }
        //             } 
        //         });
        //     }
        // }
        /**
         * Function is used to open refine search panel
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 11-Dec-2017
         */
        $scope.openRefineSearch = function () {
            $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
            // console.log('called',$scope.advanceSearchClass);
        }
        /**
         * Function is use to open modal for add owner
         * @access private
         * @return json
         * Created 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Nov-2017
         */
        $scope.openDilogue = function () {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/files/views/upload_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope, fileService) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    /**
                     * multiple file upload
                     * **/
                    var uploader = $scope.uploader = new FileUploader({
                        url: baseUrl + '/api/uploadDocumentsFiles',
                        headers: { authorization: $localStorage.token },
                        formData: [{ 'created_by': $localStorage.loggedInUserId }]
                    });

                    // FILTERS
                    // an async filter
                    // uploader.filters.push({
                    //     name: 'asyncFilter',
                    //     fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                    //         console.log('asyncFilter');
                    //         setTimeout(deferred.resolve, 1e3);
                    //     }
                    // });
                    // CALLBACKS

                    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                    };
                    uploader.onAfterAddingFile = function (fileItem) {
                    };
                    uploader.onAfterAddingAll = function (addedFileItems) {
                        $scope.uploader.uploadAll()
                    };
                    uploader.onBeforeUploadItem = function (item) {
                    };
                    uploader.onProgressItem = function (fileItem, progress) {
                    };
                    uploader.onProgressAll = function (progress) {
                    };
                    uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    };
                    uploader.onErrorItem = function (fileItem, response, status, headers) {
                        toastr.error("Some error occured please try again latter");
                    };
                    uploader.onCancelItem = function (fileItem, response, status, headers) {
                        toastr.success("Successfully cancelled this file from uploading");
                    };
                    uploader.onCompleteItem = function (fileItem, response, status, headers) {
                    };
                    uploader.onCompleteAll = function () {
                        toastr.success("Successfully uploaded all files");
                        $scope.getDocumentList();
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
        };

        $scope.openAddTag = function (documentId, key) {
            $scope.showTags(key);
            // console.log("hello", documentId, key);
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/frontend/modules/files/views/add_tag.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope, fileService) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.addTag = function (userIds) {
                        var idsLength = userIds.length;
                        $scope.userIdArr = [];
                        angular.forEach(userIds, function (value, key) {
                            $scope.userIdArr[key] = value._id
                        });
                        if ($scope.userIdArr.length == userIds.length) {
                            var i;
                            for (i = 0; i < $scope.userIdArr.length; i++) {
                                var postData = {
                                    "document_id": documentId,
                                    "is_tagged_by_id": $localStorage.loggedInUserId,
                                    "is_tagged_to_id": $scope.userIdArr,
                                    "created_by": $scope.userIdArr[i]
                                }
                                fileService.addUserToTag().post(postData, function (response) {
                                    if (response.code == 200) {
                                        $scope.is_clicked[key] = false;
                                        if (i == idsLength) {
                                            toastr.success(response.message);
                                            $scope.ok();
                                        }
                                    }
                                });
                            }

                        }

                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () { });
        };

















        /**
* Function is for  req calender
* @access private
* @return json
* Created 
* @smartData Enterprises (I) Ltd
* Created Date 
*/

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(),
            // minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function () {
            $scope.inlineOptions.maxDate = $scope.inlineOptions.maxDate ? null : new Date();
            $scope.dateOptions.maxDate = $scope.inlineOptions.maxDate;
        };

        $scope.toggleMin();

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };
        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
        }
        //calender code ends here

        //To open the searching popup
        $scope.showPopup = function () {
            angular.element('#FileSearchPopUp').show();
        }
        //To close the searching popup
        $scope.hideSearchFilter = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            angular.element('#FileSearchPopUp').hide();
        }
        //To for the searching of file
        $scope.fileSearching = function (data) {
            if (data) {
                var obj = {};
                obj = data;
                obj.created_by = $localStorage.loggedInUserId;
                fileService.fileSearch().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.documentList = response.data;
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                        // $scope.fileSearch = {};
                        $scope.isSearchedFile = true;
                        angular.element('#FileSearchPopUp').hide();
                        blockUI.stop();
                    } else {
                        $scope.documentList = [];
                        blockUI.stop();
                    }
                });
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
            $scope.fileSearch = {};
            $scope.getDocumentList();
            $scope.advanceSearchClass = ($scope.advanceSearchClass == "dropdown default-oder droplist") ? "dropdown default-oder droplist open" : "dropdown default-oder droplist";
        }


    }
}());