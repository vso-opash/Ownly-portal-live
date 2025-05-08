/**
 * Super Angular Controller
 * @author Mohammad H.
 * @created 10 June, 16
 */
(function () {
  "use strict";
  angular.module("SYNC").controller("SuperCntrl", SuperCntrl);

  SuperCntrl.$inject = [
    "$state",
    "$route",
    "$scope",
    "$rootScope",
    "$http",
    "$filter",
    "$window",
    "$location",
    "$stateParams",
    "Crud",
    "SweetAlert",
    "permissions",
    "$localStorage",
    "localStorageService",
    "APP_CONST",
    "blockUI",
    "toastr",
    "socket",
    "userService",
    "agreementService",
  ];

  function SuperCntrl(
    $state,
    $route,
    $scope,
    $rootScope,
    $http,
    $filter,
    $window,
    $location,
    $stateParams,
    Crud,
    SweetAlert,
    permissions,
    $localStorage,
    localStorageService,
    APP_CONST,
    blockUI,
    toastr,
    socket,
    userService,
    agreementService
  ) {
    $rootScope.stripe_key = stripe_key;
    $rootScope.logged_in_token = $localStorage.token;
    $rootScope.baseUrl = baseUrl;

    $scope.currentPath = $location.path();
    var locationPath = $location.path();
    var locationArray = locationPath.split("/");
    $scope.openInfoModel = function () {
      SweetAlert.swal("This feature is not available.");
    };
    socket.emit("addUser", {
      id: $localStorage.loggedInUserId,
    });

    socket.on("received", function (data) {
      toastr.info(data.textMsg, " ", {
        allowHtml: true,
        onTap: function () {
          // if ($state.current.name == "chat") {
          //     $scope.select_user(user);
          // } else {
          $state.go("chat", { id: data.from });
          // }
        },
      });

      $scope.load_notification_list();
    });

    socket.on("chatMessageRecieved", function (message) {
      // console.log("Messages sent");
      if (message.from != $localStorage.loggedInUserId) {
        toastr.info("user message", message.msg);
      }
      $scope.load_notification_list();
      socket.emit("ChatMessageHistory", {
        to: $rootScope.to,
        from: $localStorage.loggedInUserId,
      });
    });

    $scope.load_notification_list = function () {
      $rootScope.messageData = [];
      $rootScope.unReadMessages = [];
      var obj = {};
      obj.user_id = $localStorage.loggedInUserId;
      $scope.imageUrl = baseUrl + "/user_image/";
      userService.messageList().post(obj, function (response) {
        if (response.code == 200) {
          $rootScope.messageData = response.data;
          $rootScope.unReadMessages = response.data;
          // console.log("called", response);
        }
      });
    };
  }

  angular.module("SYNC").controller("LandingCtrl", LandingCtrl);

  LandingCtrl.$inject = [
    "$state",
    "$route",
    "$scope",
    "$rootScope",
    "$http",
    "$filter",
    "$window",
    "$location",
    "$stateParams",
    "Crud",
    "SweetAlert",
    "permissions",
    "localStorageService",
    "APP_CONST",
    "Flash",
    "BASE_URL",
    "toastr",
    "socket",
    "PropertyService",
    "$localStorage",
    "$anchorScroll",
    "blockUI",
    "userService",
    "$uibModal",
    "TenantService",
    "maintainService",
    "Upload",
    "uiCalendarConfig",
    "agreementService",
    "$q",
    "$timeout",
    "AgentService",
  ];

  function LandingCtrl(
    $state,
    $route,
    $scope,
    $rootScope,
    $http,
    $filter,
    $window,
    $location,
    $stateParams,
    Crud,
    SweetAlert,
    permissions,
    localStorageService,
    APP_CONST,
    Flash,
    BASE_URL,
    toastr,
    socket,
    PropertyService,
    $localStorage,
    $anchorScroll,
    blockUI,
    userService,
    $uibModal,
    TenantService,
    maintainService,
    Upload,
    uiCalendarConfig,
    agreementService,
    $q,
    $timeout,
    AgentService
  ) {
    $scope.maintenance = {};
    $scope.maintenanceImageUrl = baseUrl + "/maintenance/";
    $scope.isAgentOwnerAgency =
      $localStorage.role_id == roleId.agent ||
        $localStorage.role_id == roleId.ownAgency ||
        $localStorage.role_id == roleId.owner
        ? true
        : false;
    $scope.isTenant = $localStorage.role_id == roleId.tenant ? true : false;
    $scope.userActiveRoleId = $localStorage.role_id;
    $scope.isAgent = $localStorage.role_id == roleId.agent ? true : false;
    $scope.notRequiredTrader = $scope.isAgent == true ? true : false;
    //$scope.eventSources2 = [[{"title":"2:54 PM Ewan","start":"2018-03-30","name":"Ewan","status":"Pending","color":"#e9d502","_id":1}]];
    $scope.inspection = [];
    $scope.eventSources2 = [$scope.inspection];
    $scope.agentList = [];
    $scope.superLoginUser = false;
    if ($localStorage.superLoginUserId) {
      $scope.superLoginUser = true;
    }

    $rootScope.moveToPublicSite = function () {
      console.info('---------------------------------')
      console.info('baseURL_for_site =>', baseURL_for_site)
      console.info('---------------------------------')
      console.info('---------------------------------')
      console.info('baseUrl_production_site =>', baseUrl_production_site)
      console.info('---------------------------------')
      if (baseURL_for_site.search(baseUrl_production_site) > -1) {
        window.location = baseUrl_production_public
        console.info('---------------------------------')
        console.info('baseUrl_production_site =>', baseUrl_production_site)
        console.info('---------------------------------')
      } else {
        window.location = baseUrl_development_public
        console.info('---------------------------------')
        console.info('baseUrl_development_site =>', baseUrl_development_site)
        console.info('---------------------------------')
      }

    }

    //ui calendar start from here
    /* config object */
    /* config object */
    $scope.uiConfig = {
      calendar: {
        height: 650,
        editable: true,
        header: {
          left: "title",
          center: "",
          right: "today prev,next",
        },
        eventTextColor: "#000000",
        eventRender: function (event, element, view) { },
        selectable: true,
        eventClick: function (calEvent, jsEvent, view) {
          var dateStart = moment("2018-2-31");
          var dateEnd = moment("2018-12-27");
          var timeValues = [];
          swal({
            title: "Inspection",
            text:
              "Property : " +
              calEvent.title +
              "\n" +
              "Date :" +
              moment(calEvent.start).format("DD-MM-YYYY") +
              "\n" +
              "Owner :" +
              calEvent.name,
            // imageUrl: '/assets/images/logo_color_blue.png',
            imageUrl: "/assets/images/logo-dark.png",
            imageWidth: 10,
            imageHeight: 10,
            maxHeight: 45,
            confirmButtonColor: "#09f",
          });
        },
        eventMouseover: false,
        eventLimit: 2, // for all non-agenda views
        views: {
          agenda: {
            eventLimit: 25, // adjust to 6 only for agendaWeek/agendaDay
          },
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
        },
      },
    };
    $scope.roleId = $localStorage.role_id ? $localStorage.role_id : "";
    $scope.traderId = $localStorage.loggedInUserId;
    if (baseURL_for_site === "https://portal.ownly.com.au") {
      $scope.inviteBaseURL =
        "https://ownly.com.au/trade?s=request%26inviteBy=" + $scope.traderId;
    } else {
      $scope.inviteBaseURL =
        "http://syncitt.world/trade?s=request%26inviteBy=" + $scope.traderId;
    }

    $scope.mail_content =
      "Hi team,%0D%0A%0D%0APlease join using the url below.%0D%0A%0D%0A" +
      $scope.inviteBaseURL +
      "%0D%0A%0D%0ABest Regards,%0D%0ASyncitt Team%0D%0A%0D%0A";
    $scope.signup_link = `mailto:?body=${$scope.mail_content}&subject=Sign Up to become Syncitt Customer`;

    $scope.inspectionDate = [];
    $scope.getInspectionOnCalendar = function () {
      var loggedInId = $localStorage.loggedInUserId;
      var agencyId = "";
      if ($localStorage.userData.agency_id) {
        agencyId = $localStorage.userData.agency_id._id
          ? $localStorage.userData.agency_id._id
          : $localStorage.userData.agency_id;
      }
      var postData = {
        request_by_id: loggedInId,
        request_by_role: $localStorage.role_id,
        agency_id: agencyId,
      };
      userService.getInspectionDate().post(postData, function (response) {
        if (response.code == 200) {
          $scope.inspectionDate = response.data;
          //console.log('result',response.data);
          angular.forEach(response.data, function (element, key) {
            if (element.inspection_date && element.inspection_date.length > 0) {
              angular.forEach(
                element.inspection_date,
                function (inspectionData, key) {
                  $scope.inspection.push({
                    title: element.property_id.address,
                    start: moment(inspectionData).format("YYYY-MM-DD"),
                    name:
                      element.owner_id.firstname +
                      " " +
                      element.owner_id.lastname,
                    color: "#FDC614",
                  });
                }
              );
            }
          });
        }
        $rootScope.eventSources2 = [$scope.inspection];
        // console.log('$scope.inspection', $scope.inspection);
      });
    };
    //ui calendar ends here
    //active thread start from here
    $scope.isAll = true;
    $scope.general = false;
    $scope.maintenance = false;
    $scope.disputes = false;
    $scope.inspections = false;
    $scope.generalThreadList = [];
    $scope.maintenanceThreadMaintenanceList = [];
    $scope.maintenanceThreadNoticeList = [];
    $scope.maintenanceGeneralList = [];
    $scope.maintenanceDisputesList = [];
    $scope.maintenanceInspectionsList = [];
    $scope.appointmentData = [];
    $scope.showReview = function (selection) {
      $scope.propertyImageUrl = baseUrl + "/property_image/";
      $scope.fileImageUrl = baseUrl + "/document/";
      $timeout(function () {
        $scope.getReviewData(selection);
      }, 500);
    };

    $scope.getReviewData = function (selection) {
      var agencyId = "";
      if ($localStorage.userData.agency_id) {
        agencyId = $localStorage.userData.agency_id._id
          ? $localStorage.userData.agency_id._id
          : $localStorage.userData.agency_id;
      }
      var postData = {
        created_by: $localStorage.loggedInUserId,
        request_by_role: $localStorage.role_id,
        agency_id: agencyId,
      };
      if (selection == "all") {
        $scope.isAll = true;
        $scope.general = false;
        $scope.maintenance = false;
        $scope.disputes = false;
        $scope.inspections = false;

        $scope.all_data_list = [];

        if ($rootScope.permission.indexOf("agreement") != -1) {
          //General Section
          var obj = {};
          if ($localStorage.userData.agency_id) {
            obj.agency_id =
              $localStorage.userData.agency_id &&
                $localStorage.userData.agency_id._id
                ? $localStorage.userData.agency_id._id
                : $localStorage.userData.agency_id;
          }
          obj.created_by = $localStorage.loggedInUserId;
          obj.request_by_role = $localStorage.role_id;
          agreementService.agreementListing().post(obj, function (response) {
            if (response.code == 200) {
              $scope.agreementList = response.data;
              if ($scope.agreementList && $scope.agreementList.length > 0) {
                var ii_ = 0;
                $scope.agreementList.map(function (item) {
                  if (ii_ < 5) {
                    item.type = "general";
                    $scope.all_data_list.push(item);
                  }
                  ii_++;
                });
              }
            }
          });
        }
        if ($rootScope.permission.indexOf("maintenance") != -1) {
          userService
            .getMaintenanceThread()
            .post(postData, function (response) {
              if (response.code == 200) {
                $scope.maintenanceThreadList = response.result;
                if (
                  $scope.maintenanceThreadList &&
                  $scope.maintenanceThreadList.length > 0
                ) {
                  var ii_ = 0;
                  $scope.maintenanceThreadList.map(function (item) {
                    if (ii_ < 5) {
                      item.type = "maintenance";
                      $scope.all_data_list.push(item);
                    }
                    ii_++;
                  });
                }
              }
            });
        }
        if ($rootScope.permission.indexOf("disputes") != -1) {
          var postData = {
            user_id: $localStorage.loggedInUserId,
            request_by_role: $localStorage.role_id,
          };
          if ($localStorage.userData.agency_id) {
            postData.agency_id = $localStorage.userData.agency_id._id
              ? $localStorage.userData.agency_id._id
              : $localStorage.userData.agency_id;
          }

          TenantService.getDisputes().post(postData, function (response) {
            if (response.code == 200) {
              $scope.disputeList = response.data;
              if ($scope.disputeList && $scope.disputeList.length > 0) {
                var ii_ = 0;
                $scope.disputeList.map(function (item) {
                  if (ii_ < 5) {
                    item.type = "disputes";
                    $scope.all_data_list.push(item);
                  }
                  ii_++;
                });
              }
            }
          });
        }
        /**
         * get all user reviews
         */
        // userService.getAllnGeneralThread().post(postData, function (response) {
        //     if (response.code == 200) {
        //         $scope.maintenanceThreadMaintenanceList = response.maintenences;
        //         // $scope.maintenanceThreadNoticeList = response.noticeboard;
        //     }
        // });
      } else if (selection == "general") {
        $scope.isAll = false;
        $scope.general = true;
        $scope.maintenance = false;
        $scope.disputes = false;
        $scope.inspections = false;
        $scope.agreementList = [];

        if ($rootScope.permission.indexOf("agreement") != -1) {
          var obj = {};
          if ($localStorage.userData.agency_id) {
            obj.agency_id =
              $localStorage.userData.agency_id &&
                $localStorage.userData.agency_id._id
                ? $localStorage.userData.agency_id._id
                : $localStorage.userData.agency_id;
          }
          obj.created_by = $localStorage.loggedInUserId;
          obj.request_by_role = $localStorage.role_id;
          agreementService.agreementListing().post(obj, function (response) {
            if (response.code == 200) {
              $scope.agreementList = response.data;
            } else {
              $scope.agreementList = [];
            }
          });
        }
        /**
         * user your service as per selection
         */
        // userService.getAllnGeneralThread().post(postData, function (response) {
        //     if (response.code == 200) {
        //         $scope.maintenanceThreadMaintenanceList = response.maintenences;
        //         //$scope.maintenanceThreadNoticeList = response.noticeboard;
        //     }
        // });
        // $scope.maintenanceGeneralList = [];
      } else if (selection == "maintenance") {
        $scope.isAll = false;
        $scope.general = false;
        $scope.maintenance = true;
        $scope.disputes = false;
        $scope.inspections = false;
        userService.getMaintenanceThread().post(postData, function (response) {
          if (response.code == 200) {
            $scope.maintenanceThreadList = response.result;
          }
        });
      } else if (selection == "disputes") {
        $scope.isAll = false;
        $scope.general = false;
        $scope.maintenance = false;
        $scope.disputes = true;
        $scope.inspections = false;
        /**
         * user your service as per selection
         */
        $scope.maintenanceDisputesList = [];
        var postData = {
          user_id: $localStorage.loggedInUserId,
          request_by_role: $localStorage.role_id,
        };
        if ($localStorage.userData.agency_id) {
          postData.agency_id = $localStorage.userData.agency_id._id
            ? $localStorage.userData.agency_id._id
            : $localStorage.userData.agency_id;
        }
        TenantService.getDisputes().post(postData, function (response) {
          if (response.code == 200) {
            $scope.disputeList = response.data;
          }
        });
      } else if (selection == "inspections") {
        $scope.isAll = false;
        $scope.general = false;
        $scope.maintenance = false;
        $scope.disputes = false;
        $scope.inspections = true;
        /**
         * user your service as per selection
         */
        $scope.maintenanceInspectionsList = [];
      }
    };
    //active thread ends here
    /**
     * Here we are getting the default role id and others role ids in the system
     */
    $scope.fileImageUrl = baseUrl + "/document/";
    $rootScope.masterRoleId = $localStorage.defaultRoleId;
    $scope.roleRecord = roleId;
    $scope.roleId = $localStorage.role_id;
    $scope.agent = roleId.agent;
    $scope.ownAgency = roleId.ownAgency;
    $scope.pagination = {
      current: 1,
    };
    $scope.popupClass = "dropdown profile-dropdown";
    $scope.openOtherPopup = function () {
      $scope.popupClass =
        $scope.popupClass == "dropdown profile-dropdown"
          ? "dropdown profile-dropdown open"
          : "dropdown profile-dropdown";
    };
    $scope.isTrader = $localStorage.role_id == roleId.trader ? true : false;
    $scope.maintenanceInit = function () {
      // $scope.getTraderList();
      $scope.category_list();
    };

    $scope.category_list = function () {
      userService.getServiceCategoryList().get(function (response) {
        if (response.code == 200) {
          $scope.category_listing = response.data;
        }
      });
    };

    /**
     * Function is to get unread messages
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $rootScope.unReadMessages = [];
    $scope.userImageUrl = baseUrl + "/user_image/";
    $scope.TodayDate = moment().format("YYYY MM DD");
    $scope.getUnreadMessage = function () {
      var loggedInId = $localStorage.loggedInUserId;
      var obj = {};
      obj.user_id = $localStorage.loggedInUserId;
      userService.messageList().post(obj, function (response) {
        if (response.code == 200) {
          $rootScope.unReadMessages = response.data;
          // console.log("called", response);
        }
      });
      // userService.getUnreadDashboardMessages(loggedInId).get(function (response) {
      //     if (response.code == 200) {
      //         // console.log('response.data',response.data);
      //         // angular.forEach(response.data, function (value, key) {
      //         //     var diff1 = moment(value.created).format("YYYY MM DD");
      //         //     value.difference =Math.abs(moment(diff1).diff(moment($scope.TodayDate), 'days'));
      //         // });
      //         $scope.unReadMessages = response.data;
      //         console.log('$scope.unReadMessages', $scope.unReadMessages);
      //     }
      // });
    };
    /**
     * Function is to open add new tenant modal
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.openAddTenant = function () {
      var modalInstance = ($scope.model = $uibModal.open({
        animation: false,
        templateUrl: "/frontend/modules/tenants/views/add.html",
        scope: $scope,
        controller: function ($uibModalInstance, $scope) {
          $scope.tenantpasswordStatus = false;
          $scope.tenatPropertyImageUrl = baseUrl + "/property_image/";
          $scope.tenatFileImageUrl = baseUrl + "/document/";
          $scope.propertyTenant = {};
          $scope.ok = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.getAgencyProperty = function () {
            blockUI.start();
            if (
              $localStorage.userData.agency_id != "undefined" &&
              $localStorage.userData.agency_id
            ) {
              var obj = {};
              obj.agency_id = $localStorage.userData.agency_id._id
                ? $localStorage.userData.agency_id._id
                : $localStorage.userData.agency_id;
              obj.user_id = $localStorage.userData._id;
              obj.request_by_role = $localStorage.role_id
                ? $localStorage.role_id
                : "";
              TenantService.propertyListingInAddTenant().post(
                obj,
                function (response) {
                  if (response.code == 200) {
                    $scope.propertyList = response.data;
                    if ($scope.propertyList.length == 0) {
                      $scope.propertyList = [];

                      toastr.warning(
                        "As you are not associated with any property.So,you are allowed to add new tenant"
                      );
                      $scope.cancel();
                      $scope.cancel();
                    }
                    blockUI.stop();
                  } else {
                    $scope.propertyList = [];
                    toastr.warning(
                      "As you are not associated with any property.So,you are allowed to add new tenant"
                    );
                    $scope.cancel();
                    blockUI.stop();
                  }
                }
              );
              blockUI.stop();
            } else {
              toastr.warning(
                "No property found in the system for making request."
              );
              $scope.cancel();
              blockUI.stop();
            }
          };
          $scope.addTenant = function (
            tenant,
            check2,
            passwordStatus,
            propertyTenant = {}
          ) {
            // console.log("tenant",tenant);
            // console.log("check2",check2);
            // console.log("passwordStatus",passwordStatus);
            blockUI.start();
            tenant.passwordStatus = passwordStatus;
            tenant.property_id = propertyTenant.selected ? propertyTenant.selected._id : ""
            tenant.agentName =
              $localStorage.userData.firstname +
              " " +
              $localStorage.userData.lastname;
            tenant.invited_by = $localStorage.loggedInUserId;
            tenant.mobile_no = parseInt(tenant.mobile_no);
            if (
              $localStorage.userData.agency_id &&
              $localStorage.userData.agency_id.hasOwnProperty("_id") == true
            ) {
              tenant.agency_id = $localStorage.userData.agency_id._id;
            } else {
              tenant.agency_id = $localStorage.userData.agency_id;
            }
            if (check2 == true) {
              TenantService.newTenant().post(tenant, function (response) {
                if (response.code == 200) {
                  toastr.success("Successfully sent request to tenant");
                  $scope.propertyTenant.selected = undefined;
                  $scope.cancel();
                  blockUI.stop();
                } else if (response.code == 201) {
                  toastr.warning("Already user exists with this email id");
                  blockUI.stop();
                }
              });
            } else {
              toastr.warning("Please agree to the property Insync terms ");
              blockUI.stop();
            }
          };
        },
      }));
      modalInstance.result.then(
        function (selectedItem) { },
        function () { }
      );
    };
    $scope.propertyCnt = 0;
    $scope.requestCnt = 0;
    $scope.tenantCnt = 0;
    $scope.getStatisticsData = function () {
      var agencyId = "";
      if ($localStorage.userData.agency_id) {
        agencyId = $localStorage.userData.agency_id._id
          ? $localStorage.userData.agency_id._id
          : $localStorage.userData.agency_id;
      }
      var roleId = $localStorage.role_id ? $localStorage.role_id : "";
      var userId = $localStorage.loggedInUserId
        ? $localStorage.loggedInUserId
        : "";
      var postData = {
        agency_id: agencyId,
        request_by_role: roleId,
        user_id: userId,
      };
      TenantService.getStatisticsCount().post(postData, function (response) {
        if (response.code == 200) {
          $scope.propertyCnt = response.data.propertyCnt;
          $scope.requestCnt = response.data.requestCnt;
          $scope.tenantCnt = response.data.tenantCnt;
          blockUI.stop();
        } else {
          $scope.traderData = [];
          blockUI.stop();
        }
      });
    };
    $scope.getTraderList = function () {
      blockUI.start();
      // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
      $scope.imageUrl = baseUrl + "/user_image/";
      var obj = {};
      obj.user_id = $localStorage.userData._id;
      maintainService.getTraderOptionList().post(obj, function (response) {
        if (response.code == 200) {
          $scope.traderData = response.data;
          blockUI.stop();
        } else {
          $scope.traderData = [];
          blockUI.stop();
        }
      });
      // } else {
      //     $scope.traderData = [];
      //     blockUI.stop();
      // }
    };

    /**
     * Function is to open add new tenant modal
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */

    $scope.query = "";

    $scope.openAddMaintenance = function () {
      // $scope.getTraderList();
      var modalInstance = ($scope.model = $uibModal.open({
        animation: false,
        templateUrl: "/frontend/modules/maintenance/views/add.html",
        scope: $scope,
        controller: function ($uibModalInstance, $scope) {
          $scope.ok = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
          };

          $scope.getSelectedTrader = function (fullname, id) {
            if (fullname && id && fullname != "" && id != "") {
              $scope.query = fullname;
              console.log("$scope.query   ", $scope.query);
              $scope.maintenance.trader_id = id;
              $scope.showTraderSearch = false;
            }
          };

          $scope.getAgencyProperty = function () {
            blockUI.start();
            var obj = {};
            obj.request_by_id = $localStorage.loggedInUserId;
            obj.request_by_role = $localStorage.role_id;
            if (
              $localStorage.userData.agency_id != "undefined" &&
              $localStorage.userData.agency_id
            ) {
              if ($localStorage.userData.agency_id) {
                obj.agency_id = $localStorage.userData.agency_id;
              } else if ($localStorage.userData.agency_id._id) {
                obj.agency_id = $localStorage.userData.agency_id._id;
              }
            }
            // maintainService.maintenceProperty().post(obj, function (response) {
            //     if (response.code == 200) {
            //         $scope.propertyList = response.data;
            //         blockUI.stop();
            //     } else {
            //         $scope.propertyList = [];
            //         blockUI.stop();
            //     }
            // });
            blockUI.stop();
          };

          $scope.traderOnSelect = function (traderId) {
            //console.log('traderId',traderId);
            $scope.maintenance.trader_id = traderId;
            $model = traderId;
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
              blur: 250,
            },
            getterSetter: true,
          };
          // $scope.maintenance = {};
          $scope.newArray2 = [];
          $scope.onSelect = function ($item, $model, $label) {
            $scope.maintenance.trader_id = $item._id;
            $model = $item._id;
          };
          $scope.watcherInfo = function () {
            blockUI.start();
            var obj1 = {};
            // if ($localStorage.role_id == roleId.agent && $localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
            if (
              $localStorage.userData.agency_id &&
              $localStorage.userData.agency_id.hasOwnProperty("_id") == true
            ) {
              obj1.id = $localStorage.userData.agency_id._id;
            } else {
              obj1.id = $localStorage.userData.agency_id;
            }
            maintainService.getWatchersList().get(obj1, function (response) {
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
            // }
            blockUI.stop();
          };

          $scope.newArray3 = [];
          $scope.getPropertyAgreement = function (property_id) {
            if (property_id) {
              PropertyService.getPropertyAgreementDetails(property_id).get(
                function (response) {
                  if (response.code == 200) {
                    $scope.agreementDetails = response.data;
                    if (
                      $scope.agreementDetails &&
                      $scope.agreementDetails.tenants
                    ) {
                      $scope.default_watchers = _.map(
                        $scope.agreementDetails.tenants,
                        function (o) {
                          return _.pick(o, "users_id");
                        }
                      );
                      if ($scope.default_watchers) {
                        $scope.default_watchers.map(function (item) {
                          $scope.newArray3.push({ _id: item.users_id._id });
                        });
                      }
                    }
                  }
                }
              );
            }
          };

          $scope.get_default_watchers = function (property_data) {
            var user_obj = {};
            user_obj.user_id = property_data.created_by._id;
            userService.getUserActiveRole().post(user_obj, function (response) {
              if (response.code == 200) {
                $scope.roleInformation = response.data;
                $scope.roleInformation.map(function (item) {
                  if (item.role_id && item.role_id._id) {
                    if (item.role_id._id == roleId.agent) {
                      $scope.newArray3.push({
                        _id: property_data.created_by._id,
                      });
                    }
                  }
                });
              }
            });
            $scope.getPropertyAgreement(property_data._id);
          };

          $scope.getDate = function () {
            var d = moment().format("YYYY-MM-DD h:mm:ss a");
            var n = moment().format("MMM Do") + ", " + moment().format("LT");
            return n;
          };

          $scope.addressInitialize = function () {
            // $scope.maintenance.latitude = parseFloat(angular.element("#latitude").val());
            // $scope.maintenance.longitude = parseFloat(angular.element("#longitude").val());
            // $scope.getTraders();
            const input = document.getElementById("address1");
            const autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener("place_changed", () => {
              console.log("event called => ");
              const place = autocomplete.getPlace();
              console.log("place =====================> ", place);
              if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert(
                  "No details available for input: '" + place.name + "'"
                );
                return;
              }
              if (place.formatted_address) {
                $scope.maintenance.address = place.formatted_address;
              }
              if (place.geometry.location) {
                $scope.maintenance.latitude = place.geometry.location.lat();
                $scope.maintenance.longitude = place.geometry.location.lng();
              }
              $scope.getTraders();
            });
          };

          $scope.getTraders = function () {
            $scope.imageUrl = baseUrl + "/user_image/";
            console.log("getTraders    focus  ", $scope.maintenance);
            // && $scope.maintenance.category_id
            // && $scope.maintenance.category_id != ''
            if (
              $scope.maintenance.address &&
              $scope.maintenance.address != "" &&
              $scope.maintenance.request_type == 0
            ) {
              $scope.showTraderSearch = true;
              var obj = {};
              if (
                $scope.maintenance.address &&
                $scope.maintenance.address != ""
              )
                obj.address = $scope.maintenance.address;
              if (
                $scope.maintenance.category_id &&
                $scope.maintenance.category_id != ""
              )
                obj.categories_id = $scope.maintenance.category_id;

              if (obj) {
                maintainService
                  .provious_existing_traders()
                  .post(obj, function (response) {
                    if (response.code == 200 && response.data) {
                      $scope.traderData = response.data;
                      console.log("$scope.traderData   ", $scope.traderData);
                    }
                  });
              }
              var obj1 = {
                user_id: $localStorage.loggedInUserId,
              };
              if (
                $scope.maintenance.category_id &&
                $scope.maintenance.category_id != ""
              )
                obj1.categories_id = $scope.maintenance.category_id;
              maintainService
                .getSavedTradersList()
                .post(obj1, function (response) {
                  if (response.code == 200) {
                    $scope.traders = response.data;
                    console.log(
                      "response.data :: saved traders => ",
                      response.data
                    );
                  }
                  blockUI.stop();
                });
            }
          };

          $scope.debounce = function (func, wait, immediate) {
            var timeout;
            return function () {
              var context = this,
                args = arguments;
              var callNow = immediate && !timeout;
              clearTimeout(timeout);
              timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) {
                  func.apply(context, args);
                }
              }, wait);
              if (callNow) func.apply(context, args);
            };
          };

          $scope.callAPI = function (search) {
            blockUI.start();
            if (
              search &&
              search !== "" &&
              $scope.maintenance.category_id &&
              $scope.maintenance.category_id != ""
            ) {
              let obj2 = {
                categories_id: $scope.maintenance.category_id,
                searchtext: search,
              };
              maintainService
                .tradersListForMR()
                .post(obj2, function (trader_list) {
                  $scope.imageUrl = baseUrl + "/user_image/";
                  $scope.allTradersList = trader_list.data;
                  console.log(
                    "$scope.allTradersList    ",
                    $scope.allTradersList
                  );
                });
            } else {
              $scope.allTradersList = [];
            }
            blockUI.stop();
          };
          $scope.searchTextbox = $scope.debounce($scope.callAPI, 1000);

          $scope.addMR = function (data) {
            // console.log(data);
            // if ($localStorage.role_id != roleId.trader) {
            // if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
            $scope.loginLoading = true;
            // console.log('$scope.createMaintenanceForm.$invalid',$scope.createMaintenanceForm.$invalid);
            if ($scope.createMaintenanceForm.$invalid == false) {
              var obj = {};
              obj = data;
              obj.email = $localStorage.userData.email;
              console.log("obj.email  ", obj.email);
              obj.budget = obj.budget > 0 ? obj.budget : 0;
              obj.created_by = $localStorage.loggedInUserId;
              obj.created_by_role = $localStorage.role_id;
              obj.forwarded_by = $scope.forwardId;
              obj.budget = parseInt(obj.budget);
              obj.request_type = parseInt(data.request_type);

              if (obj.request_type == 1) {
                delete $scope.maintenance.trader_id;
              }
              // obj.due_date = new Date(data.due_date);

              if (data.dt != "") {
                obj.due_date = new Date(data.dt);
              } else {
                obj.due_date = " ";
              }
              if (
                $localStorage.userData.agency_id &&
                $localStorage.userData.agency_id.hasOwnProperty("_id") == true
              ) {
                obj.agency_id = $localStorage.userData.agency_id._id;
              } else {
                obj.agency_id = $localStorage.userData.agency_id;
              }

              // removed
              // $scope.getPropertyAgreement(data.property_id);
              // removed

              // obj.watchers_list = _.map($scope.newArray2, function (o) { return _.pick(o, '_id'); });
              // $scope.watchers_list = obj.watchers_list.concat($scope.newArray3);
              // obj.watchers_list = $scope.watchers_list;

              obj.watchers_list = [];
              obj.watchers_list.push({ _id: $localStorage.loggedInUserId });

              // if ((obj.watchers_list).length == $scope.newArray2.length) {
              var images = obj.images;
              obj.images = [];

              if (
                data.latitude &&
                data.longitude &&
                data.latitude != "" &&
                data.longitude != ""
              ) {
              } else {
                obj.latitude = 0;
                obj.longitude = 0;
              }

              // maintainService.addMaintenance().post(obj, function (response) {
              maintainService.addMR().post(obj, function (response) {
                if (response.code == 200) {
                  // if($localStorage.role_id != roleId.tenant)
                  var message = {
                    from: $localStorage.loggedInUserId,
                    to: response.data._id,
                    textMsg: "Sent",
                    time: $scope.getDate(),
                    maintenanceId: response.data._id,
                    is_status: true,
                  };

                  socket.emit("maintenanceGroupMessageSent", message);

                  obj.images = images;
                  $scope.isTaderPickFromSave = false;
                  $scope.maintenance.property_id = undefined;
                  $scope.uploadFiles(obj, response.data._id);
                  $scope.loginLoading = false;
                } else {
                  $scope.traderList = [];
                  $scope.loginLoading = false;
                }
              });
              // }
            } else {
              toastr.error("Please fill the form completely");
              $scope.loginLoading = false;
            }
            // } else {
            //     toastr.error("First associate yourself with any agency");
            // }
            // } else {
            //     toastr.warning("You do not have access permission");
            // }
          };

          $scope.uploadFiles = function (files, data) {
            if (files.images && files.images.length) {
              blockUI.start();
              for (var i = 0; i < files.images.length; i++) {
                var file = files.images[i];
                if (!file.$error) {
                  Upload.upload({
                    url: baseUrl + "/api/uploadMaintenanceImages",
                    data: {
                      _id: data,
                      file: file,
                    },
                  }).then(
                    function (response) {
                      if (response && response.status == 200) {
                        toastr.success(
                          "Successfully added maintenance request"
                        );
                        $scope.cancel();
                        $scope.maintenanceListing();
                        blockUI.stop();
                      } else if (response.data.code == 400) {
                        toastr.error("Failed to upload images");
                        blockUI.stop();
                      }
                    },
                    null,
                    function (evt) { }
                  );
                }
              }
            } else {
              toastr.success("Successfully added maintenance request");
              $scope.cancel();
              $scope.maintenanceListing();
              blockUI.stop();
            }
          };
          $scope.RemovePhoto = function (index) {
            //Find the record using Index from Array.
            var name = $scope.maintenance.images[index];
            $scope.maintenance.images.splice(index, 1);
            if ($scope.maintenance.images.length == 0) {
              delete $scope.maintenance.images;
            }
          };
          $scope.removeWatcher = function (key) {
            $scope.newArray2.splice(key, 1);
          };
          /**
           * Function is for maintenance req calender
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
            showWeeks: true,
          };

          $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: "yy",
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(),
            startingDay: 1,
          };

          // Disable weekend selection
          function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return (
              mode === "day" && (date.getDay() === 0 || date.getDay() === 6)
            );
          }

          $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate
              ? null
              : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
          };

          $scope.toggleMin();

          $scope.open1 = function () {
            // console.log("called");
            $scope.popup1.opened = true;
          };
          $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
          };

          $scope.formats = [
            "dd-MMM-yyyy",
            "yyyy/MM/dd",
            "dd.MM.yyyy",
            "shortDate",
          ];
          $scope.format = $scope.formats[0];
          $scope.altInputFormats = ["M!/d!/yyyy"];

          $scope.popup1 = {
            opened: false,
          };
          function getDayClass(data) {
            var date = data.date,
              mode = data.mode;
            if (mode === "day") {
              var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

              for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(
                  0,
                  0,
                  0,
                  0
                );

                if (dayToCheck === currentDay) {
                  return $scope.events[i].status;
                }
              }
            }
          }
          $scope.toggleMin = function () {
            $scope.dateOptions.minDate = $scope.dateOptions.minDate
              ? null
              : new Date();
          };

          $scope.toggleMin();
        },
      }));
      modalInstance.result.then(
        function (selectedItem) { },
        function () { }
      );
    };
    $scope.isTaderPickFromSave = false;
    // $scope.traders = [];
    $scope.selectTraderFromSaved = function () {
      //console.log("called");
      // blockUI.start();
      $scope.isTaderPickFromSave =
        $scope.isTaderPickFromSave == false ? true : false;
      // if ($scope.isTaderPickFromSave) {
      //     var obj = {
      //         "user_id": $localStorage.loggedInUserId
      //     };
      //     maintainService.traderList().post(obj, function (response) {
      //         if (response.code == 200) {
      //             $scope.traders = response.data;
      //         }
      //         blockUI.stop();
      //     });
      // } else {
      //     blockUI.stop();
      // }
      if ($scope.isTaderPickFromSave) {
        var obj = {
          user_id: $localStorage.loggedInUserId,
        };
        maintainService.getSavedTradersList().post(obj, function (response) {
          if (response.code == 200) {
            $scope.traders = response.data;
            console.log("response.data :: saved traders => ", response.data);
          }
          blockUI.stop();
        });
      } else {
        blockUI.stop();
      }
    };
    $scope.dateStatus;
    $scope.checkDueDate = function (date) {
      var toDay = moment().format("YYYY MM DD");
      var date = moment(date).format("YYYY MM DD");
      if (date < toDay) {
        $scope.dateStatus = true;
      } else {
        $scope.dateStatus = false;
      }
    };
    $scope.propertyImage = baseUrl + "/property_image/";
    $scope.userImageUrl = baseUrl + "/user_image/";

    $scope.getUserEmail = (function () {
      $scope.imageUrl = baseUrl + "/user_image/";
      $rootScope.userEmail = $localStorage.userData.email;
      $rootScope.firstName = $localStorage.loggedInfirstname;
      $rootScope.lastName = $localStorage.loggedInlastname;
      $rootScope.image = $localStorage.userData.image;
    })();
    $scope.dashboardInitialize = function () {
      console.log("dashboard function => ", $localStorage.role_id);
      $scope.tenantView_ = false;
      $scope.agentView_ = false;
      $scope.agencyOwner_ = false;
      $scope.ownerView_ = false;
      $rootScope.isProd = false;
      $scope.selectedAgent = "";
      $scope.filterAgentValue = "";
      $scope.filteredAgent =
        $localStorage.superLoginfirstname && $localStorage.superLoginlastname
          ? $localStorage.loggedInfirstname +
          " " +
          $localStorage.loggedInlastname
          : "Select Agent";
      var currentURL = "",
        currentURL = window.location.hostname;
      if (currentURL === "portal.ownly.com.au") {
        console.log("if part => ");
        $rootScope.isProd = true;
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=G-1BR9CM0WHN";
        document.head.prepend(script);
      } else {
        console.log("else part => ");
        $rootScope.isProd = false;
      }

      if ($localStorage.role_id == roleId.tenant) {
        $scope.tenantView_ = true;
      }
      if ($localStorage.role_id == roleId.owner) {
        $scope.ownerView_ = true;
      }
      if (
        $localStorage.role_id == roleId.agent ||
        $localStorage.role_id == roleId.ownAgency
      ) {
        $scope.agentView_ = true;
      }
      if (
        $localStorage.role_id == roleId.ownAgency ||
        $localStorage.superLoginRoleId == roleId.ownAgency
      ) {
        $scope.agencyOwner_ = true;
        $scope.getMyAgents($scope.filterAgentValue);
      }

      $scope.getAgentDashboardProperty();
      $scope.getNoticeBoard();
      $scope.getStatisticsData();
      $scope.load_reveal_contact_number();
    };

    $scope.load_reveal_contact_number = function () {
      var user_obj = {};
      user_obj.userId = $localStorage.userData._id;
      userService.getUserById().post(user_obj, function (user_response) {
        if (user_response.code == 200) {
          if (
            user_response.data &&
            user_response.data.reveal_contact_number &&
            user_response.data.reveal_contact_number != ""
          ) {
            $scope.reveal_contact_number = parseInt(
              user_response.data.reveal_contact_number
            );
          }
        }
      });
    };

    $scope.$emit("content.changed");
    $scope.$broadcast("content.changed");
    /*
            function to get notice board according to agency id and role id
        **/
    $scope.noticeBoardList = [];
    $scope.imageUrl = baseUrl + "/property_image/";
    $scope.getNoticeBoard = function () {
      var agencyId;
      var roleId = $localStorage.role_id;
      if ($localStorage.userData.agency_id && roleId) {
        agencyId = $localStorage.userData.agency_id._id
          ? $localStorage.userData.agency_id._id
          : $localStorage.userData.agency_id;
        var postData = {
          agency_id: agencyId,
          user_id: $localStorage.loggedInUserId,
          role_id: $localStorage.role_id,
        };
        userService.getUserNoticeBoard().post(postData, function (response) {
          if (response.code == 200) {
            $scope.noticeBoardList = response.data;
          }
        });
      }
    };
    // Open Agent dropdown
    $scope.selectAgentDropdown = function () {
      console.log("select agent dropdown => ");
      // let y = document.getElementsByClassName('dropdown-open')
      // let el = y[0]
      // el.style.display = "block"
      angular.element("#agentDropdown").show();
    };
    // Hide Agent dropdown
    $scope.hideAgentDropdown = function () {
      angular.element("#agentDropdown").hide();
    };
    // Filter agents
    // $scope.filterAgents = function () {
    //     console.log('filter agents => ');
    // }
    // call service to get all my agents for logged in agency principle user
    $scope.getMyAgents = function (filterAgentValue) {
      $scope.agentList = [];
      console.log("my agents function => ", filterAgentValue);
      console.log(
        "$localStorage.userData.agency_id => ",
        $localStorage.userData.agency_id
      );
      if (
        $localStorage.userData.agency_id ||
        $localStorage.userData.agency_id._id
      ) {
        AgentService.getMyAgentList().post(
          {
            agency_id: $localStorage.userData.agency_id._id
              ? $localStorage.userData.agency_id._id
              : $localStorage.userData.agency_id,
            firstname: filterAgentValue,
          },
          function (response) {
            console.log(
              "response :: check for my agent`s list => ",
              response.data
            );
            console.log("$localStorage.userData => ", $localStorage.userData);
            console.log(
              "$localStorage.superLoginUserData => ",
              $localStorage.superLoginUserData
            );
            if (response.code == 200) {
              // $scope.agentList = response.data;
              response.data.map((ele) => {
                console.log("ele :: agent => ", ele);
                if ($localStorage.superLoginUserId) {
                  if (ele._id !== $localStorage.superLoginUserId) {
                    $scope.agentList.push(ele);
                  }
                } else {
                  if (ele._id !== $localStorage.userData._id) {
                    $scope.agentList.push(ele);
                  }
                }
              });
              // blockUI.stop();
            } else {
              $scope.agentList = [];
              // blockUI.stop();
            }
            if (!filterAgentValue) {
              if ($scope.agentList && $scope.agentList.length > 0) {
                if ($localStorage.superLoginUserData) {
                  $scope.agentList.unshift($localStorage.superLoginUserData);
                } else {
                  $scope.agentList.unshift($localStorage.userData);
                }
              }
            }
          }
        );
      }
    };

    //service to call property listing of this agent
    $scope.getAgentDashboardProperty = function () {
      var agencyId = "";
      if ($localStorage.userData.agency_id) {
        agencyId = $localStorage.userData.agency_id._id
          ? $localStorage.userData.agency_id._id
          : $localStorage.userData.agency_id;
      }
      var userId = $localStorage.loggedInUserId;
      var roleId = $localStorage.role_id ? $localStorage.role_id : "";
      var postData = {
        agency_id: agencyId,
        request_by_role: roleId,
        user_id: userId,
      };
      $scope.propertyList = new Array();
      PropertyService.getPropertyListing().post(postData, function (response) {
        if (response.code == 200) {
          $scope.propertyList = response.data;
          blockUI.stop();
        } else {
          blockUI.stop();
        }
      });
    };

    /**
     * Switch To Agent Profile
     * Need to store Agent data in localstorage
     */
    $scope.switchToAgentRole = function (agent) {
      console.log("agent :: agent selected => ", agent);
      console.log("selectedAgent => ", $scope.selectedAgent);
      // get agent's detail using getUsersDetails api
      if (agent._id) {
        angular.element("#agentDropdown").hide();
        $scope.filterAgentValue = "";
        $scope.getMyAgents($scope.filterAgentValue);
        if (
          agent.firstname == $localStorage.superLoginfirstname &&
          agent.lastname == $localStorage.superLoginlastname
        ) {
          console.log("Agency owner user selected => ");
          $scope.filteredAgent = "Select Agent";
          $localStorage.loggedInUserId = $localStorage.superLoginUserId;
          $localStorage.loggedInfirstname = $localStorage.superLoginfirstname;
          $localStorage.loggedInlastname = $localStorage.superLoginlastname;
          $localStorage.role_id = $localStorage.superLoginRoleId;
          $localStorage.userData = $localStorage.superLoginUserData;
          setTimeout(() => {
            $localStorage.superLoginUserId = "";
            $localStorage.superLoginfirstname = "";
            $localStorage.superLoginlastname = "";
            $localStorage.superLoginRoleId = "";
            $localStorage.superLoginUserData = "";
            location.reload();
          }, 1500);
        } else {
          console.log("agent user selected => ");
          $scope.filteredAgent = agent.firstname + " " + agent.lastname;
          $scope.masterRoleAgent = true;
          userService
            .getUserById()
            .post({ userId: agent._id }, function (user_response) {
              if (user_response.code == 200) {
                console.log(
                  "user_response :: check for agent user data => ",
                  user_response
                );

                console.log(
                  " $localStorage.loggedInUserId => ",
                  $localStorage.loggedInUserId
                );
                console.log(
                  "user_response.data.groups.role_id => ",
                  user_response.data.groups.role_id
                );
                console.log("roleId.agent => ", roleId.agent);
                if (user_response.data.groups.role_id != roleId.agent) {
                  console.log("not agent => ");
                  const data = {
                    user_id: user_response.data._id,
                    role_id: roleId.agent,
                  };
                  $http
                    .post(baseUrl + "/api/getUserPermission", data)
                    .success(function (response) {
                      console.log("response :: user permission=> ", response);
                      if (response.code === 200) {
                        $scope.masterRoleAgent = false;
                        $rootScope.permission = response.data;
                        $localStorage.permission = $rootScope.permission;
                        // toastr.success('Successfully switched your role');
                        $scope.changeProfile();
                        // location.reload();
                        // blockUI.stop();
                      } else if (response.code === 400) {
                        console.log("400 err => ");
                      }
                    });
                }

                // $localStorage.userLoggedIn = true;
                // $localStorage.isLoggedIn = true;
                // $localStorage.role_id = ($localStorage.role_id) ? $localStorage.role_id : res.data.roleInfo.role_id;
                // $localStorage.loggedInUserId = res.data.userInfo._id;
                // $localStorage.loggedInfirstname = res.data.userInfo.firstname;
                // $localStorage.loggedInlastname = res.data.userInfo.lastname;
                // $localStorage.userData = res.data.userInfo;
                // $rootScope.userName = res.data.userInfo.firstname + ' ' + res.data.userInfo.lastname;
                // $localStorage.token = res.token;

                $localStorage.superLoginUserId = $localStorage.superLoginUserId
                  ? $localStorage.superLoginUserId
                  : $localStorage.loggedInUserId;
                $localStorage.superLoginfirstname =
                  $localStorage.superLoginfirstname
                    ? $localStorage.superLoginfirstname
                    : $localStorage.loggedInfirstname;
                $localStorage.superLoginlastname =
                  $localStorage.superLoginlastname
                    ? $localStorage.superLoginlastname
                    : $localStorage.loggedInlastname;
                $localStorage.superLoginRoleId = $localStorage.superLoginRoleId
                  ? $localStorage.superLoginRoleId
                  : $localStorage.role_id;
                $localStorage.superLoginUserData =
                  $localStorage.superLoginUserData
                    ? $localStorage.superLoginUserData
                    : $localStorage.userData;
                setTimeout(() => {
                  console.log(
                    " $scope.masterRoleAgent => ",
                    $scope.masterRoleAgent
                  );
                  console.log("set time out function => ");
                  $localStorage.loggedInUserId = user_response.data._id;
                  $localStorage.loggedInfirstname =
                    user_response.data.firstname;
                  $localStorage.loggedInlastname = user_response.data.lastname;
                  $localStorage.role_id = $scope.masterRoleAgent
                    ? user_response.data.groups.role_id
                    : roleId.agent;
                  $localStorage.userData = user_response.data;
                  roleId = $localStorage.role_id ? $localStorage.role_id : "";
                  location.reload();
                }, 1500);

                // if (user_response.data && user_response.data.agency_id && user_response.data.agency_id._id) {
                //     $rootScope.step2.agency_id = user_response.data.agency_id._id;
                // }
              }
            });
        }
      }
    };

    /**
     * Function is use to logout
     * @access private
     * @return json
     * Created by
     * @smartData Enterprises (I) Ltd
     * Created Date 3-Aug-2017
     */
    $scope.navOptioninit = function () {
      if ($state.current.name == "dashboard") {
        $rootScope.navBarOptionSelected = "Home";
      }
    };
    /**
     * Function is use get role permission of user
     * @access private
     * @return json
     * Created by
     * @smartData Enterprises (I) Ltd
     * Created Date 3-Aug-2017
     */
    $scope.getUserRolePermission = (function () {
      $rootScope.permission = $localStorage.permission;
      $rootScope.current_role_id = $localStorage.role_id;
      $rootScope.roles_exist = roleId;
      $rootScope.isAssociatedWithAgency = $localStorage.userData.agency_id
        ? true
        : false;
    })();
    /**
     * Function is use to
     * @access private
     * @return json
     * Created by
     * @smartData Enterprises (I) Ltd
     * Created Date 3-Aug-2017
     */
    $scope.navSelect = function (navSelected) {
      // console.log(navSelected, "navSelected");
      $localStorage.userData.routeState = navSelected;
      $rootScope.navBarOptionSelected = navSelected;
    };

    $scope.pageRefreshNav = (function () {
      $rootScope.navBarOptionSelected = $localStorage.userData.routeState
        ? $localStorage.userData.routeState
        : "Home";
    })();
    /**
     * Function is use to
     * @access private
     * @return json
     * Created by
     * @smartData Enterprises (I) Ltd
     * Created Date 3-Aug-2017
     */
    $scope.logOut = function () {
      var obj = {};
      swal(
        {
          title: "Are you sure?",
          text: "You want to Sign Out?",
          // imageUrl: '/assets/images/logo_color_blue.png',
          imageUrl: "/assets/images/logo-dark.png",
          imageWidth: 10,
          imageHeight: 10,
          maxHeight: 45,
          showCancelButton: true,
          // confirmButtonColor: "#0099ff",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          imageAlt: "Custom image",
          closeOnConfirm: true,
        },
        function () {
          var obj1 = {};
          obj1.role_id = $localStorage.role_id;
          obj1.user_id = $localStorage.loggedInUserId;
          blockUI.stop();
          // $state.go('login');

          $localStorage.isLoggedIn;
          $rootScope.propertyFunction = false;
          obj.user_id = $localStorage.loggedInUserId
            ? $localStorage.loggedInUserId
            : $localStorage.loggedInUserId._id;
          PropertyService.lastRoleLogged().post(obj1, function (response) {
            if (response.code == 200) {
              PropertyService.userLogOut().post(obj, function (response) {
                if (response.code == 200) {
                  //$state.go('login');
                  $rootScope.isLoggedIn = false;
                  toastr.success("Successfully logged out");
                  $localStorage.userLoggedIn = false;
                  $localStorage.loggedInUserId = "";
                  $localStorage.loggedInfirstname = "";
                  $localStorage.loggedInlastname = "";
                  $localStorage.permission = "";
                  $localStorage.role_id = "";
                  $localStorage.userData = "";
                  $localStorage.isLoggedIn = false;
                  $localStorage.token = "";
                  $rootScope.role = "";
                  $localStorage.defaultRoleId = "";

                  $localStorage.superLoginUserId = "";
                  $localStorage.superLoginfirstname = "";
                  $localStorage.superLoginlastname = "";
                  $localStorage.superLoginRoleId = "";
                  $localStorage.superLoginUserData = "";

                  // $window.localStorage.clear();

                  // $location.path('/login');
                  blockUI.stop();
                } else {
                  //toastr.info('Server is busy to process this request');
                  $rootScope.isLoggedIn = false;
                  toastr.success("Successfully logged out");
                  $localStorage.userLoggedIn = false;
                  $localStorage.loggedInUserId = "";
                  $localStorage.loggedInfirstname = "";
                  $localStorage.loggedInlastname = "";
                  $localStorage.permission = "";
                  $localStorage.role_id = "";
                  $localStorage.userData = "";
                  $localStorage.isLoggedIn = false;
                  $localStorage.token = "";
                  $rootScope.role = "";
                  $localStorage.defaultRoleId = "";
                  blockUI.stop();
                }
              });
            }
            // else {
            //     toastr.info('Server is busy to process this request');
            //     blockUI.stop();
            // }
            $state.go("login");
          });
          blockUI.stop();
        }
      );
    };
    /**
     * Function is used to handel carousel click event
     * @access private
     * @return json
     * Created by
     * @smartData Enterprises (I) Ltd
     * Created Date 8-Sept-2017
     */

    $scope.carouselClickedRight = function () {
      if ($scope.counter == 1) {
        $scope.counter = $scope.counter + 1;
        $scope.carouselFlag1 = "active";
        $scope.carouselFlag2 = " ";
        $scope.carouselFlag3 = " ";
      }
      if ($scope.counter == 2) {
        $scope.counter = $scope.counter + 1;
        $scope.carouselFlag2 = "active";
        $scope.carouselFlag1 = " ";
        $scope.carouselFlag3 = " ";
      }
      if ($scope.counter == 3) {
        $scope.counter = $scope.counter + 1;
        $scope.carouselFlag3 = "active";
        $scope.carouselFlag1 = " ";
        $scope.carouselFlag2 = " ";
      }
      if ($scope.counter > 3) {
        $scope.counter1 = 1;
      }
    };
    $scope.carouselClickedLeft = function () {
      if ($scope.counter1 == 3) {
        $scope.counter1 = $scope.counter1 + 1;
        $scope.carouselFlag1 = "active";
        $scope.carouselFlag2 = " ";
        $scope.carouselFlag3 = " ";
      }
      if ($scope.counter1 == 1) {
        $scope.counter1 = $scope.counter1 + 1;
        $scope.carouselFlag2 = "active";
        $scope.carouselFlag1 = " ";
        $scope.carouselFlag3 = " ";
      }
      if ($scope.counter1 == 2) {
        $scope.counter1 = $scope.counter1 + 1;
        $scope.carouselFlag3 = "active";
        $scope.carouselFlag1 = " ";
        $scope.carouselFlag2 = " ";
      }
      if ($scope.counter1 > 3) {
        $scope.counter = 1;
      }
    };

    $scope.navigateToHome = function () {
      $state.go("home");
    };
    // go to trader listing
    $scope.goToTraderListing = function () {
      $state.go("trader_listing");
    };
    // go to dashboard
    $scope.goToDashboardFromNav = function () {
      $state.go("dashboard");
    };
    //go to property listing page
    $scope.goToPropertyListingFromNav = function () {
      $state.go("propertyListing");
    };
    //go to my agency page
    $scope.goToMyAgencyFromNav = function () {
      $state.go("agencyProfile");
    };
    //go to agent listing page
    $scope.goToAgentListingFromNav = function () {
      $state.go("agents_listing");
    };
    //go to agency hub page
    $scope.goToAgencyHubFromNav = function () {
      $state.go("agencyhub");
    };
    //go to strata user listing page
    $scope.goToStrataUserListingFromNav = function () {
      $state.go("Starta_user_listing");
    };
    //go to strata user listing page
    $scope.goToTenantListingFromNav = function () {
      $state.go("tenants_listing");
    };
    //go to  message page
    $scope.goToChatScreen = function () {
      $state.go("chat");
    };
    //go to maintenance listing page
    $scope.goToMaintenanceListing = function () {
      $state.go("maintance_listing");
    };
    //go to file listing page
    $scope.goToFileListing = function () {
      $state.go("fileListing");
    };
    //go to dispute listing page
    $scope.goToDisputeListing = function () {
      $state.go("dispute");
    };
    //go to agreement listing page
    $scope.goToAgreementListing = function () {
      $state.go("agreement_listing");
    };
    //go to setting page
    $scope.goToSettingPage = function () {
      $state.go("setting");
    };

    //go to message section of chat screen
    $scope.goToMsgChatScreen = function (num) {
      // if(num && num>0){
      $rootScope.navBarOptionSelected = "TradMessagesers";
      $localStorage.userData.routeState = "TradMessagesers";
      $location.path("/chatScreen/" + num);
      // }
    };

    /**
     * Function is use to navigate to add property page
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.addProperty = function () {
      $state.go("createProperty");
    };
    /**
     * Function is to get user role
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.userRoleInfo = function () {
      var obj = {};
      $scope.roleInfo = [];
      $scope.imageUrl = baseUrl + "/user_image/";
      obj.user_id = $localStorage.loggedInUserId;
      $scope.fName = $localStorage.loggedInfirstname;
      $scope.lName = $localStorage.loggedInlastname;
      $scope.userImage = $localStorage.userData.image;
      // userService.userRoles().post(obj, function (response) {
      //     if (response.code == 200) {
      //         $scope.roleInfo = response.data.finalArr;
      //     }
      // });
      userService.getUserActiveRole().post(obj, function (response) {
        if (response.code == 200) {
          $scope.roleInfo = response.data;
        }
      });
    };
    /**
     * Function is to switch role & permission
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.switchRolePermission = function (id) {
      blockUI.start();
      $localStorage.role_id = id;
      var data = {
        user_id: $localStorage.loggedInUserId,
        role_id: id,
      };
      if (
        $localStorage.role_id != "undefined" &&
        $localStorage.loggedInUserId != "undefined" &&
        $localStorage.userLoggedIn == true
      ) {
        $http
          .post(baseUrl + "/api/getUserPermission", data)
          .success(function (response) {
            if (response.code === 200) {
              $rootScope.permission = response.data;
              $localStorage.permission = $rootScope.permission;
              toastr.success("Successfully switched your role");
              $scope.changeProfile();
              location.reload();
              blockUI.stop();
              angular.element("#myModal").hide();
            }
          });
      }
      blockUI.stop();
    };
    /**
     * Function is change profile according to role id
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.changeProfile = function () {
      // console.log("roleId", roleId);
      // console.log("$localStorage.role_id", $localStorage.role_id);
      $scope.profile;
      if (
        $stateParams.id == $localStorage.loggedInUserId ||
        ($localStorage.role_id == roleId.ownAgency &&
          $state.current.name == "agencyProfile")
      ) {
        $rootScope.navBarOptionSelected = " ";
        $localStorage.userData.routeState = " ";
      }
      $scope.isAgency =
        $localStorage.role_id == roleId.ownAgency ? true : false;
      if ($localStorage.role_id == roleId.trader) {
        $scope.profile = "#!/trader_profile/" + $localStorage.loggedInUserId;
        //  $scope.navSelect('trader_listing');
      } else if ($localStorage.role_id == roleId.agent) {
        $scope.profile = "#!/profile/" + $localStorage.loggedInUserId;
        //$scope.navSelect('agents_listing');
      } else if ($localStorage.role_id == roleId.ownAgency) {
        $scope.profile = "#!/agency_profile/";
      } else if ($localStorage.role_id == roleId.runStrataManagementCompany) {
        $scope.profile = "#!/agency_profile/";
        // $scope.profile = "#!/agency_profile/" + $localStorage.loggedInUserId;
      } else if ($localStorage.role_id == roleId.tenant) {
        $scope.profile = "#!/tenant_profile/" + $localStorage.loggedInUserId;
      } else if ($localStorage.role_id == roleId.owner) {
        $scope.profile = "#!/owner_profile/" + $localStorage.loggedInUserId;
      } else if (
        $localStorage.role_id == roleId.workForStrataManagementCompany
      ) {
        $scope.profile = "#!/profile/" + $localStorage.loggedInUserId;
      }
    };
    $scope.unreadNotificationList = [];
    $scope.getUserNotification = function () {
      var obj = {};
      $scope.unread_count = 0;

      obj.user_id = $localStorage.loggedInUserId;
      $scope.imageUrl = baseUrl + "/user_image/";
      userService.userNotifications().post(obj, function (response) {
        if (response.code == 200) {
          $scope.notificationData = response.data;
          $scope.newNotificationCount = 0;
          $scope.notificationData.map(function (item) {
            if (item.to_users) {
              var unbold_count = 0;
              var flag = 0;
              item.to_users.map(function (user) {
                if (
                  user.users_id === $localStorage.loggedInUserId &&
                  user.is_read == false
                ) {
                  $scope.unreadNotificationList.push(item);

                  flag = 1;
                } else {
                  unbold_count = 1;
                }
              });
              if (flag === 1) {
                $scope.newNotificationCount += 1;
              }
              if (unbold_count == 1) {
                item.unbold = "yes";
              } else {
                item.unbold = "no";
              }
            }
          });
        }
      });
    };
    $rootScope.messageData = [];
    $scope.getUserMessages = function () {
      var obj = {};
      obj.user_id = $localStorage.loggedInUserId;
      $scope.imageUrl = baseUrl + "/user_image/";
      userService.messageList().post(obj, function (response) {
        if (response.code == 200) {
          $rootScope.messageData = response.data;
          // console.log("called", response);
        }
      });
    };

    /**
     * Used to get maintenance listing
     * Date
     * @smartData Enterprises (I) Ltd
     * @access private
     * @return json
     */

    $scope.maintenanceListing = function () {
      $scope.TodayDate = moment().format("YYYY MM DD");
      $scope.maintenanceClass = "nav nav-tabs";
      blockUI.start();
      var postData = {
        request_by_id: $localStorage.loggedInUserId,
        request_by_role: $localStorage.role_id,
      };

      if (
        $localStorage.userData.agency_id !== "" &&
        $localStorage.userData.agency_id
      ) {
        var agencyId = "";
        agencyId = $localStorage.userData.agency_id._id
          ? $localStorage.userData.agency_id._id
          : $localStorage.userData.agency_id;
        postData.agency_id = agencyId;
      }

      PropertyService.maintenanceList().post(postData, function (response) {
        if (response.code == 200) {
          $scope.gobalMaintenanceList = response.data;

          // filter data without sent
          $scope.maintainList = _.filter(
            $scope.gobalMaintenanceList,
            function (item) {
              return item.req_status != MaintenanceState.sent;
            }
          );
          //find only 4 from that list
          $scope.maintainList = $scope.maintainList.slice(0, 4);
          console.log("maintainList  ==> ", $scope.maintainList);
          angular.forEach($scope.maintainList, function (value, key) {
            var diff1 = moment(value.due_date).format("YYYY MM DD");
            value.difference = moment(diff1, "YYYY MM DD").diff(
              moment($scope.TodayDate, "YYYY MM DD"),
              "days"
            );
          });
          blockUI.stop();
        } else {
          $scope.traderList = [];
          blockUI.stop();
        }
      });
      blockUI.stop();
    };
    $scope.goToSettings = function () {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $rootScope.navBarOptionSelected = "Settings";
      $localStorage.userData.routeState = "Settings";
      $state.go("setting");
    };
    $scope.goToGlobalSearch = function (key) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $location.path("/global_search/" + key);
    };
    /**
     * Function is to go to maintaenance detail page
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */
    $scope.maintainenceDetail = function (id) {
      $rootScope.navBarOptionSelected = "Maintenance";
      $localStorage.userData.routeState = "Maintenance";
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $location.path("maintance_detail/" + id);
    };
    $scope.maintainenceRedirectDetail = function (data) {
      $rootScope.navBarOptionSelected = "Maintenance";
      $localStorage.userData.routeState = "Maintenance";
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      if(data.created_by._id == $localStorage.loggedInUserId){
        $location.path("job_detail/" + data.id);
      } else {
        $location.path("maintance_detail/" + data.id);
      }
    };

    $scope.goToJobDetail = function (id) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $location.path("job_detail/" + id);
    };

    $scope.agreementDetail = function (id) {
      $localStorage.scollOnChat = 1;
      $rootScope.navBarOptionSelected = "Agreements";
      $localStorage.userData.routeState = "Agreements";
      $location.path("detail_agreement/" + id);
    };

    // $scope.tcal = [
    //     [
    //         {
    //             title: 'Event1',
    //             start: new Date(2018, 1, 4)//'2015-02-04'
    //         },
    //         {
    //             title: 'Event2',
    //             start: new Date(2018, 1, 5) //'2015-02-05'
    //         }
    //     ],
    //     [
    //         {
    //             title: 'Future',
    //             start: new Date(2018, month+1, 1) //'2015-02-05'
    //         }
    //     ]
    //   ];

    $scope.fromCountToTenantList = function () {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $rootScope.navBarOptionSelected = "tenants_listing";
      $localStorage.userData.routeState = "tenants_listing";
      $location.path("/tenants_listing");
    };
    $scope.fromCountToMaintenanceList = function () {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $rootScope.navBarOptionSelected = "Maintenance";
      $localStorage.userData.routeState = "Maintenance";
      $location.path("/maintance_listing");
    };
    $scope.myPropertyToOwnerProfile = function (id) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $rootScope.navBarOptionSelected = "owner";
      $localStorage.userData.routeState = "owner";
      $location.path("/owner_profile/" + id);
    };
    //to mark notification as read & go to respective page
    $scope.goToNotificationRelatedPage = function (notification) {
      var obj = {};
      obj.user_id = $localStorage.loggedInUserId;
      obj.notification_type = $localStorage.loggedInUserId;

      if (notification.module == 1) {
        obj.notification_type = "tenants";
        obj.notification_type_id = notification.from_user._id;
      } else if (notification.module == 2) {
        obj.notification_type = "maintenance";
        obj.notification_type_id = notification.maintenence_id;
      } else if (notification.module == 3) {
        obj.notification_type = "agreements";
        obj.notification_type_id = notification.agreement_id;
      } else if (notification.module == 4) {
        obj.notification_type = "noticeboard";
        obj.notification_type_id = notification.noticeboard_id;
      } else if (notification.module == 6) {
        obj.notification_type = "dispute";
        obj.notification_type_id = notification.dispute_id;
      } else if (notification.module == 8) {
        obj.notification_type = "application";
        obj.notification_type_id = notification.application_id;
      }

      userService.notificationRead().post(obj, function (response) { });

      if (notification.module == 1) {
        $location.path("/tenant_profile/" + notification.from_user._id);
        $rootScope.navBarOptionSelected = "tenants_listing";
        $localStorage.userData.routeState = "tenants_listing";
      } else if (notification.module == 2) {
        if (notification.subject == "Quote") {
          console.log("quotes => ");
          $location.path(
            "/quote_detail/" +
            notification.maintenence_id +
            "/" +
            notification.from_user._id
          );
        } else {
          $location.path("/maintance_detail/" + notification.maintenence_id);
        }
        $rootScope.navBarOptionSelected = "Maintenance";
        $localStorage.userData.routeState = "Maintenance";
      } else if (notification.module == 3) {
        $location.path("/detail_agreement/" + notification.agreement_id);
        $rootScope.navBarOptionSelected = "Agreements";
        $localStorage.userData.routeState = "Agreements";
      } else if (notification.module == 4) {
        $location.path("/dispute_details/" + notification.dispute_id);
        $rootScope.navBarOptionSelected = "Disputes";
        $localStorage.userData.routeState = "Disputes";
      } else if (notification.module == 6) {
        $location.path("/notice_board_detail/" + notification.noticeboard_id);
        $rootScope.navBarOptionSelected = "noticeboard";
        $localStorage.userData.routeState = "noticeboard";
      } else if (notification.module == 8) {
        $location.path("/view_application/" + notification.application_id);
        $rootScope.navBarOptionSelected = "Properties";
        $localStorage.userData.routeState = "Properties";
      }
    };

    //Mark all notification except message as read
    $scope.readNotification = function () {
      var obj = {};
      obj.user_id = $localStorage.loggedInUserId;
      userService.notificationRead().post(obj, function (response) {
        if (response.code == 200) {
          $scope.notificationData = response.data;
          $scope.notificationData = [];
        }
      });
    };

    //Go to dispute detail page
    $scope.goToDisputeDetail = function (id) {
      $location.path("/dispute_details/" + id);
      $rootScope.navBarOptionSelected = "Disputes";
      $localStorage.userData.routeState = "Disputes";
    };

    //Notification separate Page
    $scope.goToNotificationSeparatePage = function () {
      $rootScope.navBarOptionSelected = " ";
      $localStorage.userData.routeState = " ";
      $state.go("notificationList");
    };

    $scope.goToUserProfilePage = function (user_id, user_role_id) {
      // console.log('role');
      // console.log(roleId);
      // console.log('user_id');
      // console.log(user_id);
      // console.log('user_role_id');
      // console.log(user_role_id);
      if (roleId.trader == user_role_id) {
        $location.path("/trader_profile/" + user_id);
      } else if (roleId.agent == user_role_id) {
        $location.path("/profile/" + user_id);
      } else if (roleId.ownAgency == user_role_id) {
        $location.path("/agency_profile/" + user_id);
      } else if (roleId.tenant == user_role_id) {
        $location.path("/tenant_profile/" + user_id);
      } else if (roroleIdle.owner == user_role_id) {
        $location.path("/owner_profile/" + user_id);
      }
    };
  }

  /**
   * global search controller
   *
   */
  angular.module("SYNC").controller("globalSearchCtrl", globalSearchCtrl);
  globalSearchCtrl.$inject = [
    "$scope",
    "$stateParams",
    "$rootScope",
    "$http",
    "$timeout",
    "$window",
    "$location",
    "$sce",
    "Utility",
    "Crud",
    "localStorageService",
    "AlertService",
    "Flash",
    "$uibModal",
    "blockUI",
    "PropertyService",
    "userService",
    "$state",
    "$localStorage",
    "AgentService",
  ];
  function globalSearchCtrl(
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $timeout,
    $window,
    $location,
    $sce,
    Utility,
    Crud,
    localStorageService,
    AlertService,
    Flash,
    $uibModal,
    blockUI,
    PropertyService,
    userService,
    $state,
    $localStorage,
    AgentService
  ) {
    $scope.propertyImageUrl = baseUrl + "/property_image/";
    $scope.userImageUrl = baseUrl + "/user_image/";
    $scope.fileImageUrl = baseUrl + "/document/";
    $scope.traderRoleId = roleId.trader;
    $scope.tenantRoleId = roleId.tenant;
    $scope.agentRoleId = roleId.agent;
    $scope.agencyRoleId = roleId.ownAgency;
    $scope.runStrataRoleId = roleId.runStrataManagementCompany;
    $scope.workStrataRoleId = roleId.workForStrataManagementCompany;
    $scope.pagination = {
      current: 1,
    };
    $scope.pageChanged = function (page) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    };
    $scope.showdiv = function (data) {
      $scope.type = data;
    };
    //calling service to get the data
    $scope.globalSearch = function () {
      blockUI.start();
      $scope.type = "0";
      $scope.key = $stateParams.key;
      $rootScope.navBarOptionSelected = " ";
      $localStorage.userData.routeState = " ";

      var agencyId = "";
      if ($localStorage.userData.agency_id) {
        agencyId = $localStorage.userData.agency_id._id
          ? $localStorage.userData.agency_id._id
          : $localStorage.userData.agency_id;
      }
      var userId = $localStorage.loggedInUserId;
      var roleId = $localStorage.role_id ? $localStorage.role_id : "";

      if ($scope.key) {
        var postData = {
          text: $scope.key ? String($scope.key) : "",
          agency_id: agencyId,
          request_by_role: roleId,
          user_id: userId,
        };
        $scope.text = $scope.key;
        PropertyService.advanceSearch().post(postData, function (response) {
          $scope.gobalArr;
          // console.log('response');
          // console.log(response);
          $scope.propertyData = response.data.propertyData;
          $scope.traderCount = response.data.traderCount;
          $scope.tenantCount = response.data.tenantCount;
          $scope.allUserData = response.data.userData;
          $scope.gobalArr = $scope.propertyData.concat($scope.allUserData);
        });
      } else {
        toastr.warning("Please enter the key for searching the related data");
      }
      blockUI.stop();
    };
    // go the the searched user's profile
    $scope.goToUserProfile = function (groupData, agencyId) {
      // console.log("called");
      blockUI.start();
      if (groupData.role_id == roleId.trader) {
        $location.path("/trader_profile/" + groupData.user_id);
      } else if (groupData.role_id == roleId.agent) {
        $location.path("/profile/" + groupData.user_id);
      } else if (groupData.role_id == roleId.ownAgency && agencyId) {
        $location.path("/agency_profile/" + agencyId);
      } else if (groupData.role_id == roleId.tenant) {
        $location.path("/tenant_profile/" + groupData.user_id);
      } else if (groupData.role_id == roleId.owner) {
        $location.path("/owner_profile/" + groupData.user_id);
      }
      blockUI.stop();
    };
    /**
     * Function is to sort the search data
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */
    $scope.setOrderProperty = function (propertyName) {
      if ($scope.orderProperty === propertyName) {
        $scope.orderProperty = "-" + propertyName;
      } else if ($scope.orderProperty === "-" + propertyName) {
        $scope.orderProperty = propertyName;
      } else {
        $scope.orderProperty = propertyName;
      }
    };
  }
})();
