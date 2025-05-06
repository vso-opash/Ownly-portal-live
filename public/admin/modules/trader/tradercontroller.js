/**
 * Angular Controller
 * @author 
 * @created 20 Sept 2017
 */
(function () {
    angular.module('TSM_ADMIN')
        .controller("TraderCtrl", TraderCtrl);
    TraderCtrl.$inject = [
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
        'TraderService',
        'toastr',
        'ngTableParams',
        'Upload',
        'PropertyService'
    ];

    function TraderCtrl($state, $route, $scope, $localStorage, $rootScope, $http, $filter, $window, $location, $stateParams, blockUI, TraderService, toastr, ngTableParams, Upload, PropertyService) {
        $scope.user = {};
        $scope.user.gender = 1;
        $scope.greeting = '123456789';
        $rootScope.userManagementActive;
        $scope.roleId = roleId;
        $scope.searchBycategory = '';
        $scope.serachByUserStatus = '';
        $scope.baseUrl_path = baseUrl;
        $scope.activeDashboard = function () {
            $rootScope.dashboardActive = " ";
            $rootScope.dashboardStatus = " ";
            $rootScope.userStatus = "";
            $rootScope.traderUserStatus = "active";
            $rootScope.agencyStatus = "";
            $rootScope.profileActive = " ";
            $rootScope.profileStatus = " ";
            $rootScope.proepertyStatus = " ";
            $rootScope.userManagementActive = "active";
            $rootScope.propertyManagementActive = " ";
            $rootScope.advertisingStatus = " ";
            $rootScope.maintenanceStatus = " ";
            $rootScope.setTraderCounter = function () {
                $localStorage.tradercount = 1
            }
            $scope.defaultSortBy = "createdAt"
        }();
        $scope.localPage = 1
        if ($localStorage.tradercount > 0) {
            $scope.localPage = $localStorage.tradercount

        }
        $scope.currentPage = $scope.localPage;
        $scope.pageNumber = $scope.localPage;

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

        $scope.load_category_list = function () {
            TraderService.getServiceCategory().get(function (response) {
                if (response.code == 200) {
                    $rootScope.category_list = response.data;
                } else {
                    $rootScope.category_list = [];
                }
            });
        }

        $scope.controllerInitialization = function () {
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
            $rootScope.userStatus = "";
            $rootScope.traderUserStatus = "active";
            $rootScope.profileActive = " ";
            $rootScope.profileStatus = " ";
            $rootScope.proepertyStatus = " ";
            $rootScope.userManagementActive = "aciveDashboard";
            $rootScope.propertyManagementActive = " ";
            $rootScope.advertisingStatus = " ";
            $rootScope.maintenanceStatus = " ";
            $localStorage.tradercount = $localStorage.tradercount ? $localStorage.tradercount : 1
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
            TraderService.getFileListing().post(postData, function (response) {
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

        /**
         * Function used to get data as per page number
         * Pagination on click function
         */
        $scope.paginationClick = function (current_page, searchtext, category_type, userStatus) {
            console.log('current_page :: function called => ', current_page);
            console.log('typeof current_page => ', typeof (current_page + ''));
            console.log('category_type :: pagination=> ', category_type);
            console.log('searchtext :: pagination => ', searchtext);
            console.log('userStatus :: pagination => ', userStatus);
            $scope.pageNumber = current_page;
            $localStorage.tradercount = current_page
            $scope.getUserList(current_page, searchtext, category_type, userStatus);
        }

        /**
         * Filter data as per page number
         */
        $scope.traderListPagination = function (selected_page, searchtext, category_type, userStatus) {
            $scope.currentPage = selected_page;
            $localStorage.tradercount = selected_page;
            $scope.getUserList(selected_page, searchtext, category_type, userStatus);
        }

        /**
         * Filter Trader list as per category and name
         */
        $scope.filterTraders = function (current_page, searchtext, category_type, userStatus) {
            $scope.currentPage = 1;
            $localStorage.tradercount = 1;
            $scope.pageNumber = 1;
            $scope.getUserList(current_page, searchtext, category_type, userStatus);
        }

        /**
         * Function is used for geting userList
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.getUserList = function (current_page, searchtext, category_type, userStatus) {
            console.info('---------------------------------')
            console.info('$scope.reverseUser =>', $scope.reverseUser)
            console.info('---------------------------------')
            console.log('userStatus => ', userStatus);
            console.log('current_page => ', current_page);
            console.log('typeof current_page :: initial function=> ', typeof current_page);
            $rootScope.userList = [];
            $scope.imageUrl = baseUrl + '/user_image/';
            postData = {};

            postData.searchtext = searchtext;

            postData.categories_id = category_type;
            postData.user_id = $localStorage.adminData._id;
            postData.user_email_status = userStatus;
            postData.current_page = current_page;
            postData.number_of_pages = 10;
            postData.sortBy = $scope.defaultSortBy
            postData.sortByCount = $scope.reverseUser ? -1 : 1
            // postData = {
            //     searchtext: searchtext,
            //     categories_id: category_type,
            //     user_id: $localStorage.adminData._id,
            //     user_email_status: userStatus,
            //     current_page: current_page,
            //     number_of_pages: '10'
            // }
            TraderService.tradersListForAdmin().post(postData, function (response) {
                if (response.code == 200) {
                    $rootScope.userList = response.data;
                    $rootScope.totalRecord = response.totalCount;
                } else {
                    $rootScope.userList = [];
                }
            });
        }

        $scope.resetList = function () {

            $scope.searchBycategory = '';
            $scope.serachByUserStatus = '';
            $scope.searchUser = '';
            $scope.reverseUser = true;
            $scope.columnUser = 'createdAt';
            $scope.sortRecentUserColumn('');
            console.log('$scope.newPageNumber => ', $scope.newPageNumber);
            $scope.currentPage = 1;
            $scope.pageNumber = '';
            $scope.getUserList(1);
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
            TraderService.getAllUSerReview($scope.current_user_id).get(function (response) {
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
                    TraderService.deleteReview(id).get(function (response) {
                        if (response.code == 200) {
                            toastr.success('Successfully deleted review');
                            $scope.getUserReviewList();
                            blockUI.stop();
                        } else {
                            toastr.warning('Server Busy please try again latter.');
                            blockUI.stop();
                        }
                        $scope.getUserList(1);
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
        $scope.reverseUser = true;
        $scope.sortRecentUserColumn = function (col) {
            $scope.columnUser = col;
            if (col) {
                $scope.defaultSortBy = col
            }
            if ($scope.reverseUser) {
                $scope.reverseUser = false;
            } else {
                $scope.reverseUser = true;
            }
            col && $scope.getUserList($scope.pageNumber)
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
            $scope.imageUrl = baseUrl + '/user_image/';
            blockUI.start();
            var obj = {};
            obj.userId = $stateParams.id;
            $scope.current_user_id = $stateParams.id;
            TraderService.userDetail().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.user = response.data;
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
            TraderService.userDetail().post(obj, function (response) {
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
        String.prototype.isNumber = function () {
            return /^\d+$/.test(this);
        }

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
            TraderService.searchUser().post(obj, function (response) {
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

        $scope.uploadCsv = function (file) {
            console.log("File  ", file);
            var userId = $localStorage.adminData._id;
            $scope.csvUpload(file, userId);
        }

        $scope.csvUpload = function (file, data) {
            Upload.upload({
                url: baseUrl + '/api/importTraderCSV',
                data: {
                    _id: data,
                    file: file
                }
            }).then(function (response) {
                if (response.data.code == 200) {
                    $scope.getUserList(1);
                    toastr.success(response.data.message);
                } else {
                    toastr.error(response.data.message);
                }
            }, null, function (evt) {
                $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            });
        }

        $scope.uploadCategoriesCsv = function (file) {
            console.log("File  ", file);
            var userId = $localStorage.adminData._id;
            $scope.csvUpload1(file, userId);
        }

        $scope.csvUpload1 = function (file, data) {
            Upload.upload({
                url: baseUrl + '/api/importCategoriesCSV',
                data: {
                    _id: data,
                    file: file
                }
            }).then(function (response) {
                if (response.data.code == 200) {
                    $scope.getUserList();
                    toastr.success(response.data.message);
                } else {
                    toastr.error(response.data.message);
                }
            }, null, function (evt) {
                $scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            });
        }
    }
}());