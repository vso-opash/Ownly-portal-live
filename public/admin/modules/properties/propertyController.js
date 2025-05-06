/**
 *  Angular Controller
 * @author 
 * @created 20 Sept 2017
 */
(function () {
    angular.module('TSM_ADMIN')
        .controller("PropertyCtrl", PropertyCtrl);
    PropertyCtrl.$inject = [
        '$state',
        '$route',
        '$scope',
        '$localStorage',
        '$rootScope',
        '$window',
        '$location',
        '$stateParams',
        'blockUI',
        'PropertyService',
        'toastr',
        'DashboardService',
        'UserService'
    ];

    function PropertyCtrl($state, $route, $scope, $localStorage, $rootScope, $window, $location, $stateParams, blockUI, PropertyService, toastr, DashboardService, UserService) {
        $rootScope.propertyManagementActive;
        $scope.activeDashboard = function () {
            $rootScope.dashboardActive = " ";
            $rootScope.dashboardStatus = " ";
            $rootScope.userStatus = "";
            $rootScope.traderUserStatus = "";
            $rootScope.agencyStatus = "";
            $rootScope.profileActive = " ";
            $rootScope.profileStatus = "";
            $rootScope.proepertyStatus = "active";
            $rootScope.userManagementActive = "";
            $rootScope.propertyManagementActive = "";
            $rootScope.advertisingStatus = " ";
            $rootScope.maintenanceStatus = " ";
        }();
        /**
        * Function is used for get all properties
        * @access private
        * @return json
        * Created by 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Sep-2017
        */
        $scope.status = "0";
        $rootScope.createDate = false;
        $rootScope.endDate = false;
        $scope.getPropertyList = function () {
            blockUI.start();
            $scope.propertyList = [];
            $scope.imageUrl = baseUrl + '/uploads';
            PropertyService.propertyList().get(function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    $scope.propertyList = response.data;
                } else {
                    blockUI.stop();
                    $scope.propertyList = [];
                }
            });
        }
        /**
        * Function is used for get all properties
        * @access private
        * @return json
        * Created by 
        * @smartData Enterprises (I) Ltd
        * Created Date 22-Sep-2017
        */
        $scope.status = "0";
        $rootScope.createDate = false;
        $rootScope.endDate = false;
        $scope.getAgentPropertyList = function () {
            blockUI.start();
            $scope.propertyList = [];
            $scope.imageUrl = baseUrl + '/uploads';
            var agentId = $stateParams.id;
            var postData = {
                "agentId": agentId
            };
            PropertyService.getAgentPropertyList().post(postData, function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    $scope.propertyList = response.data;
                } else {
                    blockUI.stop();
                    $scope.propertyList = [];
                }
            });
        }
        // $scope.SendEmailToSeller = function (msg) {

        //     console.log("msg",msg);
        // }
        $scope.reverse = false;
        $scope.column = 'title';
        // called on header click
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
            } else {
                $scope.reverse = true;
            }
        };
        // remove and change class
        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        }
        $scope.getPropertyMaintenanceListing = function (maintenanceId) {
            $location.path('maintenanceListing/' + maintenanceId);
        }
        $scope.getMaintenceList = function () {
            $scope.maintenanceList = [];
            var propertyId = $stateParams.id;
            $scope.imageUrl = baseUrl + '/property_image';
            PropertyService.propertyMaintenanceList(propertyId).get(function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    $scope.maintenanceList = response.data;
                    //$scope.maintenanceList = [];
                } else {
                    blockUI.stop();
                    $scope.maintenanceList = [];
                }
            });
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
         * Function is used to delete property data
         * @access private
         * @return json
         * Created by 
         * @smartData Enterprises (I) Ltd
         * Created Date 21-Sep-2017
         */
        $scope.deleteProperty = function (id) {
            var obj = {};
            obj.propertyId = id;
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this property information!",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    PropertyService.deleteProperty().post(obj, function (response) {
                        if (response.code == 200) {
                            toastr.success('Deleted property successfully');
                            blockUI.stop();
                        } else {
                            toastr.warning('Server Busy please try again latter.');
                            blockUI.stop();
                        }
                        $scope.getPropertyList();
                    });
                }
            });
        }
        $scope.applyFilter = function () {
            $scope.filteredData = $scope.$eval('propertyList | filter: searchPropertyData');
            if (!$scope.filteredData || !$scope.filteredData.length) {
                $scope.disableSearchFlag = true;
                // $scope.propertyList=[];
            } else {
                $scope.disableSearchFlag = false;
            }
        }
        $scope.searchProperty = function (status, dt, dtEnd) {
            var obj = {};
            $scope.propertyList = [];
            if (status) {
                obj.status = status;
                if (dt && typeof (dtEnd) != "string") {
                    var date = dt;
                    obj.dayNumber1 = parseInt(moment(date).format("DDD"));
                    obj.yearNumber1 = parseInt(moment(date).format("YYYY"));
                } if (dtEnd && typeof (dtEnd) != "string") {
                    var date2 = dtEnd;
                    obj.yearNumber2 = parseInt(moment(date2).format("YYYY"));
                    obj.dayNumber2 = parseInt(moment(date2).format("DDD"));
                }
                PropertyService.searchProperty().post(obj, function (response) {
                    if (response.code == 200) {
                        $scope.propertyList = response.data;
                        blockUI.stop();
                    } else {
                        $scope.propertyList = [];
                        blockUI.stop();
                        $scope.propertyListStatus = true;
                    }
                });
            }
        }
        $scope.changePropertyStatusToApprove = function (id) {
            var obj = {};
            obj.propertyId = id;
            swal({
                title: "Are you sure?",
                text: "You want to reject this property, i.e. invisible on the website!",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    PropertyService.setApprovalStatus().post(obj, function (response) {
                        if (response.code == 200) {
                            toastr.success('Successfully rejected property visibility');
                            blockUI.stop();
                        } else {
                            toastr.warning('Server Busy please try again latter.');
                            blockUI.stop();
                        }
                        $scope.getPropertyList();
                    });
                }
            });

        }
        $scope.changePropertyStatusToTrue = function (id) {
            var obj = {};
            obj.propertyId = id;
            swal({
                title: "Are you sure?",
                text: "You want to approve this property to be visible on the website!",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    PropertyService.setApprovalStatusToTrue().post(obj, function (response) {
                        if (response.code == 200) {
                            toastr.success('Approved property successfully');
                            blockUI.stop();
                        } else {
                            toastr.warning('Server Busy please try again latter.');
                            blockUI.stop();
                        }
                        $scope.getPropertyList();
                    });
                }
            });

        }

        $scope.resetSearch = function () {
            blockUI.start();
            $scope.propertyList = [];
            $scope.imageUrl = baseUrl + '/uploads';
            var agentId = $stateParams.id;
            var postData = {
                "agentId": agentId
            };
            PropertyService.getAgentPropertyList().post(postData, function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    $scope.propertyList = response.data;
                } else {
                    blockUI.stop();
                    $scope.propertyList = [];
                }
            });
        }
        $scope.open2 = function () {
            $rootScope.createDate = true;
            $scope.popup2.opened = true;

        };
        $scope.openEndDate = function () {
            $rootScope.endDate = true;
            $scope.popupEnd.opened = true;
        };
        /**
         * Function is use to set date from calendar
         * @access private
         * @return json
         * Created by Minakshi
         * @smartData Enterprises (I) Ltd
         * Created Date 3-Aug-2017
         */
        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };
        $scope.popupEnd = {
            opened: false
        };
        $scope.today = function () {
            $scope.dt = new Date();
        };


        /**
         * Function is use to clear date on input area 
         * @access private
         * @return json
         * Created by Minakshi
         * @smartData Enterprises (I) Ltd
         * Created Date 3-Aug-2017
         */
        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.textAreaSection = function (p) {
            var name;

            if (typeof (p) != 'undefined') {
                name = (p[0].owner_id.firstname).substring(0, 1).toUpperCase() + (p[0].owner_id.firstname).substring(1);
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
                '<img class="pull-left" src="http://52.34.207.5:5074/assets/images/logo-public-home.png"  style="max-height: 30px;">' +
                // '<img class="pull-left" src="http://52.34.207.5:5074/assets/images/logo.png"  style="max-height: 30px;">' +
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
                ' <div align="center" style="font-size:12px;margin: 10px 0px; padding:5px; width:100%;">© 2017 <a href="#" style="text-decoration:none;color:#fff;">Ownly</a>' +
                '</div>' +
                '</td> ' +
                '</tr>' +
                '</table>'
            setTimeout(function () { tinymce.get('my_editor').setContent($scope.emailTemplate); }, 100);
        }
        $scope.singleUser = [];
        $scope.getSinglePropertyDetail = function () {
            blockUI.start();
            var obj = {};
            obj.userId = $stateParams.id;
            UserService.userDetail().post(obj, function (response) {
                if (response.code == 200) {
                    $scope.singleUser = response.data;
                    blockUI.stop();
                } else {
                    $state.go("noUserFound");
                    blockUI.stop();
                }
            });
        }
        $scope.back = function () {
            $window.history.back();
        }
        /**
         * function is used to navigate to maintenance details page 
         * @param {*} maintenanceId 
         */
        $scope.getMaintenanceDetails = function (maintenanceId) {
            $location.path('maintenanceDetails/' + maintenanceId);
        }
        $scope.getPropertyMaintenanceDetails = function () {
            var maintenanceId = $stateParams.id;
            $scope.maintenanceDetails = [];
            $scope.imageUrl = baseUrl + '/user_image';
            $scope.documentUrl = baseUrl + '/maintenance/';
            PropertyService.getPropertyMaintenanceDetails(maintenanceId).get(function (response) {
                if (response.code == 200) {
                    blockUI.stop();
                    $scope.maintenanceDetails = response.data;
                } else {
                    blockUI.stop();
                    $scope.maintenanceDetails = [];
                }
            });
        }
        $scope.sendEmailToSeller = function (pid, email) {
            blockUI.start();
            var obj = {};
            obj.email = email;
            obj.emailTemplate = tinymce.activeEditor.getContent();;
            obj.propertyId = pid;
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
    }
}());