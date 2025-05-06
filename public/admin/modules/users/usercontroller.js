/**
 * Angular Controller
 * @author 
 * @created 20 Sept 2017
 */
(function () {
    angular.module('TSM_ADMIN')
        .directive('dropZone', function () {
            var config = {
                template:
                    '<label class="drop-zone">' +
                    '<input type="file" multiple accept=".csv" />' +
                    '<div ng-transclude></div>' +       // <= transcluded stuff
                    '</label>',
                // templateUrl: '/admin/modules/users/views/fileDragUpload.html',
                transclude: true,
                replace: true,
                require: '?ngModel',
                scope: { someCtrlFn: '&callbackFn' },
                link: function (scope, element, attributes, ngModel) {
                    var upload = element[0].querySelector('input');
                    upload.addEventListener('dragover', uploadDragOver, false);
                    upload.addEventListener('drop', uploadFileSelect, false);
                    upload.addEventListener('change', uploadFileSelect, false);
                    config.scope = scope;
                    config.model = ngModel;
                }
            }
            return config;


            // Helper functions
            function uploadDragOver(e) { e.stopPropagation(); e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }
            function uploadFileSelect(e) {
                console.log('e => ', e);
                console.log('e.loaded => ', e.loaded);
                console.log('e.total => ', e.total);
                console.log(this)
                e.stopPropagation();
                e.preventDefault();
                console.log('e :: upload => ', e);
                var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
                for (var i = 0, file; file = files[i]; ++i) {
                    console.log(file);

                    let extension = file.name.replace(/^.*\./, '');
                    console.log('extension => ', extension);

                    if (extension == 'csv') {
                        var reader = new FileReader();
                        reader.onload = (function (file) {
                            return function (e) {
                                console.log('e.target.result => ', e.target.result);
                                var data = {
                                    data: e.target.result,
                                    dataSize: e.target.result.length,
                                    fileType: 'valid'
                                };
                                for (var p in file) { data[p] = file[p] }
                                config.scope.$apply(function () {
                                    config.model.$viewValue.push(data)
                                });
                                config.scope.someCtrlFn(file);
                            }
                        })(file);
                        reader.readAsText(file);
                    } else {
                        console.log('Please select csv file. => ');
                        config.scope.$apply(function () {
                            config.model.$viewValue.push({ fileType: 'invalid' })
                            config.scope.someCtrlFn(file);
                        })
                    }
                }
            }
        })
        .controller("UserCtrl", UserCtrl);
    UserCtrl.$inject = [
        '$state',
        '$route',
        '$scope',
        '$localStorage',
        '$rootScope',
        '$http',
        '$filter',
        '$window',
        '$location',
        '$stateParams',
        'blockUI',
        'UserService',
        'toastr',
        'ngTableParams',
        'Upload',
        'PropertyService',
        '$uibModal',
        '$timeout',
    ];

    function UserCtrl($state, $route, $scope, $localStorage, $rootScope, $http, $filter, $window, $location, $stateParams, blockUI, UserService, toastr, ngTableParams, Upload, PropertyService, $uibModal, $timeout) {
        $scope.user = {};
        $scope.currentURL = window.location.hostname;
        $scope.user.gender = 1;
        $scope.greeting = '123456789';
        $rootScope.userManagementActive;
        $scope.roleId = roleId;
        $scope.isAgencyOwn = false;
        $scope.isTraderUser = false;
        $scope.searchByUserType = 'All';
        $scope.activeDashboard = function () {
            $rootScope.dashboardActive = " ";
            $rootScope.dashboardStatus = " ";
            $rootScope.userStatus = "active";
            $rootScope.traderUserStatus = "";
            $rootScope.agencyStatus = "";
            $rootScope.profileActive = " ";
            $rootScope.profileStatus = " ";
            $rootScope.proepertyStatus = " ";
            $rootScope.userManagementActive = "active";
            $rootScope.propertyManagementActive = " ";
            $rootScope.advertisingStatus = " ";
            $rootScope.maintenanceStatus = " ";
            $rootScope.setUserCounter = function () {
                $localStorage.userPagecount = 1
            }
        }();
        $scope.baseUrl_path = baseUrl;
        $scope.bulkAgentData = [];
        $scope.country = country;
        $scope.stateList = austriliaState;
        $scope.localPage = 1
        if ($localStorage.userPagecount > 0) {
            $scope.localPage = $localStorage.userPagecount
        }
        $scope.currentPage = $scope.localPage
        //tiny mce options configuration
        $scope.tinymceOptions = {
            resize: false,
            height: "450px",
            // plugins: [
            //     'advlist autolink lists link image charmap print preview anchor textcolor',
            //     'searchreplace visualblocks code fullscreen',
            //     'insertdatetime media table contextmenu paste code help',
            //     'noneditable'
            // ],
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent"

        };
        $scope.controllerInitialization = function () {
            console.log('user controller => ');
            tinymce.init({
                selector: 'textarea',
                br_in_pre: false,
                theme: 'modern',
                //plugins: 'print preview fullpage powerpaste searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount a11ychecker imagetools mediaembed  linkchecker contextmenu colorpicker textpattern help',
                toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
                image_advtab: true,
                height: "450px",
                templates: [
                    { title: 'Test template 1', content: 'Test 1' },
                    { title: 'Test template 2', content: 'Test 2' }
                ],
                content_css: [
                    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                    '//www.tinymce.com/css/codepen.min.css'
                ]
            });
        }();

        $scope.activeDashboard = function () {
            $rootScope.dashboardActive = " ";
            $rootScope.dashboardStatus = " ";
            $rootScope.userStatus = "active";
            $rootScope.traderUserStatus = "";
            $rootScope.profileActive = " ";
            $rootScope.profileStatus = " ";
            $rootScope.proepertyStatus = " ";
            $rootScope.userManagementActive = "aciveDashboard";
            $rootScope.propertyManagementActive = " ";
        }();
        /**
         * Function is used to get user file listing
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.userFileList = [];
        $scope.getUserFileListing = function () {
            var userId = $stateParams.id;
            $scope.imageUrl = baseUrl + '/document/';
            postData = {
                "created_by": userId
            };
            UserService.getFileListing().post(postData, function (response) {
                if (response.code == 200) {
                    $scope.userFileList = response.data;
                    angular.forEach($scope.userFileList, function (value, key) {
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
                } else {
                    $scope.userFileList = [];
                }
            });
        }

        $scope.paginationClick = function (newPageNumber, searchUser, searchByUserType) {
            $scope.currentPage = newPageNumber;
            $localStorage.userPagecount = newPageNumber
            $scope.getUserList(newPageNumber, searchUser, searchByUserType);
        }

        /**
         * Function is used for geting userList
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.getUserList = function (page = "1", key, userType) {
            $rootScope.userList = [];
            $scope.imageUrl = baseUrl + '/user_image/';
            postData = {
                "current_page": page.toString(),
                "number_of_pages": "10"
            };
            postData.searchKey = key;
            postData.searchtext = userType;
            UserService.UserList().post(postData, function (response) {
                if (response.code == 200) {
                    $rootScope.userList = response.data;
                    $rootScope.total_users = response.total_count;
                } else {
                    $rootScope.userList = [];
                }
            });
        }

        /**
        * Function is used for geting ReviewList
        * @access private
        * @return json
        * Created by : KEK 
        * @Narola
        * Created Date 1-2-2019
        */
        $scope.getUserReviewList = function () {
            $rootScope.reviewList = [];
            $scope.imageUrl = baseUrl + '/user_image/';
            UserService.getAllUSerReview($scope.current_user_id).get(function (response) {
                if (response.code == 200) {
                    $rootScope.reviewList = response.data;
                } else {
                    $rootScope.reviewList = [];
                }
            });
        }

        $scope.deleteReview = function (id) {
            var obj = {};
            obj.reviewId = id;
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this review information!",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    UserService.deleteReview(id).get(function (response) {
                        if (response.code == 200) {
                            toastr.success('Successfully deleted review');
                            $scope.getUserReviewList();
                            blockUI.stop();
                        } else {
                            toastr.warning('Server Busy please try again latter.');
                            blockUI.stop();
                        }
                        $scope.getUserList();
                    });
                }
            });
        }

        /**
        * Function is used for sorting user record
        * @access private
        * @return json
        * Created by 
        * @smartData Enterprises (I) Ltd
        * Created Date 21-Sep-2017
        */
        $scope.columnUser = 'name';
        $scope.reverseUser = false;
        $scope.sortRecentUserColumn = function (col) {
            $scope.columnUser = col;
            if ($scope.reverseUser) {
                $scope.reverseUser = false;
            } else {
                $scope.reverseUser = true;
            }
        };


        /**
         * Function is used to find user data
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.current_user_id = '';
        $scope.userDetailView = function () {
            console.log('$scope.currentURL => ', $scope.currentURL);
            $scope.imageUrl = baseUrl + '/user_image/';
            blockUI.start();
            var obj = {};
            obj.userId = $stateParams.id;
            console.log('$stateParams => ', $stateParams);
            $scope.current_user_id = $stateParams.id;
            UserService.userDetail().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.user = response.data;
                    console.log('response.data :: User ================> ', response.data);

                    console.log('roleId.ownAgency => ', roleId.ownAgency);
                    if ($scope.user[0].groups.role_id === roleId.ownAgency) {
                        $scope.isAgencyOwn = true;
                    }
                    console.log('$scope.isAgencyOwn => ', $scope.isAgencyOwn);
                    console.log('response.data ====================================> ', response.data);
                    if ($scope.user[0].groups.role_id === roleId.trader) {
                        $scope.isTraderUser = true;
                        if (!($scope.user[0].profileTiers)) {
                            console.log('no profileTiers for user => ');
                            $scope.user[0].profileTiers = "basic"
                        }
                    }
                    var number = $scope.user[0].mobile_no;
                    $scope.user[0].createdDate = moment($scope.user[0].createdDate).format('DD-MMM-YYYY');
                    console.log(" $scope.user[0].mobile_no", $scope.user[0].mobile_no);
                    console.log(" $scope.mobile_no2", $scope.mobile_no2);
                    $scope.user[0].code = "+65";
                    console.log("$scope.user[0]", $scope.user[0]);
                    if ($scope.user[0].gender == 1) {
                        $scope.user[0].gender = "Male"
                    } if ($scope.user[0].gender == 2) {
                        $scope.user[0].gender = "Female"
                    } if ($scope.user[0].gender == 3) {
                        $scope.user[0].gender = "Other"
                    }
                    $scope.getAgentsList();
                    blockUI.stop();
                    // $scope.user[0].mobile_no = $scope.user[0].mobile_no.slice(3, 13);
                    // console.log("user mobile", $scope.user[0].mobile_no.length);
                } else {
                    $state.go("noUserFound");
                }
            })
        }
        $scope.textAreaSection = function (p) {
            tinymce.init({
                init_instance_callback: subTextAreaSection(p)
            });
        }

        /**
         * Update Trader User Property
         */
        $scope.updateUserProperty = function (userData) {
            console.log('userData :: on click function => ', userData);
            const reqObj = {
                user_id: userData._id,
                profileTiers: userData.profileTiers,
                updated_by_role: $localStorage.adminData._id
            }
            console.log('reqObj => ', reqObj);
            UserService.updateUserProperty().post(reqObj, function (response) {
                console.log('response :: updateUserProperty ======> ', response);
                if (response.code == 200) {
                    toastr.success(response.message);
                    $window.history.back();
                } else {
                    toastr.warning('Something went wrong!!! Please try after some time');
                }
            });
        }

        function subTextAreaSection(p) {
            var name;
            if (typeof (p) != 'undefined') {
                name = p.substring(0, 1).toUpperCase() + p.substring(1);
            }
            else {
                name = ' ';
            }
            $scope.emailTemplate = '<table style="width: 100%;font-family: Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif;">' +
                '<tr>' +
                '<td></td>' +
                '<td bgcolor="#FFFFFF ">' +
                '<div style="padding: 15px; max-width: 600px;margin: 0 auto;display: block; border-radius: 0px;padding: 0px;box-shadow: 0 5px 10px rgba(0,0,0,0.3);">' +
                '<table class="mceNonEditable" style="width: 100%;background: #0099ff ;">' +
                '<tr>' +
                '<td></td>' +
                '<td>' +
                '<div>' +
                ' <table width="100%">' +
                '<tr>' +
                '<td rowspan="2" style="text-align:center;padding:10px;">' +
                '<img class="pull-left" src="http://52.34.207.5:5094/assets/images/logo-public-home.png" >' +
                // '<img class="pull-left" src="http://52.34.207.5:5094/assets/images/logo.png" >' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</td>' +
                '<td></td>' +
                '</tr>' +
                '</table>' +
                '<table style="padding:10px;font-size:14px; width:100%;">' +
                '<tr>' +
                '<td style="padding:10px;font-size:14px; width:100%;">' +
                '<p>' +
                '<strong> Hi ' + name + ' ,' + '</strong></p>' +
                ' <p>' + 'Type your message here' + '</p> ' +
                '<br/>' +
                '<p><br />Cheers,</p>' +
                '<p>Team Ownly</p>' +
                '</td>' +
                '</tr>' +
                ' </table>' +
                '<table style="width: 100%;background: #333; color: #fff;">' +
                '<tr>' +
                '<td>' +
                ' <div align="center" style="font-size:12px;margin: 10px 0px; padding:5px; width:100%;">© 2020 <a href="#" style="text-decoration:none;color:#fff;">Ownly</a>' +
                '</div>' +
                '</td> ' +
                '</tr>' +
                '</table>'
            setTimeout(function () { tinymce.get('my_editor1').setContent($scope.emailTemplate); }, 100);
        }
        $scope.back = function () {
            $window.history.back();
        }
        /**
         * Function is used to get user data
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 14-Oct-2017
         */
        $scope.userDetailViewForMail = function () {
            var obj = {};
            obj.userId = $stateParams.id;
            UserService.userDetail().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.user = response.data;
                    blockUI.stop();
                    $scope.textAreaSection($scope.user[0].firstname);
                } else {
                    $state.go("noUserFound");
                }
            })
        }
        /**
       * Function is used to send email to user
       * @access private
       * @return json
       * Created by 
       * @smartData Enterprises (I) Ltd
       * Created Date 14-Oct-2017
       */
        $scope.sendEmailToUser = function (id, email) {
            var obj = {};
            obj.email = email;
            obj.emailTemplate = tinymce.activeEditor.getContent();;
            obj.to = id;
            PropertyService.mailToSeller().post(obj, function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    toastr.success('Email sent successfully');
                } else {
                    blockUI.stop();
                    toastr.warning('Server is busy!!! Please try after some time');
                }
            });

        }
        /**
         * Function is used to find user data
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.userDetailViewForEdit = function () {
            $scope.imageUrl = baseUrl + '/user_image/';
            blockUI.start();
            var obj = {};
            obj.userId = $stateParams.id;
            UserService.userDetail().post(obj, function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    $scope.user = response.data;
                } else {
                    $state.go("noUserFound");
                }
            })
        }

        /**
         * Function is used to edit user data
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.editUserInfo = function (updateData) {
            console.log(updateData, "updateData");
            $scope.imageUrl = baseUrl + '/user_image/';
            blockUI.start();
            var obj = {};
            obj.userId = $stateParams.id;
            updateData[0].gender = parseInt(updateData[0].gender);
            var userData = {
                "userId": $stateParams.id,
                "firstname": updateData[0].firstname,
                "lastname": updateData[0].lastname,
                "dob": updateData[0].dob,
                "gender": updateData[0].gender,
                "marital_status": updateData[0].firmarital_statusstname,
                "email": (updateData[0].email).toLowerCase(),
                "mobile_no": "+65" + updateData[0].mobile_no,
                "address": updateData[0].address,
                "city": updateData[0].city,
                "state": updateData[0].state,
                "zipcode": updateData[0].zipcode,
                "country": updateData[0].country
            }

            UserService.editUserByAdmin().post(userData, function (response) {
                if (response.code == 200) {
                    toastr.success('Successfully updated user information  ');
                    blockUI.stop();
                    $state.go('userManagement');
                } else if (response.code == 404 && response.message == "first delete this user then you can create") {
                    toastr.warning('First delete this user then you can create new with this email id');
                    blockUI.stop();
                    $state.go('userManagement');
                } else {
                    if (response.message == "already exist user") {
                        blockUI.stop();
                        toastr.warning('Email is already associated with some other profile');
                    } else {
                        toastr.warning('Server Busy please try again latter.');
                        blockUI.stop();
                    }
                }

            });
        }
        $scope.cancelUserUpdate = function () {
            toastr.success('Cancelled user information updation');
            $state.go('userManagement');
        }
        /**
         * Function is used to delete user data
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.deleteUser = function (id) {
            var obj = {};
            obj.userId = id;
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this user information!",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    UserService.deleteUser().post(obj, function (response) {
                        if (response.code == 200) {
                            toastr.success('Successfully deleted user ');
                            blockUI.stop();
                        } else {
                            toastr.warning('Server Busy please try again latter.');
                            blockUI.stop();
                        }
                        $scope.getUserList();
                    });
                }
            });
        }
        String.prototype.isNumber = function () {
            return /^\d+$/.test(this);
        }
        /**
         * Function is used to add user data
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.files = [];
        $scope.userRegistration = function (user, confirmPassword, mob) {
            $scope.imageUrl = baseUrl + '/user_image/';
            user.gender = parseInt(user.gender);
            if (mob.isNumber()) {
                user.mobile_no = mob;
            }
            if (mob.isNumber() == false) {
                var a = mob.split("_");
                user.mobile_no = a[0];
            }
            console.log("user", user);
            if (user.password != confirmPassword) {
                toastr.error("Confirm Password & Password are not same");
            } if (user.password === confirmPassword) {
                user.gender = parseInt(user.gender);
                user.email = (user.email).toLowerCase();
                user.firstname = (user.firstname).toLowerCase();
                user.lastname = (user.lastname).toLowerCase();
                if ($scope.files.length != 0) {
                    blockUI.start();
                    UserService.addUser().post(user, function (response) {
                        if (response.code == 200 && response.message != "Email already exist.") {
                            var file = $scope.files[0];
                            if (!file.$error) {
                                Upload.upload({
                                    url: baseUrl + '/api/updateUserPic',
                                    data: {
                                        _id: response.data.userId,
                                        file: file,
                                    }
                                }).then(function (response) {
                                    if (response.status == 200) {
                                        toastr.success('Successfully changed profile image ');
                                        $scope.getUserList();
                                    } else {
                                        toastr.error($scope.errorMsg = response.message + ': missing field ' + response.paramName);
                                    }
                                }, null, function (evt) {
                                    $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                                });
                            }

                            $state.go('userManagement');
                            blockUI.stop();
                        } if (response.code == 200 && response.message == "Email already exist.") {
                            toastr.warning('Email is already associated with some other profile');
                            blockUI.stop();
                        } if (response.code != 200) {
                            toastr.warning('Server Busy please try again latter.');
                            blockUI.stop();
                        }
                        blockUI.stop();
                    });
                }
                if ($scope.files.length == 0) {
                    console.log("no files");
                    blockUI.start();
                    UserService.addUser().post(user, function (response) {
                        if (response.code == 200 && response.message != "Email already exist.") {
                            toastr.success('Successfully added user ');
                            $state.go('userManagement');
                            blockUI.stop();
                        } if (response.code == 200 && response.message == "Email already exist.") {
                            toastr.warning('Email is already associated with some other profile');
                            blockUI.stop();
                        } if (response.code != 200) {
                            toastr.warning('Server Busy please try again latter.');
                            blockUI.stop();
                        }
                        blockUI.stop();
                    });
                }

            }
        }
        /**
         * Function is used to cancel user addition
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 22-Sep-2017
         */
        $scope.cancelUserRegistration = function () {
            toastr.info('Cancelled user creation');
            $state.go('userManagement');
        };
        // remove and change class
        $scope.sortClass = function (col) {
            if ($scope.columnUser == col) {
                if ($scope.reverseUser) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        }
        $scope.dataKey = true;
        $scope.searchUserAdmin = function (key, userType) {
            var obj = {};
            obj.searchKey = key;
            obj.searchtext = userType;
            UserService.searchUser().post(obj, function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    $rootScope.userList = response.data;
                } else if (response.code != 200) {
                    blockUI.stop();
                    $rootScope.userList = [];
                }
                if ($rootScope.userList.length == 0) {
                    $scope.dataKey = false;
                }
            })

        }
        $scope.upload = function (files) {
            $scope.files = files;
        };

        /**
       * Function is to handle CSV upload dialogue
       */
        $scope.openCSVDilogue = function () {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/admin/modules/users/views/AgentCSVUploadModal.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        console.log('close popup ====================> ');
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.data = { upload: [] }  // <= upload data get pushed here 

                    $scope.fileUploadCtrlFn = function (fileUploadData) {
                        // console.log('fileUploadData => ', fileUploadData);
                        let fileData = fileUploadData.splice(-1);
                        console.log('CSV File Data =========>', fileData);
                        if (fileData && fileData.length > 0) {
                            if (fileData[0].fileType === 'valid') {
                                csvHeader = [
                                    "suburb", "state", "post_code", "phone_number", "email", "logo", "first_name", "last_name"
                                ];
                                let csvString = fileData[0].data;
                                let csvDataArray = [];
                                var lines = csvString.split('\n');
                                // Get header of CSV data
                                var headerValues = lines[0].split(',');
                                let dataArray = [];
                                let csvHeaderArray = [];
                                headerValues.forEach(ele => {
                                    csvHeaderArray.push(ele.trim());
                                });
                                headerValues = csvHeaderArray;
                                // Check for valid headers - compare csv headers
                                let isValidHeader = $scope.isEqual(csvHeader, headerValues);
                                // console.log('$scope.isEqual => ', isValidHeader);
                                if (!isValidHeader) {
                                    toastr.warning('Please check csv Headers.');
                                } else {
                                    var dataValues = lines.splice(1).map(function (dataLine) { return dataLine.split(','); });
                                    dataValues.map(function (rowValues) {
                                        var row = {};
                                        headerValues.forEach(function (headerValue, index) {
                                            row[headerValue] = (index < rowValues.length) ? rowValues[index] : null;
                                        });
                                        dataArray.push(row);
                                    });
                                    console.log('csvDataArray :: check here => ', csvDataArray);
                                    csvDataArray = $scope.getUnique(dataArray, 'email');
                                    console.log('csvDataArray:: Unique records only===========> ', csvDataArray);

                                    if (csvDataArray && csvDataArray.length > 0) {
                                        csvDataArray.forEach(function (ele) {
                                            if (ele.state) {
                                                if ((ele.state).toLowerCase() == ('New South Wales').toLowerCase() || (ele.state).toLowerCase() == ('NSW').toLowerCase()) {
                                                    ele.state = 'New South Wales';
                                                }
                                                if ((ele.state).toLowerCase() == ('Australian Capital Territory').toLowerCase() || (ele.state).toLowerCase() == ('ACT').toLowerCase()) {
                                                    ele.state = 'Australian Capital Territory';
                                                }
                                                if ((ele.state).toLowerCase() == ('Victoria').toLowerCase() || (ele.state).toLowerCase() == ('VIC').toLowerCase()) {
                                                    ele.state = 'Victoria';
                                                }
                                                if ((ele.state).toLowerCase() == ('Queensland').toLowerCase() || (ele.state).toLowerCase() == ('QLD').toLowerCase()) {
                                                    ele.state = 'Queensland';
                                                }
                                                if ((ele.state).toLowerCase() == ('South Australia').toLowerCase() || (ele.state).toLowerCase() == ('SA').toLowerCase()) {
                                                    ele.state = 'South Australia';
                                                }
                                                if ((ele.state).toLowerCase() == ('Western Australia').toLowerCase() || (ele.state).toLowerCase() == ('WA').toLowerCase()) {
                                                    ele.state = 'Western Australia';
                                                }
                                                if ((ele.state).toLowerCase() == ('Tasmania').toLowerCase() || (ele.state).toLowerCase() == ('TAS').toLowerCase()) {
                                                    ele.state = 'Tasmania';
                                                }
                                                if ((ele.state).toLowerCase() == ('Northern Territory').toLowerCase() || (ele.state).toLowerCase() == ('NT').toLowerCase()) {
                                                    ele.state = 'Northern Territory';
                                                }
                                            }
                                        });
                                        console.log('csvDataArray :: Final Array ========> ', csvDataArray);
                                        $scope.CSVRecordDilogue(csvDataArray);
                                        $scope.cancel();
                                    } else {
                                        toastr.error('Something went wrong! Please try again!');
                                        $scope.cancel();
                                    }
                                }
                            } else {
                                toastr.warning('Please select valid csv file.');
                            }
                        } else {
                            toastr.error('Something went wrong! Please try again!');
                            $scope.cancel();
                        }
                    }

                }
            });
            modalInstance.result.then(function (selectedItem) {
            }, function () { });

        };

        /**
         * To remove duplicate records
         */
        $scope.getUnique = function (arr, comp) {
            // store the comparison  values in array
            const unique = arr.map(e => e[comp])
                // store the indexes of the unique objects
                .map((e, i, final) => final.indexOf(e) === i && i)
                // eliminate the false indexes & return unique objects
                .filter((e) => arr[e]).map(e => arr[e]);
            console.log('unique => ', unique);
            return unique;
        }

        /**
         * To compare csv headers
         */
        $scope.isEqual = function (arr1, arr2) {
            // if length is not equal 
            // console.log('arr1,arr2 => ', arr1, arr2);
            if (arr1.length != arr2.length) {
                return false;
            } else {
                // comapring each element of array 
                for (var i = 0; i < arr1.length; i++) {
                    // console.log('i => ', i);
                    // console.log('arr1[i] => ', arr1[i]);
                    // console.log('arr2[i] => ', arr2[i]);
                    isValid = true;
                    if ((arr1[i]).trim() != (arr2[i]).trim()) {
                        // console.log('false => ');
                        isValid = false;
                        return isValid;
                    }
                }
                return isValid;
            }
        }

        /**
         * Function is to handle CSV Record dialogue
         */
        $scope.CSVRecordDilogue = function (agentData) {
            console.log('open new popup =======================> ');
            // console.log('agentData :: CSV imported data => ', agentData);
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/admin/modules/users/views/AgentCSVRecordModal.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    let newAgentsList = []
                    agentData.forEach(item => {
                        if (item.first_name && item.last_name && item.email) {
                            newAgentsList.push(item)
                        }
                    })

                    $scope.bulkAgentData = newAgentsList;
                    console.log('$stateParams.id => ', $stateParams.id);
                    console.log('$user => ', $scope.user);
                    console.log('$scope.bulkAgentData :: Final Array => ', $scope.bulkAgentData);

                    // $scope.bulkAgentData.forEach(ele => {
                    //     console.log('ele => ', ele);
                    //     ele.agency_id = $scope.user[0].agency_id;
                    // });

                    $scope.bulkImportAgents = async function (formData) {
                        console.log('formData => ', formData);
                        // Check again for unique records only
                        let data = $scope.getUnique(formData, 'email');
                        console.log('data => ', data);
                        let postData = [];

                        data.map(agent => {
                            console.log('agent => ', agent);
                            console.log(' agent :: stringify => ', JSON.stringify(agent));
                            if (agent) {
                                postData.push(JSON.stringify(agent));
                            }
                            // console.log('postData => ', postData);
                        });

                        if (postData && $scope.user[0].agency_id && $localStorage.adminData._id) {
                            UserService.bulkImportAgent().post({
                                agent_arr: postData,
                                agency_id: $scope.user[0].agency_id,
                                created_by: $localStorage.adminData._id
                            }, function (response) {
                                console.log('response => ', response);
                                if (response.code == 200) {
                                    $scope.cancel();
                                    toastr.success(response['message']);
                                    $scope.getAgentsList();
                                } else if (response.code == 400) {
                                    $scope.cancel();
                                    toastr.error(response['message']);
                                }
                            }, err => {
                                console.log('err => ', err);
                                $scope.cancel();
                            })
                        } else {
                            toastr.warning('Something went wrong! Please try again!');
                        }
                        $scope.cancel();
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
            }, function () { });

        };

        /**
         * Function is used to get Agent list associated with current agency
         */
        $scope.getAgentsList = function () {
            $rootScope.agentList = [];
            UserService.getMyAgents().post({ agency_id: $scope.user[0].agency_id }, function (response) {
                console.log('response => ', response);
                if (response.code == 200) {
                    $rootScope.agentList = response.data;
                    console.log('$scope.agentList => ', $scope.agentList);
                    // toastr.success(response['message']);
                } else {
                    $rootScope.agentList = [];
                }
            }, err => {
                console.log('err => ', err);
                // toastr.error('Something went wrong! Please try again!');
            });
        }
    }
}());