/**
 * Angular Controller
 * @author Minakshi K
 * @created 20 Sept 2017
 */
(function () {
    angular.module('TSM_ADMIN')
        .controller("AgencyCtrl", AgencyCtrl);
    AgencyCtrl.$inject = [
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
        'AgencyService',
        'toastr',
        'ngTableParams',
        'Upload',
        'PropertyService',
        '$uibModal',
    ];

    function AgencyCtrl($state, $route, $scope, $localStorage, $rootScope, $http, $filter, $window, $location, $stateParams, blockUI, AgencyService, toastr, ngTableParams, Upload, PropertyService, $uibModal) {
        $scope.user = {};
        $scope.user.gender = 1;
        $scope.greeting = '123456789';
        $rootScope.userManagementActive;
        $scope.roleId = roleId;
        $scope.addUserData = {};
        $scope.addUserData.role = "5a1d113016bed22901ce050b";
        $scope.baseUrl_path = baseUrl;
        $scope.options = {
            // types: ['(cities)'],
            componentRestrictions: { country: 'AU' }
        };
        $scope.activeDashboard = function () {
            $rootScope.dashboardActive = " ";
            $rootScope.dashboardStatus = " ";
            $rootScope.userStatus = "";
            $rootScope.traderUserStatus = "";
            $rootScope.agencyStatus = "active";
            $rootScope.profileActive = " ";
            $rootScope.profileStatus = " ";
            $rootScope.proepertyStatus = " ";
            $rootScope.userManagementActive = "";
            $rootScope.propertyManagementActive = " ";
            $rootScope.advertisingStatus = " ";
            $rootScope.maintenanceStatus = " ";
        }();

        /**
     * Function used to get data as per page number
     * Pagination on click function
     */
        $scope.paginationClick = function (current_page, searchtext) {
            postData = {};
            if (searchtext) {
                postData.searchtext = searchtext;
            }
            postData.current_page = current_page ? current_page : 1;
            postData.number_of_pages = 10;
            AgencyService.AgencyList().post(postData, function (response) {
                if (response.code == 200) {
                    $rootScope.agencyList = response.data;
                }
                else {
                    $rootScope.agencyList = [];
                }
            });
        }

        /**
         * Function is used for geting agencyList
         * @access private
         * @return json
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.getAgencyList = function (current_page, searchKey) {
            console.log('current_page :: list function => ', current_page);
            $rootScope.agencyList = [];
            $scope.imageUrl = baseUrl + '/user_image/';
            postData = {};
            if (searchKey) {
                postData.searchtext = searchKey;
            }
            postData.current_page = current_page ? current_page : 1;
            postData.number_of_pages = 10;
            AgencyService.AgencyList().post(postData, function (response) {
                if (response.code == 200) {
                    $rootScope.agencyList = response.data;
                    $rootScope.totalRecord = response.total_count;
                } else {
                    $rootScope.agencyList = [];
                }
            });
        }

        $scope.resetList = function () {
            console.log('reset function => ');
            $scope.searchUser = '';
            $scope.columnUser = 'createdAt';
            $scope.getAgencyList(1);
        }

        /**
         * Function is used for add user Modal
         */
        $scope.openDilogue = function () {
            $scope.addUserData = {};
            $scope.addUserData.role = "5a1d113016bed22901ce050b";
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/admin/modules/agency/views/AddUserModal.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope, PropertyService) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    if ($localStorage.adminuserloggedIn) {
                        $scope.createAgency = async function (formData) {
                            console.log('formData :: Add Agency data ======> ', formData);

                            var postData = {
                                agency_name: formData.agency_name,
                                created_by: $localStorage.adminData._id,
                                firstname: formData.firstname,
                                lastname: formData.lastname,
                                email: formData.email,
                                mobile_no: formData.mobile_no,
                                role_id: formData.role,
                                country: formData.address.components.country,
                                location_country: formData.address.components.countryCode ? formData.address.components.countryCode.toString() : '',
                                location_locality: formData.address.components.city ? formData.address.components.city.toString() : '',
                                location_latitude: formData.address.components.location.lat ? parseFloat(formData.address.components.location.lat) : 0,
                                location_longitude: formData.address.components.location.long ? parseFloat(formData.address.components.location.long) : 0,
                                location_postal_code: formData.address.components.postCode ? formData.address.components.postCode.toString() : '',
                                location_street_number: formData.address.components.streetNumber ? formData.address.components.streetNumber.toString() : '',
                                suburb_postcode: formData.address.name ? formData.address.name.toString() : ''
                            }

                            if (formData.address && formData.address.place && formData.address.place.address_components) {
                                for (var i = 0; i < formData.address.place.address_components.length; i++) {
                                    var addressType = formData.address.place.address_components[i].types[0];
                                    if (addressType == 'administrative_area_level_1') {
                                        postData.location_administrative_area_level_1 = await formData.address.place.address_components[i].long_name ? formData.address.place.address_components[i].long_name.toString() : '';
                                    }
                                }
                            } else {
                                postData.location_administrative_area_level_1 = await '';
                            }

                            console.log('postData => ', postData);
                            AgencyService.addAgency().post(postData, function (response) {
                                if (response.code == 200) {
                                    $scope.getAgencyList(1);
                                    toastr.success(response.message);
                                    $scope.cancel();
                                } else if (response.code == 201) {
                                    toastr.warning(response.message);
                                    $scope.cancel();
                                } else if (response.code == 400) {
                                    toastr.error(response.message);
                                    $scope.cancel();
                                } else {
                                    toastr.error('Some internal error occured please try again later');
                                    $scope.cancel();
                                }
                            });
                        }
                    }

                }
            });
            modalInstance.result.then(function (selectedItem) {
            }, function () { });

        };
        /**
        * Function is used for geting agencyList
        * @access private
        * @return json
        * Created by Minakshi K
        * @smartData Enterprises (I) Ltd
        * Created Date 21-Sep-2017
        */
        $scope.getAgentList = function () {
            $rootScope.agentList = [];
            var agencyId = $stateParams.id;
            console.log('called agencyId', agencyId);
            $scope.imageUrl = baseUrl + '/user_image/';
            postData = {
                "agency_id": agencyId
            };
            AgencyService.getAgentList().post(postData, function (response) {
                if (response.code == 200) {
                    $rootScope.agentList = response.data;
                } else {
                    $rootScope.agentList = [];
                }
            });
        }
        /**
        * Function is used for sorting user record
        * @access private
        * @return json
        * Created by Minakshi K
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

        $scope.getAgentListing = function (agencyId) {
            $location.path('agentListing/' + agencyId);
        }
        $scope.getAgentPropertyListing = function (agentId) {
            $location.path('agentPropertyListing/' + agentId);
        }
        $scope.textAreaSection = function (p) {
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
                '<img class="pull-left" src="http://52.34.207.5:5074/assets/images/logo-public-home.png" >' +
                // '<img class="pull-left" src="http://52.34.207.5:5074/assets/images/logo.png" >' +
                '<h3 style="text-align:center;color:white;margin-top: 18px;"><strong>Owner Feedback</strong><h3>' +
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
                '<p>Team OpenHaus</p>' +
                '<p>The link between property buyers and sellers</p>' +
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
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 14-Oct-2017
         */
        $scope.userDetailViewForMail = function () {
            var obj = {};
            obj.userId = $stateParams.id;
            AgencyService.userDetail().post(obj, function (response) {
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
       * Created by Minakshi K
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
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.userDetailViewForEdit = function () {
            $scope.imageUrl = baseUrl + '/user_image/';
            blockUI.start();
            var obj = {};
            obj.userId = $stateParams.id;
            AgencyService.userDetail().post(obj, function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    $scope.user = response.data;
                    $scope.user[0].mobile_no = $scope.user[0].mobile_no.slice(3, 13);
                } else {
                    $state.go("noUserFound");
                }
            })
        }
        //tiny mce options configuration
        $scope.tinymceOptions = {
            resize: false,
            height: "450px",
            plugins: [
                'advlist autolink lists link image charmap print preview anchor textcolor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table contextmenu paste code help',
                'noneditable'
            ],
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter      alignright alignjustify | bullist numlist outdent indent"

        };
        tinymce.init({
            selector: 'textarea',
            br_in_pre: false,
            theme: 'modern',
            plugins: 'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount tinymcespellchecker a11ychecker imagetools mediaembed  linkchecker contextmenu colorpicker textpattern help',
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
        /**
         * Function is used to edit user data
         * @access private
         * @return json
         * Created by Minakshi K
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.editUserInfo = function (updateData) {
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
                "mobile_no": "+65" + updateData[0].mobile_no
            }

            AgencyService.editUserByAdmin().post(userData, function (response) {
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
         * Created by Minakshi K
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
                    AgencyService.deleteUser().post(obj, function (response) {
                        if (response.code == 200) {
                            toastr.success('Successfully deleted user ');
                            blockUI.stop();
                        } else {
                            toastr.warning('Server Busy please try again latter.');
                            blockUI.stop();
                        }
                        $scope.getagencyList();
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
         * Created by Minakshi K
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
                    AgencyService.addUser().post(user, function (response) {
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
                                        $scope.getagencyList();
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
                    AgencyService.addUser().post(user, function (response) {
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
         * Created by Minakshi K
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
        $scope.searchUserAdmin = function (key) {
            var obj = {};
            obj.searchKey = key;
            AgencyService.searchUser().post(obj, function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    $rootScope.agencyList = response.data;
                } else if (response.code != 200) {
                    blockUI.stop();
                    $rootScope.agencyList = [];
                }
                if ($rootScope.agencyList.length == 0) {
                    $scope.dataKey = false;
                }
            })

        }
        $scope.upload = function (files) {
            $scope.files = files;
        };


        $scope.openCSVDilogue = function () {
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/admin/modules/agency/views/AgencyCSVUploadModal.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        console.log('close popup ====================> ');
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.data = { upload: [] }
                    $scope.fileUploadCtrlFn = function (fileUploadData) {
                        console.info('---------------------------------')
                        console.info('fileUploadData =>', fileUploadData)
                        console.info('---------------------------------')
                        let fileData = fileUploadData.splice(-1);
                        console.info('---------------------------------')
                        console.info('fileData =>', fileData)
                        console.info('---------------------------------')
                        if (fileData && fileData.length > 0) {
                            if (fileData[0].fileType === 'valid') {
                                csvHeader = [
                                    "agencyName", "firstName", "lastName", "email", "phoneNumber", "address"
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
                                console.info('---------------------------------')
                                console.info('headerValues =>', headerValues)
                                console.info('---------------------------------')
                                // Check for valid headers - compare csv headers
                                let isValidHeader = $scope.isEqual(csvHeader, headerValues);
                                console.log('$scope.isEqual => ', isValidHeader);

                                if (!isValidHeader) {
                                    toastr.warning('Please check csv Headers.');
                                } else {
                                    console.info('---------------------------------')
                                    console.info('lines =>', lines)
                                    console.info('---------------------------------')
                                    var dataValues = lines.splice(1).map(function (dataLine) { return dataLine.split(','); });

                                    dataValues.map(function (rowValues) {
                                        let finalDataValues = []
                                        let arr1 = rowValues.splice(0, 5)
                                        let arr2 = rowValues.join(",").split(`"`).join(" ").trim()

                                        finalDataValues = arr1
                                        finalDataValues.push(arr2)

                                        var row = {};
                                        headerValues.forEach(function (headerValue, index) {
                                            row[headerValue] = (index < finalDataValues.length) ? finalDataValues[index] : null;
                                        });

                                        dataArray.push(row);
                                    });
                                    console.log('csvDataArray :: check here => ', csvDataArray);
                                    csvDataArray = $scope.getUnique(dataArray, 'email');
                                    console.log('csvDataArray:: Unique records only===========> ', csvDataArray);

                                    if (csvDataArray && csvDataArray.length > 0) {
                                        $scope.CSVRecordDilogue(csvDataArray);
                                        $scope.cancel();
                                    } else {
                                        toastr.error('Something went wrong! Please try again!');
                                        $scope.cancel();
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }

        $scope.CSVRecordDilogue = function (agentData) {
            console.log('open new popup =======================> ', agentData);
            var modalInstance = $scope.model = $uibModal.open({
                animation: false,
                templateUrl: '/admin/modules/agency/views/AgencyCSVRecordModal.html',
                scope: $scope,
                controller: function ($uibModalInstance, $scope) {
                    $scope.ok = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    let newAgencyData = []
                    agentData.forEach(item => {
                        if (item.firstName && item.lastName && item.email && item.agencyName) {
                            newAgencyData.push(item)
                        }
                    })
                    $scope.bulkAgentData = newAgencyData;
                    console.log('$stateParams.id => ', $stateParams.id);
                    console.log('$user => ', $scope.user);
                    console.log('$scope.bulkAgentData :: Final Array => ', $scope.bulkAgentData);

                    $scope.bulkImportAgents = async function (formData) {

                        // Check again for unique records only
                        let data = $scope.getUnique(formData, 'email');
                        let postData = [];

                        data.map(agent => {
                            if (agent) {
                                postData.push(JSON.stringify(agent));
                            }
                        });

                        console.log('formData => ', postData);
                        if (postData) {
                            AgencyService.AgencyBulkImport().post({
                                agency_arr: postData,
                                created_by: $localStorage.adminData._id,
                                role_id: "5a1d113016bed22901ce050b"
                            }, function (response) {
                                console.log('response => ', response);
                                if (response.code == 200) {
                                    $scope.cancel();
                                    toastr.success(response['message'] ? response['message'] : "Bulk Upload Successfully");

                                } else if (response.code == 400) {
                                    $scope.cancel();
                                    toastr.error(response['message']);
                                }
                                setTimeout(() => {
                                    $scope.getAgencyList(1);
                                }, 1000);
                            }, err => {
                                console.log('err => ', err);
                                $scope.cancel();
                            })
                        }
                    }
                }
            })
        }



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
    }
}());
