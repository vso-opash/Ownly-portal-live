/**
 * Super Angular Controller
 * @author
 * @created 10 August
 */
(function () {
  angular
    .module("SYNC", ["ui.select", "ui-select-infinity"])
    .controller("MaintenanceCtrl", MaintenanceCtrl);
  MaintenanceCtrl.$inject = [
    "$state",
    "$scope",
    "$localStorage",
    "$rootScope",
    "$uibModal",
    "$timeout",
    "Upload",
    "$http",
    "$filter",
    "$window",
    "$location",
    "$stateParams",
    "SweetAlert",
    "permissions",
    "APP_CONST",
    "Flash",
    "AlertService",
    "toastr",
    "blockUI",
    "blockUIConfig",
    "$anchorScroll",
    "maintainService",
    "PropertyService",
    "userService",
    "TenantService",
    "socket",
    "Crud",
    "localStorageService",
  ];

  function MaintenanceCtrl(
    $state,
    $scope,
    $localStorage,
    $rootScope,
    $uibModal,
    $timeout,
    Upload,
    $http,
    $filter,
    $window,
    $location,
    $stateParams,
    SweetAlert,
    permissions,
    APP_CONST,
    Flash,
    AlertService,
    toastr,
    blockUI,
    blockUIConfig,
    $anchorScroll,
    maintainService,
    PropertyService,
    userService,
    TenantService,
    socket
  ) {
    $scope.user = [];
    $scope.chat = {
      generalMsg: "",
    };
    $scope.search_text = "";
    $scope.created_logged_in_both = "no";
    $scope.propertyImageUrl = baseUrl + "/property_image/";
    $scope.imageUrl = baseUrl + "/user_image/";
    //console.log("moment()",moment().add(1,"months"));
    $scope.choosenFiles = [];
    $scope.isAgentOwnerTenant =
      $localStorage.role_id == roleId.agent ||
        $localStorage.role_id == roleId.tenant ||
        $localStorage.role_id == roleId.owner ||
        $localStorage.role_id == roleId.ownAgency
        ? true
        : false;
    $scope.roleId = roleId;
    $scope.userRoleId = $localStorage.role_id;
    $scope.first_name = $localStorage.loggedInfirstname;
    $scope.last_name = $localStorage.loggedInlastname;
    $scope.baseUrl = baseUrl;
    $scope.isAgent =
      $localStorage.role_id == roleId.agent ||
        $localStorage.role_id == roleId.ownAgency
        ? true
        : false;
    $scope.isTenant = $localStorage.role_id == roleId.tenant ? true : false;
    $scope.isOwner = $localStorage.role_id == roleId.owner ? true : false;
    $scope.isTrader = $localStorage.role_id == roleId.trader ? true : false;
    $scope.notRequiredTrader = $scope.isAgent == true ? true : false;
    // $scope.isAgency =
    $scope.agencyRoleId = roleId.ownAgency;
    /* Rating section start from here */
    $scope.rate = 5;
    $scope.max = 5;
    $scope.isReadonly = false;
    $scope.fileImageUrl = baseUrl + "/document/";
    $scope.proposalfileImageUrl = baseUrl + "/proposals/";
    $scope.hoveringOver = function (value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };

    $scope.selected_trader_id = "";

    $scope.ratingStates = [
      { stateOn: "glyphicon-ok-sign", stateOff: "glyphicon-ok-circle" },
      { stateOn: "glyphicon-star", stateOff: "glyphicon-star-empty" },
    ];
    /* Rating section start from here */
    $scope.filePopup = [false];
    $scope.maintNavBarOptionSelected = "Sent";
    $rootScope.navBarOptionSelected = "Maintenance";
    $scope.maintNavList = "All";
    $scope.orderProperty = "";
    $scope.maintenanceImageUrl = baseUrl + "/maintenance/";
    $scope.userImageUrl = baseUrl + "/user_image/";
    $scope.proposalImageUrl = baseUrl + "/proposals";
    $scope.newArray2 = [];
    $scope.gobalMaintenanceList = [];
    $scope.pagination = {
      current: 1,
    };
    $scope.maintenance = {};
    $scope.counterProposal = {};
    $scope.complete = {};
    var _selected;
    $scope.selected = undefined;
    $scope.myDate = new Date();
    $scope.isOpen = false;
    $scope.loggedInUserId = $localStorage.loggedInUserId;
    $scope.selectedTraderId = $stateParams.trader_id;
    $scope.lastCounterProposalCreatedBy = "";
    $scope.category_listing = [];
    $scope.curPage = 1;
    $scope.traders = [];
    $scope.showTraderSearch = false;
    $scope.query = "";
    /**
     * Function is maintenance request init function
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.maintenanceInit = function () {
      // $scope.getTraderList();
      // $scope.getTraders();
      $scope.category_list();
    };

    /**
     * Function to Format phone number
     */
    $scope.formatPhoneNumber = function (data) {
      var output = [
        data.slice(0, 4),
        " ",
        data.slice(4, 7),
        " ",
        data.slice(7),
      ].join("");
      console.log("formatted number=>", output);
      return output;
    };

    /**
     * Function is maintenance request init function
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.cancelMaintenanceRequest = function () {
      var maintenanceId = $stateParams.id;
      if (maintenanceId) {
        swal(
          {
            title: "Are you sure?",
            text: "You want to Cancel this mainenance request?",
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
            maintainService
              .cancelRequest(maintenanceId)
              .get(function (response) {
                if (response.code == 200) {
                  $scope.openChat(maintenanceId, 16);
                  toastr.success(response.message);
                  $state.go("maintance_listing");
                } else {
                  toastr.error(response.message);
                }
              });
          }
        );
      }
    };
    $scope.removeWatcher = function (userId) {
      if (userId) {
        swal(
          {
            title: "Are you sure?",
            text: "You want to remove user from watchers list ?",
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
            // console.log('watcher removed called');
            var postData = {
              maintenanceId: $stateParams.id,
              userId: userId,
            };
            maintainService.removeWatcher().post(postData, function (response) {
              if (response.code == 200) {
                toastr.success(response.message);
                $scope.maintenanceDetail();
              } else {
                toastr.error(response.message);
              }
            });
          }
        );
      }
    };
    /**
     * Used to approved counter proposal request
     * Date
     * @smartData Enterprises (I) Ltd
     * @access private
     * @return json
     */
    $scope.approveCounterProposal = function (
      proposalId,
      prop_price,
      maintenance_id,
      due_date
    ) {
      // console.log('approved called');
      swal(
        {
          title: "Are you sure?",
          text: "You want to Approve this counter proposal request?",
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
          var postData = {
            proposal_id: proposalId,
            is_proposal_accept: true,
            price: parseInt(prop_price),
            due_date: due_date,
            accepted_or_declined_by_role: $localStorage.role_id,
          };

          if ($scope.detail.request_type == 1) {
            postData.trader_id = $localStorage.loggedInUserId;
          }

          maintainService
            .approvedCounterProposal()
            .post(postData, function (response) {
              if (response.code == 200) {
                $scope.openChat(maintenance_id, 11);
                toastr.success(response.message);
                socket.emit("maintenanceGroupChatHistory", {
                  maintenanceId: $stateParams.id,
                });
                $scope.openChat(maintenance_id, 2);
              } else {
                toastr.error(response.message);
              }
              $scope.maintenanceDetail();
            });
        }
      );
    };
    /**
     * Used to decline counter proposal request
     * Date
     * @smartData Enterprises (I) Ltd
     * @access private
     * @return json
     */
    $scope.declineCounterProposal = function (proposalId, maintenance_id) {
      swal(
        {
          title: "Are you sure?",
          text: "You want decline this counter proposal request?",
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
          var postData = {
            proposal_id: proposalId,
            is_proposal_accept: false,
            accepted_or_declined_by_role: $localStorage.role_id,
          };

          maintainService
            .declineCounterProposal()
            .post(postData, function (response) {
              if (response.code == 200) {
                $scope.openChat(maintenance_id, 12);
                toastr.success(response.message);
                socket.emit("maintenanceGroupChatHistory", {
                  maintenanceId: $stateParams.id,
                });
              } else {
                toastr.error(response.message);
              }
              $scope.maintenanceDetail();
            });
        }
      );
    };
    /**
     * Used to decline counter proposal request
     * Date
     * @smartData Enterprises (I) Ltd
     * @access private
     * @return json
     */
    $scope.approveJobConfirmation = function (maintenanceId) {
      swal(
        {
          title: "Are you sure?",
          text: "You want approve this job completion request?",
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
          var postData = {
            maintenence_id: maintenanceId,
            job_close_confirmation: 2,
          };

          maintainService
            .approveJobConfirmation()
            .post(postData, function (response) {
              if (response.code == 200) {
                $scope.openChat(maintenanceId, 13);
                toastr.success(response.message);
                socket.emit("maintenanceGroupChatHistory", {
                  maintenanceId: $stateParams.id,
                });
              } else {
                toastr.error(response.message);
              }
              $scope.maintenanceDetail();
            });
        }
      );
    };
    /**
     * Used to decline counter proposal request
     * Date
     * @smartData Enterprises (I) Ltd
     * @access private
     * @return json
     */
    $scope.declineJobConfirmation = function (maintenanceId) {
      swal(
        {
          title: "Are you sure?",
          text: "You want decline this job completion request?",
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
          var postData = {
            maintenence_id: maintenanceId,
            job_close_confirmation: 3,
          };

          maintainService
            .declineJobConfirmation()
            .post(postData, function (response) {
              if (response.code == 200) {
                $scope.openChat(maintenanceId, 14);
                toastr.success(response.message);
                socket.emit("maintenanceGroupChatHistory", {
                  maintenanceId: $stateParams.id,
                });
              } else {
                toastr.error(response.message);
              }
              $scope.maintenanceDetail();
            });
        }
      );
    };
    /**
     * Function is to get traders list
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.getTraderList = function () {
      // if ($localStorage.userData.agency_id != 'undefined' && ($localStorage.userData).hasOwnProperty('agency_id')) {
      $scope.imageUrl = baseUrl + "/user_image/";
      var obj = {};
      obj.user_id = $localStorage.userData._id;
      maintainService.getTraderOptionList().post(obj, function (response) {
        // console.log("response.data      ", response.data);
        if (response.code == 200) {
          $scope.traderData = response.data;
        } else {
          $scope.traderData = [];
        }
      });
      // } else {
      //     $scope.traderData = [];

      // }
    };
    /**
     * Used to get maintenance listing
     * Date
     * @smartData Enterprises (I) Ltd
     * @access private
     * @return json
     */

    $scope.maintenanceListing = function () {
      $scope.traderView = false;
      $scope.tenantView = false;
      $scope.agentView = false;
      $scope.agencyView = false;
      $scope.ownerView = false;
      $scope.TodayDate = moment().format("YYYY MM DD");
      $scope.maintenanceClass = "nav nav-tabs";
      var obj = {};

      obj.request_by_role = $localStorage.role_id;
      obj.request_by_id = $localStorage.loggedInUserId;

      if ($localStorage.userData.agency_id) {
        obj.agency_id = $localStorage.userData.agency_id._id
          ? $localStorage.userData.agency_id._id
          : $localStorage.userData.agency_id;
      }
      if ($localStorage.role_id == roleId.trader) {
        $scope.traderView = true;
      }
      if ($localStorage.role_id == roleId.tenant) {
        $scope.tenantView = true;
      }
      if ($localStorage.role_id == roleId.owner) {
        $scope.ownerView = true;
      }
      if (
        $localStorage.role_id == roleId.agent ||
        $localStorage.role_id == roleId.ownAgency
      ) {
        $scope.agentView = true;
      }
      // if ($localStorage.role_id == roleId.ownAgency) {
      //     $scope.agencyView = true;
      // }
      // if ($localStorage.role_id == roleId.tenant) {
      //     if($localStorage.userData.agency_id !== ""){
      //         if(($localStorage.userData.agency_id)!="" ){
      //             obj.agency_id = $localStorage.userData.agency_id;

      //         }else if(($localStorage.userData.agency_id._id)!=""){
      //             obj.agency_id = $localStorage.userData.agency_id._id;
      //         }
      //        }
      // }
      // else if ($localStorage.role_id == roleId.agent && $localStorage.userData.agency_id != '') {
      //   if($localStorage.userData.agency_id !== ""){
      //     if(($localStorage.userData.agency_id)!="" ){
      //         obj.agency_id = $localStorage.userData.agency_id;

      //     }else if(($localStorage.userData.agency_id._id)!=""){
      //         obj.agency_id = $localStorage.userData.agency_id._id;
      //     }
      //    }
      // }
      maintainService.maintenanceList().post(obj, function (response) {
        if (response.code == 200) {
          $scope.gobalMaintenanceList = response.data;
          // console.log("globall  ");
          // console.log($scope.gobalMaintenanceList);

          $scope.maintainList = $scope.gobalMaintenanceList;

          // $scope.maintainList = _.filter($scope.gobalMaintenanceList, function (item) {
          // console.log("item   ", item);
          // return ((item.created_by && item.created_by.id && item.created_by._id == $localStorage.userData._id) || (item.property_id && item.property_id.owned_by && item.property_id.owned_by == $localStorage.userData._id) || item.is_forward === true)
          // });

          angular.forEach($scope.maintainList, function (value, key) {
            if (
              value.mr_last_chat &&
              value.mr_last_chat != null &&
              value.mr_last_chat.from &&
              value.mr_last_chat.from._id
            ) {
              value.lastCounterProposalCreatedBy_listing =
                value.mr_last_chat.from._id;
            }

            var diff1 = moment(value.due_date).format("YYYY MM DD");
            value.difference = moment(diff1, "YYYY MM DD").diff(
              moment($scope.TodayDate, "YYYY MM DD"),
              "days"
            );
            if (value.images.length > 0 && value.images[0].path) {
              if (
                value.images[0].path.includes(".xlsx") ||
                value.images[0].path.includes(".xlsx")
              ) {
                value.images[0].document_type = "excel";
              } else if (
                value.images[0].path.includes(".txt") ||
                value.images[0].path.includes(".doc")
              ) {
                value.images[0].document_type = "doc";
              } else if (value.images[0].path.includes(".pdf")) {
                value.images[0].document_type = "pdf";
              } else if (value.images[0].path.includes(".ppt")) {
                value.images[0].document_type = "ppt";
              }
            }
          });

          // _.filter($scope.gobalMaintenanceList, function(item){ return item.req_status === MaintenanceState.sent});
        } else {
          $scope.traderList = [];
        }

        var obj1 = obj;
        obj1.public_status = "yes";
        maintainService.maintenanceList().post(obj1, function (response) {
          if (response.code == 200) {
            $scope.public_mr_list = _.filter(response.data, function (item) {
              return (
                item.request_type &&
                item.request_type == 1 &&
                (item.trader_id == "" || !item.trader_id)
              );
            });
            $scope.public_mr_count = $scope.public_mr_list.length;
          }
        });
      });
    };

    /**
     * Function is to open add new tenant modal
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.openAddMaintenance = function () {
      var role = $localStorage.role_id;
      // if (role == roleId.agent || role == roleId.owner || role == roleId.tenant || role == roleId.ownAgency) {
      var modalInstance = ($scope.model = $uibModal.open({
        animation: false,
        templateUrl: "/frontend/modules/maintenance/views/add.html",
        scope: $scope,
        controller: function ($uibModalInstance, $scope) {
          $scope.query = "";
          $scope.ok = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
          };

          $scope.getSelectedTrader = function (fullname, id) {
            if (fullname && id && fullname != "" && id != "") {
              $scope.query = fullname;
              // console.log("$scope.query   ", $scope.query);
              $scope.maintenance.trader_id = id;
              $scope.showTraderSearch = false;
            }
          };

          $scope.getAgencyProperty = function () {
            var obj = {};
            obj.request_by_id = $localStorage.loggedInUserId;
            obj.request_by_role = $localStorage.role_id;
            if (
              $localStorage.userData.agency_id != "undefined" &&
              $localStorage.userData.agency_id
            ) {
              obj.agency_id = $localStorage.userData.agency_id._id
                ? $localStorage.userData.agency_id._id
                : $localStorage.userData.agency_id;
            }
            maintainService.maintenceProperty().post(obj, function (response) {
              if (response.code == 200) {
                $scope.propertyList = response.data;
                // if ($scope.propertyList.length == 0 && response.data.length == $scope.propertyList.length) {
                // if (response.data.length == $scope.propertyList.length) {
                //     $state.go('maintance_listing');
                //     toastr.warning("You are not associated with any property to add new maintenance request");
                //     $scope.cancel();
                // }
              } else {
                $state.go("maintance_listing");
                toastr.warning(
                  "You are not associated with any property to add new maintenance request"
                );

                $scope.cancel();
              }
            });
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
          $scope.onSelect = function ($item, $model, $label) {
            $scope.maintenance.trader_id = $item._id;
            $model = $item._id;
          };
          $scope.traderOnSelect = function (traderId) {
            //console.log('traderId',traderId);
            $scope.maintenance.trader_id = traderId;
            $model = traderId;
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
                  $scope.allTradersList = trader_list.data;
                  console.log(
                    "$scope.allTradersList    ",
                    $scope.allTradersList
                  );
                });
            }
            blockUI.stop();
          };
          $scope.searchTextbox = $scope.debounce($scope.callAPI, 1000);

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

          // $scope.saveMaintenanceRequest = function (data) {
          $scope.addMR = function (data) {
            console.log("mr rqst => ", data);
            444;
            // console.log(data);
            // if ($localStorage.role_id != roleId.trader) {
            // if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {

            // console.log('$scope.createMaintenanceForm.$invalid',$scope.createMaintenanceForm.$invalid);
            if ($scope.createMaintenanceForm.$invalid == false) {
              console.log("if :: invalid => ");
              $scope.loginLoading = true;
              var obj = {};
              obj = data;
              obj.email = $localStorage.userData.email;
              // console.log("obj.email  ", obj.email);
              if (obj.budget) {
                obj.budget = obj.budget > 0 ? obj.budget : 0;
                obj.budget = parseInt(obj.budget);
              }
              obj.created_by = $localStorage.loggedInUserId;
              obj.created_by_role = $localStorage.role_id;
              obj.forwarded_by = $scope.forwardId;
              obj.request_type = parseInt(data.request_type);
              if (data && data.trader_id && data.trader_id.data) {
                console.log("dropdown => ");
                obj.trader_id = data.trader_id._id;
              } else {
                console.log("previous trader => ");
                obj.trader_id = data.trader_id;
              }
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
              obj.watchers_list.push({
                users_id: $localStorage.loggedInUserId,
              });

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
              console.log("obj :: 1 => ", obj);
              // maintainService.addMaintenance().post(obj, function (response) {
              maintainService.addMR().post(obj, function (response) {
                console.log("response :: addMR=> ", response);
                if (response.code == 200) {
                  // if($localStorage.role_id != roleId.tenant)
                  $scope.openChat(response.data._id, 20);
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
              console.log("error :: else => ");
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
                      } else if (response.data.code == 400) {
                        toastr.error("Failed to upload images");
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
        },
      }));
      modalInstance.result.then(
        function (selectedItem) { },
        function () { }
      );
      // } else {
      //     toastr.warning("You do not have access permission");

      // }
    };

    $scope.openEditMaintenance = function (firstname, lastname, trader_id) {
      console.log(
        "$scope.detail    ",
        $scope.detail,
        "  ",
        firstname,
        lastname
      );
      var mr_details = $scope.detail;
      mr_details.trader_first_name = firstname;
      mr_details.trader_last_name = lastname;
      mr_details.trader_id = trader_id;

      var role = $localStorage.role_id;
      var modalInstance = ($scope.model = $uibModal.open({
        animation: false,
        templateUrl: "/frontend/modules/maintenance/views/edit.html",
        scope: $scope,
        controller: function ($uibModalInstance, $scope) {
          $scope.ok = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.mr_details = mr_details;
          $scope.mr_details.category_id = mr_details.categories_id[0]._id;
          $scope.mr_details.dt = new Date(mr_details.due_date);

          var CurrentDate = new Date();
          var GivenDate = new Date($scope.mr_details.dt);

          if (GivenDate >= CurrentDate) {
            $scope.mr_details.dt = new Date($scope.mr_details.dt);
          } else {
            $scope.mr_details.dt = "";
          }

          console.log("$scope.mr_details.dt  ", $scope.mr_details.dt);

          $scope.getSelectedTrader = function (fullname, id) {
            if (fullname && id && fullname != "" && id != "") {
              $scope.query = fullname;
              // console.log("$scope.query   ", $scope.query);
              $scope.mr_details.trader_id = id;
              $scope.showTraderSearch = false;
            }
          };

          $scope.maintenanceImageUrl = baseUrl + "/maintenance/";

          $scope.getAgencyProperty = function () {
            var obj = {};
            obj.request_by_id = $localStorage.loggedInUserId;
            obj.request_by_role = $localStorage.role_id;
            if (
              $localStorage.userData.agency_id != "undefined" &&
              $localStorage.userData.agency_id
            ) {
              obj.agency_id = $localStorage.userData.agency_id._id
                ? $localStorage.userData.agency_id._id
                : $localStorage.userData.agency_id;
            }
            maintainService.maintenceProperty().post(obj, function (response) {
              if (response.code == 200) {
                $scope.propertyList = response.data;
                // if ($scope.propertyList.length == 0 && response.data.length == $scope.propertyList.length) {
                //     $state.go('maintance_listing');
                //     toastr.warning("You are not associated with any property to add new maintenance request");
                //     $scope.cancel();
                // }
              } else {
                $state.go("maintance_listing");
                toastr.warning(
                  "You are not associated with any property to add new maintenance request"
                );

                $scope.cancel();
              }
            });
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

          // $scope.saveMaintenanceRequest = function (data) {
          $scope.addMR = function (data) {
            console.log("another function => ");
            // console.log(data);
            // if ($localStorage.role_id != roleId.trader) {
            // if ($localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
            $scope.loginLoading = true;
            if ($scope.createMaintenanceForm.$invalid == false) {
              var obj = {};
              obj = data;
              obj.address = $scope.mr_details.address;
              obj.latitude = $scope.mr_details.latitude;
              obj.longitude = $scope.mr_details.longitude;
              obj.request_type = $scope.mr_details.request_type;
              obj.email = $localStorage.userData.email;
              obj.budget = obj.budget > 0 ? obj.budget : 0;
              obj.created_by = $localStorage.loggedInUserId;
              obj.created_by_role = $localStorage.role_id;
              obj.forwarded_by = $scope.forwardId;
              obj.budget = parseInt(obj.budget);
              obj.request_type = parseInt(data.request_type);

              if (obj.request_type == 1) {
                delete $scope.mr_details.trader_id;
              }
              // obj.due_date = new Date(data.due_date);

              if (data.dt != "") {
                obj.due_date = new Date(data.dt);
              } else {
                obj.due_date = " ";
              }
              //  removed for now
              // if ((($localStorage.userData.agency_id).hasOwnProperty('_id') == true)) {
              //     obj.agency_id = $localStorage.userData.agency_id._id;
              // } else {
              //     obj.agency_id = $localStorage.userData.agency_id;
              // }
              // if (data.property_id) {
              //     $scope.getPropertyAgreement(data.property_id);
              // }

              // obj.watchers_list = _.map($scope.newArray2, function (o) { return _.pick(o, '_id'); });
              // $scope.watchers_list = obj.watchers_list.concat($scope.newArray3);
              // obj.watchers_list = $scope.watchers_list;

              obj.watchers_list = [];
              obj.watchers_list.push({
                users_id: $localStorage.loggedInUserId,
              });

              // if ((obj.watchers_list).length == $scope.newArray2.length) {
              var images = obj.new_images;
              obj.images = obj.images;

              if (
                obj.latitude &&
                obj.longitude &&
                obj.latitude != "" &&
                obj.longitude != ""
              ) {
              } else {
                obj.latitude = 0;
                obj.longitude = 0;
              }

              console.log("obj :: 2 => ", obj);
              // maintainService.addMaintenance().post(obj, function (response) {
              maintainService.addMR().post(obj, function (response) {
                if (response.code == 200) {
                  // if($localStorage.role_id != roleId.tenant)
                  $scope.openChat(response.data._id, 20);
                  obj.images = images;
                  $scope.isTaderPickFromSave = false;
                  $scope.mr_details.property_id = undefined;
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
                        toastr.success("Successfully sent maintenance request");
                        $scope.cancel();
                        $scope.maintenanceListing();
                      } else if (response.data.code == 400) {
                        toastr.error("Failed to upload images");
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
            }
          };
          $scope.RemovePhoto = function (index) {
            //Find the record using Index from Array.
            var name = $scope.mr_details.images[index];
            $scope.mr_details.images.splice(index, 1);
            if ($scope.mr_details.images.length == 0) {
              delete $scope.mr_details.images;
            }
          };
          $scope.RemoveAddedPhoto = function (index) {
            //Find the record using Index from Array.
            var name = $scope.mr_details.new_images[index];
            $scope.mr_details.new_images.splice(index, 1);
            if ($scope.mr_details.new_images.length == 0) {
              delete $scope.mr_details.new_images;
            }
          };
          $scope.removeWatcher = function (key) {
            $scope.newArray2.splice(key, 1);
          };
        },
      }));
      modalInstance.result.then(
        function (selectedItem) { },
        function () { }
      );
      // } else {
      //     toastr.warning("You do not have access permission");

      // }
    };

    /**
     * Function is to initialize the variables - add maintenance
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.maintenanceInitialize = function () {
      $scope.maintenance = {};
      $scope.isTaderPickFromSave = false;
      $scope.newArray2 = [];
    };
    /**
     * Function is to be called on page click
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.pageChanged = function (page) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    };
    /**
     * Function is to filter out the maintenance listing based on tab clicks
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.acceptedMaintenance = function (value, navSelected) {
      $scope.search_text = "";
      $scope.public_list = {};
      $scope.maintNavList = navSelected;
      if (value == "sent" || value == "all") {
        $scope.maintainList = $scope.gobalMaintenanceList;
        // $scope.maintainList = _.filter($scope.gobalMaintenanceList, function (item) {
        // return item.is_forward === true
        // return ((item.created_by && item.created_by.id && item.created_by._id == $localStorage.userData._id) || (item.property_id && item.property_id.owned_by && item.property_id.owned_by == $localStorage.userData._id) || item.is_forward === true)
        // });
      } else if (value == "accepted") {
        $scope.maintainList = _.filter(
          $scope.gobalMaintenanceList,
          function (item) {
            return item.req_status === MaintenanceState.accepted;
          }
        );
      } else if (value == "booked") {
        $scope.maintainList = _.filter(
          $scope.gobalMaintenanceList,
          function (item) {
            return item.req_status === MaintenanceState.booked;
          }
        );
      } else if (value == "completed") {
        $scope.maintainList = _.filter(
          $scope.gobalMaintenanceList,
          function (item) {
            return item.req_status === MaintenanceState.completed;
          }
        );
      } else if (value == "closed") {
        $scope.maintainList = _.filter(
          $scope.gobalMaintenanceList,
          function (item) {
            return item.req_status === MaintenanceState.closed;
          }
        );
      } else if (value == "showAll") {
        $scope.maintainList = $scope.gobalMaintenanceList;
      } else if (value == "new request") {
        $scope.maintainList = _.filter(
          $scope.gobalMaintenanceList,
          function (item) {
            return item.req_status === MaintenanceState.sent;
          }
        );
      } else if (value == "in progress" || value == "on progress") {
        $scope.maintainList = _.filter(
          $scope.gobalMaintenanceList,
          function (item) {
            return (
              item.req_status != MaintenanceState.sent &&
              item.req_status != MaintenanceState.completed &&
              item.req_status != MaintenanceState.closed
            );
          }
        );
      } else if (value == "public") {
        var obj = {};
        obj.request_by_role = $localStorage.role_id;
        obj.request_by_id = $localStorage.loggedInUserId;
        obj.public_status = "yes";
        if ($localStorage.userData.agency_id) {
          obj.agency_id = $localStorage.userData.agency_id._id
            ? $localStorage.userData.agency_id._id
            : $localStorage.userData.agency_id;
        }

        maintainService.maintenanceList().post(obj, function (response) {
          if (response.code == 200) {
            $scope.maintainList = $scope.maintainList1 = response.data;

            angular.forEach($scope.maintainList1, function (value, key) {
              if (
                value.mr_last_chat &&
                value.mr_last_chat != null &&
                value.mr_last_chat.from &&
                value.mr_last_chat.from._id
              ) {
                value.lastCounterProposalCreatedBy_listing =
                  value.mr_last_chat.from._id;
              }

              var diff1 = moment(value.due_date).format("YYYY MM DD");
              value.difference = moment(diff1, "YYYY MM DD").diff(
                moment($scope.TodayDate, "YYYY MM DD"),
                "days"
              );
              if (value.images.length > 0 && value.images[0].path) {
                if (
                  value.images[0].path.includes(".xlsx") ||
                  value.images[0].path.includes(".xlsx")
                ) {
                  value.images[0].document_type = "excel";
                } else if (
                  value.images[0].path.includes(".txt") ||
                  value.images[0].path.includes(".doc")
                ) {
                  value.images[0].document_type = "doc";
                } else if (value.images[0].path.includes(".pdf")) {
                  value.images[0].document_type = "pdf";
                } else if (value.images[0].path.includes(".ppt")) {
                  value.images[0].document_type = "ppt";
                }
              }
            });
          }
          console.log($localStorage.role_id + "     " + roleId.trader);
          $scope.public_list = $scope.maintainList;

          if ($localStorage.role_id != roleId.trader) {
            $scope.maintainList = _.filter(
              $scope.maintainList1,
              function (item) {
                var apply_count = 0;
                item.maintentenance_counter_proposals.map(function (
                  item1,
                  key
                ) {
                  if (item1.proposal_type == "apply") apply_count += 1;
                });
                if (apply_count > 0) {
                  item.apply_count = apply_count;
                  return item;
                } else {
                  return item;
                }
              }
            );
          }
        });
        $scope.public_mr_count = $scope.public_mr_list.length;
      } else if (value == "quotes") {
        $scope.public_list = {};
        var obj = {};
        obj.request_by_role = $localStorage.role_id;
        obj.request_by_id = $localStorage.loggedInUserId;
        obj.public_status = "yes";
        if ($localStorage.userData.agency_id) {
          obj.agency_id = $localStorage.userData.agency_id._id
            ? $localStorage.userData.agency_id._id
            : $localStorage.userData.agency_id;
        }

        maintainService.maintenanceList().post(obj, function (response) {
          if (response.code == 200) {
            $scope.maintainList1 = response.data;

            angular.forEach($scope.maintainList1, function (value, key) {
              if (
                value.mr_last_chat &&
                value.mr_last_chat != null &&
                value.mr_last_chat.from &&
                value.mr_last_chat.from._id
              ) {
                value.lastCounterProposalCreatedBy_listing =
                  value.mr_last_chat.from._id;
              }

              var diff1 = moment(value.due_date).format("YYYY MM DD");
              value.difference = moment(diff1, "YYYY MM DD").diff(
                moment($scope.TodayDate, "YYYY MM DD"),
                "days"
              );
              if (value.images.length > 0 && value.images[0].path) {
                if (
                  value.images[0].path.includes(".xlsx") ||
                  value.images[0].path.includes(".xlsx")
                ) {
                  value.images[0].document_type = "excel";
                } else if (
                  value.images[0].path.includes(".txt") ||
                  value.images[0].path.includes(".doc")
                ) {
                  value.images[0].document_type = "doc";
                } else if (value.images[0].path.includes(".pdf")) {
                  value.images[0].document_type = "pdf";
                } else if (value.images[0].path.includes(".ppt")) {
                  value.images[0].document_type = "ppt";
                }
              }
            });
          }

          $scope.public_list = $scope.maintainList = _.filter(
            $scope.maintainList1,
            function (item) {
              var create_by_logged_in_trader = false;
              var trader_price = "";
              var trader_date = "";
              // console.log("item.maintentenance_counter_proposals    ", item.maintentenance_counter_proposals);
              item.maintentenance_counter_proposals.map(function (item1) {
                // console.log("item     -----   ", item1);
                if (item1.proposal_created_by == $localStorage.userData._id) {
                  trader_price = item1.proposed_price;
                  trader_date = item1.proposed_date;
                }
              });

              if (trader_price && trader_date) {
                item.trader_price = trader_price;
                item.trader_date = trader_date;
                return item;
              }
            }
          );
        });
      }
    };
    /**
     * Function is to highlight the clicked nav
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.navSelect = function (navSelected) {
      $scope.maintNavBarOptionSelected = navSelected;
    };
    /**
     * Function is to show the data on maintenance detail page
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.maintenanceDetail = function () {
      $scope.canChat = true;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $scope.agentBtn = false;
      $scope.traderBtn = false;
      $scope.ownerBtn = false;
      $scope.tenantBtn = false;
      var obj = {};
      obj.id = $stateParams.id;

      if ($stateParams.trader_id && $stateParams.trader_id != "") {
        $scope.selected_trader_id = $stateParams.trader_id;
        var userData = {
          userId: $scope.selected_trader_id,
          roleId: roleId.trader,
        };
        userService.getUserById().post(userData, function (response) {
          if (response.code == 200) {
            $scope.selected_trader_details = response.data;
            if (
              $scope.selected_trader_details &&
              $scope.selected_trader_details.mobile_no
            ) {
              // Format Phone Number
              var formatted_number = $scope.formatPhoneNumber(
                $scope.selected_trader_details.mobile_no
              );
              console.log("formatted_number => ", formatted_number);
              if (formatted_number) {
                $scope.selected_trader_details.mobile_no = formatted_number;
              }
            }
            console.log(
              "$scope.selected_trader_details :: check here => ",
              $scope.selected_trader_details
            );
          }
        });
      }

      $scope.TodayDate = moment().format("YYYY MM DD");
      if ($localStorage.role_id == roleId.trader) {
        $scope.traderBtn = true;
      } else if ($localStorage.role_id == roleId.owner) {
        $scope.ownerBtn = true;
      } else if ($localStorage.role_id == roleId.tenant) {
        $scope.tenantBtn = true;
      } else if (
        $localStorage.role_id == roleId.agent ||
        $localStorage.role_id == roleId.ownAgency
      ) {
        $scope.agentBtn = true;
      }

      $scope.isReviewedAllowed = false;
      // console.log("$scope.traderBtn",$scope.traderBtn);
      // console.log("Request Data    ", obj);
      maintainService.detailMaintenenace().get(obj, function (response) {
        if (response.code == 200) {
          // $scope.traderLoggedin = 'no';
          // if (!$stateParams.trader_id && $localStorage.role_id == roleId.trader) {
          //     $scope.traderLoggedin = 'yes';
          // }

          if ($localStorage.userData.agency_id) {
            $scope.loggedin_agency_id = $localStorage.userData.agency_id._id
              ? $localStorage.userData.agency_id._id
              : $localStorage.userData.agency_id;
          }

          $scope.detail = response.data;
          console.log("$scope.detail :: check here =>", $scope.detail);
          $scope.applied = "no";

          if (
            $scope.detail.trader_id &&
            $scope.detail.trader_id._id &&
            $scope.detail.trader_id._id != "" &&
            roleId.trader == $localStorage.role_id &&
            $scope.detail.trader_id._id != $localStorage.loggedInUserId
          ) {
            $location.path("maintance_listing");
          }

          if (
            $scope.detail &&
            $scope.detail.trader_id &&
            $scope.detail.trader_id.mobile_no
          ) {
            // Format Phone Number
            var formatted_number = $scope.formatPhoneNumber(
              $scope.detail.trader_id.mobile_no
            );
            console.log("formatted_number => ", formatted_number);
            if (formatted_number) {
              $scope.detail.trader_id.mobile_no = formatted_number;
            }
          }
          if (
            $scope.detail &&
            $scope.detail.created_by &&
            $scope.detail.created_by.mobile_no
          ) {
            // Format Phone Number
            var formatted_number = $scope.formatPhoneNumber(
              $scope.detail.created_by.mobile_no
            );
            console.log("formatted_number => ", formatted_number);
            if (formatted_number) {
              $scope.detail.created_by.mobile_no = formatted_number;
            }
          }

          if ($scope.detail && $scope.detail.request_type == 1) {
            console.log(
              "$scope.detail.maintenance_log.apply_trader_id.length    ",
              $scope.detail.maintenance_log.apply_trader_id.length
            );
            // if ($scope.detail.maintenance_log && !$scope.detail.maintenance_log.apply_trader_id)
            //     $scope.not_applied = 'yes';
            // else
            if (
              $scope.detail.maintenance_log &&
              $scope.detail.maintenance_log.apply_trader_id
            ) {
              // && $scope.detail.maintenance_log.apply_trader_id.length < 3
              console.log(
                "i m inside....   ",
                $scope.detail.maintenance_log.apply_trader_id.indexOf(
                  $localStorage.userData._id
                )
              );
              if (
                $scope.detail.maintenance_log.apply_trader_id.indexOf(
                  $localStorage.userData._id
                ) !== -1
              ) {
                $scope.applied = "yes";
              } else {
                if ($scope.isTrader == true) $scope.canChat = false;
              }

              if ($scope.detail.maintenance_log.apply_trader_id.length >= 3)
                $scope.applied = "yes";
            }
          }
          console.log("$scope.applied    ", $scope.applied);

          if ($scope.selected_trader_id && $scope.selected_trader_id != "") {
            // console.log("$scope.selected_trader_id    ", $scope.selected_trader_id);
            var cntobj = {
              maintenance_id: $scope.detail._id,
              trader_id: $scope.selected_trader_id,
            };
            maintainService
              .getCounterProposals()
              .post(cntobj, function (proposal_response) {
                if (proposal_response.code == 200) {
                  if (
                    proposal_response.data &&
                    proposal_response.data.length > 0
                  ) {
                    if (
                      proposal_response.data &&
                      proposal_response.data.length > 0
                    ) {
                      $scope.trader_cp = proposal_response.data;
                      $scope.TodayDate = moment().format("YYYY MM DD");
                      if ($scope.trader_cp && $scope.trader_cp[0]) {
                        var diff1 = moment(
                          $scope.trader_cp[0].proposed_date
                        ).format("YYYY MM DD");
                        $scope.trader_date_difference = moment(
                          diff1,
                          "YYYY MM DD"
                        ).diff(moment($scope.TodayDate, "YYYY MM DD"), "days");
                        $scope.trader_price =
                          $scope.trader_cp[0].proposed_price;
                        $scope.trader_mr_status = $scope.trader_cp[0].status;
                      }
                    }
                  }
                }
              });
          }

          $scope.TodayDate = moment().format("YYYY MM DD");
          var diff1 = moment($scope.detail.due_date).format("YYYY MM DD");
          $scope.detail.difference = moment(diff1, "YYYY MM DD").diff(
            moment($scope.TodayDate, "YYYY MM DD"),
            "days"
          );

          $scope.allow_togive_review = true;
          if (
            $scope.detail.created_by &&
            $scope.detail.created_by._id &&
            $scope.detail.created_by._id == $localStorage.loggedInUserId
          )
            $scope.created_logged_in_both = "yes";

          var postData = {
            user_role: $localStorage.role_id,
          };
          if (response.data.trader_id && response.data.trader_id._id)
            postData.user_id = response.data.trader_id._id;

          $scope.check_review_permission(postData);
          // TenantService.getTenantUSerReview().post(postData, function (response) {
          //     if (response.code == 200) {
          //         $scope.agentReviewList = response.data;
          //         $scope.agentReviewList.map(function (item) {
          //             if (item.review_by._id == $localStorage.loggedInUserId) {
          //                 $scope.allow_togive_review = false;
          //             }
          //         });
          //     }
          // });

          angular.forEach($scope.detail.images, function (value, key) {
            if (value.path.includes(".xlsx") || value.path.includes(".xlsx")) {
              value.document_type = "excel";
            }
            // else if((value.path).includes(".jpeg")||(value.path).includes(".jpg")||(value.path).includes(".png")||(value.path).includes(".gif")){
            //     value.document_type = "pic";
            // }
            else if (
              value.path.includes(".txt") ||
              value.path.includes(".doc")
            ) {
              value.document_type = "doc";
            } else if (value.path.includes(".pdf")) {
              value.document_type = "pdf";
            } else if (value.path.includes(".ppt")) {
              value.document_type = "ppt";
            }
          });

          if (
            ($scope.agentBtn == true ||
              $scope.ownerBtn == true ||
              $scope.tenantBtn == true) &&
            $scope.detail.trader_id
          ) {
            $scope.getAgentOrTraderReview($scope.detail.trader_id._id);
          } else if (
            ($scope.agentBtn == true ||
              $scope.ownerBtn == true ||
              $scope.tenantBtn == true) &&
            !$scope.detail.trader_id &&
            $scope.selected_trader_details
          ) {
            $scope.getAgentOrTraderReview($scope.selected_trader_details._id);
          } else if ($scope.userRoleId == $scope.roleId.trader) {
            $scope.getAgentOrTraderReview($scope.detail.created_by._id);
          }

          // if ($scope.userRoleId == $scope.roleId.trader && $scope.detail.forwarded_by) {
          //     $scope.getAgentOrTraderReview($scope.detail.forwarded_by._id);
          // } else {
          //     if ($scope.detail.trader_id && $scope.detail.trader_id._id)
          //         $scope.getAgentOrTraderReview($scope.detail.trader_id._id);
          // }
        } else {
          $scope.detail = [];
        }
      });
    };

    $scope.jobDetail = function () {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $scope.agentBtn = false;
      $scope.traderBtn = false;
      $scope.ownerBtn = false;
      $scope.tenantBtn = false;
      var obj = {};
      obj.id = $stateParams.id;
      $scope.TodayDate = moment().format("YYYY MM DD");
      if ($localStorage.role_id == roleId.trader) {
        $scope.traderBtn = true;
      } else if ($localStorage.role_id == roleId.owner) {
        $scope.ownerBtn = true;
      } else if ($localStorage.role_id == roleId.tenant) {
        $scope.tenantBtn = true;
      } else if (
        $localStorage.role_id == roleId.agent ||
        $localStorage.role_id == roleId.ownAgency
      ) {
        $scope.agentBtn = true;
      }

      $scope.isReviewedAllowed = false;
      $scope.counter_proposals = {};
      $scope.traderList = {};
      maintainService.detailMaintenenace().get(obj, function (response) {
        if (response.code == 200) {
          $scope.detail = response.data;
          console.log("$scope.detail :: Maintenenace detail   ", $scope.detail);
          var cntobj = { maintenance_id: $scope.detail._id };
          maintainService
            .getCounterProposals()
            .post(cntobj, function (proposal_response) {
              if (proposal_response.code == 200) {
                $scope.counter_proposals = proposal_response.data;
                // console.log("proposal_response     ", proposal_response.data);
              }
            });
          var obj = {
            latitude: $scope.detail.latitude,
            longitude: $scope.detail.longitude,
            location: "yes",
            limit: 12,
            categories_id: $scope.detail.categories_id[0]._id,
          };
          maintainService.traderList().post(obj, function (trader_list) {
            $scope.traderList = trader_list.data;
            console.log("$scope.trader_listing    ", $scope.traderList);
          });

          $scope.TodayDate = moment().format("YYYY MM DD");
          var diff1 = moment($scope.detail.due_date).format("YYYY MM DD");
          $scope.detail.difference = moment(diff1, "YYYY MM DD").diff(
            moment($scope.TodayDate, "YYYY MM DD"),
            "days"
          );

          $scope.allow_togive_review = true;
          if (
            $scope.detail.created_by &&
            $scope.detail.created_by._id &&
            $scope.detail.created_by._id == $localStorage.loggedInUserId
          )
            $scope.created_logged_in_both = "yes";

          var postData = {
            user_role: $localStorage.role_id,
          };
          if (response.data.trader_id && response.data.trader_id._id)
            postData.user_id = response.data.trader_id._id;

          $scope.check_review_permission(postData);

          angular.forEach($scope.detail.images, function (value, key) {
            if (value.path.includes(".xlsx") || value.path.includes(".xlsx")) {
              value.document_type = "excel";
            } else if (
              value.path.includes(".txt") ||
              value.path.includes(".doc")
            ) {
              value.document_type = "doc";
            } else if (value.path.includes(".pdf")) {
              value.document_type = "pdf";
            } else if (value.path.includes(".ppt")) {
              value.document_type = "ppt";
            }
          });
          if (
            $scope.userRoleId == $scope.roleId.trader &&
            $scope.detail.forwarded_by
          ) {
            $scope.getAgentOrTraderReview($scope.detail.forwarded_by._id);
          } else {
            if ($scope.detail.trader_id && $scope.detail.trader_id._id)
              $scope.getAgentOrTraderReview($scope.detail.trader_id._id);
          }
        } else {
          $scope.detail = [];
        }
      });
    };

    $scope.check_review_permission = function (postData) {
      TenantService.getTenantUSerReview().post(postData, function (response) {
        if (response.code == 200) {
          $scope.agentReviewList = response.data;
          $scope.agentReviewList.map(function (item) {
            if (item.review_by._id == $localStorage.loggedInUserId) {
              $scope.allow_togive_review = false;
            }
          });
        }
      });
    };

    /**
     * Function is used to view image from property detail page
     * @access private
     * @return json
     * Created by  Minakshi
     * @smartData Enterprises (I) Ltd
     * Created Date 3-Aug-2017
     */
    $scope.openImages = function (path) {
      var modalInstance;
      modalInstance = $uibModal.open({
        template:
          '<img src="' +
          $scope.maintenanceImageUrl +
          path +
          '" style="width:100%;hight:100%;">',
        controller: "MaintenanceCtrl",
        scope: $scope,
      });
    };

    /**
     * Function is to get the watchers
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created
     */
    $scope.watcherInfo = function () {
      var obj1 = {};
      // if ($localStorage.role_id == roleId.agent && $localStorage.userData.agency_id != 'undefined' && $localStorage.userData.agency_id) {
      if (
        $localStorage.userData.agency_id != "undefined" &&
        $localStorage.userData.agency_id
      ) {
        obj1.id = $localStorage.userData.agency_id._id
          ? $localStorage.userData.agency_id._id
          : $localStorage.userData.agency_id;
        maintainService.getWatchersList().get(obj1, function (response) {
          if (response.code == 200) {
            $scope.watcher = response.data;
            angular.forEach($scope.watcher, function (value, key) {
              value.fullName = value.firstname + " " + value.lastname;
              value.fullName =
                $scope.capitalizeName(value.fullName) + "-" + value.email;
            });
          } else {
            $scope.watcher = [];
          }
        });
      }
    };
    $scope.capitalizeName = function (name) {
      return name.replace(/\b(\w)/g, (s) => s.toUpperCase());
    };
    /**
     * Function is to send message
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created
     */
    $scope.openSendMessage = function (id) {
      var modalInstance = ($scope.model = $uibModal.open({
        animation: false,
        templateUrl: "/frontend/modules/tenants/views/sendMessage.html",
        scope: $scope,
        controller: function ($uibModalInstance, $scope) {
          $scope.ok = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.sendMessage = function (message) {
            var obj = {};
            obj.sender_id = $localStorage.userData._id;
            obj.receiver_id = id;
            obj.firstname = $localStorage.userData.firstname;
            obj.lastname = $localStorage.userData.lastname;
            obj.message = message;
            obj.time = $scope.getDate();
            maintainService.sendMessage().post(obj, function (response) {
              if (response.code == 200) {
                toastr.success("Successfully sent message to customer");

                $scope.cancel();
              } else {
                toastr.warning("Server is busy please try a while");
              }
            });
          };
        },
      }));
      modalInstance.result.then(
        function (selectedItem) { },
        function () { }
      );
    };
    /**
     * function is to show and hide file option
     * created on 22-Dec-2017
     *
     */
    $scope.showFilePopup = function (key) {
      $scope.filePopup[key] = $scope.filePopup[key] == false ? true : false;
    };
    /**
     * Function is to sort the maintenance request
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */
    $scope.refineResult = "Refine results";
    $scope.setOrderProperty = function (propertyName) {
      $scope.setRefineResult(propertyName);
      if ($scope.orderProperty === propertyName) {
        $scope.orderProperty = "-" + propertyName;
      } else if ($scope.orderProperty === "-" + propertyName) {
        $scope.orderProperty = propertyName;
      } else {
        $scope.orderProperty = propertyName;
      }
      console.log("select    ", propertyName + "     " + $scope.orderProperty);
    };
    /**
     * Function is to set the value for refine result section
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */
    $scope.setRefineResult = function (propertyName) {
      if (propertyName == "request_overview") {
        $scope.refineResult = "Request Overview";
      } else if (propertyName == "due_date") {
        $scope.refineResult = "Due Date";
      } else {
        $scope.refineResult = "Budget";
      }
      console.log("$scope.refineResult    ", $scope.refineResult);
    };
    /**
     * Function is to accept or deney maintenace req
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */
    $scope.acceptRejectMaintReq = function (id, status) {
      // console.log("calles");
      blockUI.start();
      var obj = {};
      obj.maintenance_id = id;
      obj.req_status = status;

      maintainService.acceptDenyMaintenanceReq().post(obj, function (response) {
        if (response.code == 200) {
          $scope.openChat(id, status);
          if (status == 2 || status == "2") {
            toastr.success("Successfully accepted maintenance request");
            $scope.maintenanceListing();
            blockUI.stop();
          } else if (status == 7 || status == "7") {
            toastr.success("Successfully declined maintenance request");
            $scope.maintenanceListing();
            blockUI.stop();
          } else blockUI.stop();
        } else {
          toastr.warning("Server is busy please try a while");
          blockUI.stop();
        }
      });
    };
    /**
     * Function is to accept or deney maintenace req 0n  maintenance detail page
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */
    $scope.acceptRejectOnDetailPage = function (id, status) {
      var obj = {};
      obj.maintenance_id = id;
      obj.req_status = status;
      obj.accepted_or_declined_by_role = $localStorage.role_id;
      console.log("obj :: accept deny api => ", obj);
      maintainService.acceptDenyMaintenanceReq().post(obj, function (response) {
        if (response.code == 200) {
          $scope.openChat(id, status);
          if (status == 3) {
            toastr.success("Successfully booked maintenance request");
            $scope.maintenanceDetail();
          } else if (status == 2) {
            toastr.success("Successfully accepted maintenance request");
            $scope.maintenanceDetail();
          } else {
            toastr.success("Successfully declined maintenance request");
            $scope.maintenanceDetail();
          }
        } else {
          toastr.warning("Server is busy please try a while");
        }
      });
    };
    /**
     * Function is to open counter proposal request modal
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */

    $scope.sendProposal = function (id) {
      var modalInstance = ($scope.model = $uibModal.open({
        animation: false,
        templateUrl: "/frontend/modules/maintenance/views/counterProposal.html",
        scope: $scope,
        controller: function ($uibModalInstance, $scope) {
          $scope.ok = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.counterPropoalInit = function () {
            $scope.counterProposal = {};
          };
          $scope.RemovePhotoFromMyFiles = function (index) {
            //Find the record using Index from Array.
            var name = $scope.choosenFiles[index];
            $scope.choosenFiles.splice(index, 1);
            $scope.user.splice(index, 1);
            if ($scope.choosenFiles.length == 0) {
              delete $scope.user;
            }
          };
          $scope.counterProposalReq = function (proposal) {
            $scope.loginLoading = true;
            if ($scope.counterProposalForm.$invalid == false) {
              var obj = {};
              obj.maintenance_id = id;
              obj.proposed_price = proposal.budget;
              obj.proposed_date = proposal.due_date;
              obj.message = proposal.message;
              if ($scope.choosenFiles.length > 0) {
                obj.images = $scope.choosenFiles;
              }
              obj.proposal_created_by = $localStorage.loggedInUserId;
              obj.proposal_created_role = $localStorage.role_id;
              obj.proposal_created_name =
                $localStorage.loggedInfirstname +
                " " +
                $localStorage.loggedInlastname;

              maintainService.counterProposal().post(obj, function (response) {
                if (response.code == 200) {
                  // console.log('response.proposal_data    ===  ', response.proposal_data);
                  if ($scope.choosenFiles.length == 0 || proposal.images) {
                    // $scope.uploadCompleteMaintReqFiles(complete, id);
                    $scope.uploadcounterProposalFiles(proposal, id);
                    $scope.sentGeneralChatMessageWithCounterProposal(
                      response.proposal_data
                    );
                  } else {
                    toastr.success("Successfully sent counter proposal");
                    $scope.maintenanceDetail();
                    $scope.sentGeneralChatMessageWithCounterProposal(
                      response.proposal_data
                    );
                    $scope.loginLoading = false;
                    $scope.cancel();
                  }
                  $scope.choosenFiles = [];
                  $scope.user = [];
                } else {
                  toastr.warning("Server is busy please try a while");
                  $scope.loginLoading = false;
                }
              });
            } else {
              toastr.error("Please fill the form completely");
              $scope.loginLoading = false;
            }
          };
          $scope.uploadcounterProposalFiles = function (files, data) {
            if (files.images && files.images.length) {
              for (var i = 0; i < files.images.length; i++) {
                var file = files.images[i];
                if (!file.$error) {
                  Upload.upload({
                    url: baseUrl + "/api/uploadProposalImages",
                    data: {
                      _id: data,
                      file: file,
                    },
                  }).then(
                    function (response) {
                      if (response && response.status == 200) {
                        toastr.success("Successfully sent counter proposal");
                        $scope.cancel();
                      } else if (response.data.code == 400) {
                        toastr.error("Failed to upload images");
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
            }
          };
          $scope.RemovePhoto = function (index) {
            //Find the record using Index from Array.
            var name = $scope.counterProposal.images[index];
            $scope.counterProposal.images.splice(index, 1);
            if ($scope.counterProposal.images.length == 0) {
              delete $scope.counterProposal.images;
            }
          };
        },
      }));
      modalInstance.result.then(
        function (selectedItem) { },
        function () { }
      );
    };

    $scope.hire_decline_trader = function (maintenance_id, status, trader_id) {
      // console.log('approved called');
      swal(
        {
          title: "Are you sure?",
          text:
            status == 1
              ? "You want to hire this trader?"
              : "You want to decline this trader?",
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
          var obj = {
            maintenance_id: maintenance_id,
            status: status,
            trader_id: trader_id,
          };

          maintainService.hire_decline_trader().post(obj, function (response) {
            if (response && response.code == 200) {
              $scope.sentGeneralChatMessageWithQuoteAcceptDecline(
                response.data,
                status
              );

              if (status && status == 1)
                $location.path("maintance_detail/" + maintenance_id);
              else $scope.maintenanceDetail();

              if (status == 1) toastr.success("Trader hired successfully.");
              else toastr.success("Trader declined successfully.");
            } else {
              toastr.error("Trader not hired. Please try again later.");
            }
          });
        }
      );
    };

    $scope.applyJob = function (id, suburb) {
      var modalInstance = ($scope.model = $uibModal.open({
        animation: false,
        templateUrl: "/frontend/modules/maintenance/views/apply_for_job.html",
        scope: $scope,
        controller: function ($uibModalInstance, $scope) {
          $scope.ok = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.counterPropoalInit = function () {
            $scope.applyProposal = {};
            console.log("suburb   ", suburb);
            $scope.suburb = suburb;
          };
          $scope.applyForQuote = function (proposal) {
            $scope.loginLoading = true;
            if ($scope.applyProposalForm.$invalid == false) {
              var obj = {};
              obj.maintenance_id = id;
              obj.proposed_price = proposal.budget;
              obj.proposed_date = proposal.due_date;
              obj.message = proposal.message;
              obj.proposal_created_by = $localStorage.loggedInUserId;
              obj.proposal_created_role = $localStorage.role_id;
              obj.business_name = $localStorage.userData.business_name;
              obj.firstname = $localStorage.userData.firstname;
              obj.lastname = $localStorage.userData.lastname;

              maintainService.applyForQuote().post(obj, function (response) {
                if (response.code == 200) {
                  toastr.success("Quote submitted successfully.");
                  $scope.maintenanceDetail();
                  $scope.sentGeneralChatMessageWithQuote(
                    response.proposal_data
                  );
                  $scope.loginLoading = false;
                  $scope.cancel();
                  $scope.user = [];

                  $location.path(
                    "quote_detail/" + id + "/" + $localStorage.userData._id
                  );
                } else {
                  toastr.warning("Server is busy please try a while");
                  $scope.loginLoading = false;
                }
              });
            } else {
              toastr.error("Please fill the form completely");
              $scope.loginLoading = false;
            }
          };
        },
      }));
      modalInstance.result.then(
        function (selectedItem) { },
        function () { }
      );
    };
    /**
     * Function is to go to maintaenance detail page
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */

    $scope.goToMaintDetail = function (id) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $location.path("maintance_detail/" + id);
      // $location.path('job_detail/' + id);
    };

    $scope.goToMaintDetailwithJob = function (maintenance_id, trader_id) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $location.path("quote_detail/" + maintenance_id + "/" + trader_id);
      // $location.path('job_detail/' + id);
    };

    $scope.goToJobDetail = function (id) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $location.path("job_detail/" + id);
    };

    /**
     * Function is to open counter proposal request modal
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */

    $scope.jobCompleted = function (id) {
      var modalInstance = ($scope.model = $uibModal.open({
        animation: false,
        templateUrl: "/frontend/modules/maintenance/views/complete.html",
        scope: $scope,
        controller: function ($uibModalInstance, $scope) {
          $scope.ok = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.jobCompletedInit = function () {
            $scope.complete = {};
          };
          $scope.jobDone = function (complete) {
            $scope.loginLoading = true;
            if ($scope.jobCompleted.$invalid == false) {
              var obj = {};
              obj.maintenance_id = id;
              obj.message = complete.message;
              if ($scope.choosenFiles.length > 0) {
                obj.images = $scope.choosenFiles;
              }
              maintainService.completeMaintJob().post(obj, function (response) {
                var response_ = response;
                // console.log("response!!!!!!!!!!", response);
                if (response_.code == 200) {
                  if ($scope.choosenFiles.length == 0 || complete.images) {
                    toastr.success("Successfully marked request as completed");
                    $scope.uploadCompleteMaintReqFiles(complete, id);
                    response_.maintenance_data.maintenance_id =
                      response_.maintenance_data._id;
                    $scope.sentGeneralChatMessageWithJOBCompleted(
                      response_.maintenance_data
                    );
                    $scope.maintenanceDetail();
                    $scope.loginLoading = false;
                  } else {
                    toastr.success("Successfully marked request as completed");
                    response_.maintenance_data.maintenance_id =
                      response_.maintenance_data._id;
                    $scope.sentGeneralChatMessageWithJOBCompleted(
                      response_.maintenance_data
                    );
                    $scope.maintenanceDetail();
                    $scope.loginLoading = false;
                    $scope.cancel();
                  }
                  $scope.choosenFiles = [];
                  $scope.user = [];
                } else {
                  //toastr.warning('Server is busy please try a while');
                  $scope.maintenanceDetail();
                  $scope.loginLoading = false;
                  $scope.cancel();
                }
              });
            } else {
              toastr.error("Please fill the form completely");
              $scope.loginLoading = false;
            }
          };
          $scope.uploadCompleteMaintReqFiles = function (files, data) {
            if (files.images && files.images.length) {
              for (var i = 0; i < files.images.length; i++) {
                var file = files.images[i];
                if (!file.$error) {
                  Upload.upload({
                    url: baseUrl + "/api/uploadCompleteJobImages",
                    data: {
                      _id: data,
                      file: file,
                    },
                  }).then(
                    function (response) {
                      if (response && response.status == 200) {
                        toastr.success(
                          "Successfully marked request as completed"
                        );
                        $scope.maintenanceDetail();
                        $scope.cancel();
                      } else if (response.data.code == 400) {
                        toastr.error("Failed to upload images");
                      }
                    },
                    null,
                    function (evt) { }
                  );
                }
              }
            } else {
              // toastr.warning("Server is busy try after a while");
              $scope.cancel();
            }
          };
          $scope.RemovePhoto = function (index) {
            //Find the record using Index from Array.
            var name = $scope.complete.images[index];
            $scope.complete.images.splice(index, 1);
            if ($scope.complete.images.length == 0) {
              delete $scope.complete.images;
            }
          };
          $scope.RemovePhotoFromMyFiles = function (index) {
            //Find the record using Index from Array.
            var name = $scope.choosenFiles[index];
            $scope.choosenFiles.splice(index, 1);
            if ($scope.choosenFiles.length == 0) {
              $scope.choosenFiles = [];
              $scope.user = [];
            }
          };
        },
      }));
      modalInstance.result.then(
        function (selectedItem) { },
        function () { }
      );
    };

    $scope.chooseFromMyFiles = function () {
      var modalInstance = ($scope.model = $uibModal.open({
        animation: false,
        templateUrl: "/frontend/modules/maintenance/views/chooseFiles.html",
        scope: $scope,
        controller: function ($uibModalInstance, $scope) {
          $scope.documentList = [];
          $scope.ok = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.close = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.filesInitialize = function () {
            $scope.getDocumentList();
          };
          $scope.getDocumentList = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            var userId = $localStorage.loggedInUserId;
            if (userId) {
              var obj = {
                created_by: userId,
              };
              maintainService.getDocumentList().post(obj, function (response) {
                if (response.code == 200) {
                  $scope.documentList = response.data;
                  // console.log('$scope.documentList',$scope.documentList);
                } else {
                  $scope.documentList = [];
                }
              });
            }
          };
          $scope.saveFile = function () {
            if ($scope.user.length) {
              angular.forEach($scope.user, function (value, key) {
                var data = $scope.documentList[value].document_path;
                $scope.choosenFiles[key] = _.pick(
                  $scope.documentList[value],
                  "document_path"
                );
                $scope.choosenFiles[key] = _.extend($scope.choosenFiles[key], {
                  path: data,
                });
                $scope.choosenFiles[key] = _.pick(
                  $scope.choosenFiles[key],
                  "path"
                );
                if ($scope.user.length == $scope.choosenFiles.length) {
                  $scope.close();
                }
              });
            } else {
              toastr.warning("Sorry nothing to upload");
              $scope.close();
            }
          };
        },
      }));
      modalInstance.result.then(
        function (selectedItem) { },
        function () { }
      );
    };
    $scope.navSelectMaintListing = function (navSelected) {
      $scope.maintNavList = navSelected;
    };

    $scope.selectFromMyFiles = function () {
      $state.go("fileListing");
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
      showWeeks: false,
    };

    $scope.dateOptions = {
      // dateDisabled: disabled,
      formatYear: "yy",
      maxDate: new Date(2050, 5, 22),
      minDate: new Date(),
      startingDay: 1,
      showWeeks: false,
    };

    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === "day" && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function () {
      $scope.inlineOptions.minDate = $scope.inlineOptions.minDate
        ? null
        : new Date();
      $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };
    $scope.setDate = function (year, month, day) {
      $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ["dd-MMM-yyyy", "yyyy/MM/dd", "dd.MM.yyyy", "shortDate"];
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
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

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

    // calender code ends here

    /**
     * Function is to get maintenance request sent by tenant
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.requestByTenantList = function () {
      var obj = {};
      if (
        $localStorage.userData.agency_id != "undefined" &&
        $localStorage.userData.agency_id
      ) {
        obj.agency_id = $localStorage.userData.agency_id._id
          ? $localStorage.userData.agency_id._id
          : $localStorage.userData.agency_id;
        obj.request_by_role = $localStorage.role_id;
        obj.request_by_id = $localStorage.loggedInUserId;
        maintainService.getTenantForwardList().post(obj, function (response) {
          // console.log("response", response);
          if (response.code == 200) {
            $scope.maintainList = response.data;
          } else {
            toastr.warning("Server is busy please try a while");
          }
        });
      }
    };
    /**
     * Function is to open add new tenant modal
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date 22-Nov-2017
     */
    $scope.openForwardMaintenance = function (id) {
      var role = $localStorage.role_id;
      if (role == roleId.agent || role == roleId.ownAgency) {
        var modalInstance = ($scope.model = $uibModal.open({
          animation: false,
          templateUrl: "/frontend/modules/maintenance/views/forward.html",
          scope: $scope,
          controller: function ($uibModalInstance, $scope) {
            $scope.ok = function () {
              $uibModalInstance.dismiss("cancel");
            };
            $scope.cancel = function () {
              $uibModalInstance.dismiss("cancel");
            };
            $scope.maintenanceDetailForForward = function () {
              var obj = {};
              obj.id = id;
              $scope.maintain = [];
              $scope.existingWatcher = [];
              maintainService
                .detailMaintenenace()
                .get(obj, function (response) {
                  if (response.code == 200) {
                    $scope.maintenance = response.data;
                    $scope.maintenance.due_date = new Date(
                      $scope.maintenance.due_date
                    );
                    // $scope.maintenance.name = $scope.maintenance.trader_id.firstname + " " + $scope.maintenance.trader_id.lastname;
                    // $scope.maintenance.trader_id = $scope.maintenance.trader_id._id;
                    $scope.maintain = _.map(
                      $scope.maintenance.watchers_list,
                      function (o) {
                        return _.pick(o, "users_id");
                      }
                    );
                    if (
                      $scope.maintain.length ==
                      $scope.maintenance.watchers_list.length
                    ) {
                      angular.forEach($scope.maintain, function (value, key) {
                        $scope.existingWatcher[key] = _.extend(
                          $scope.existingWatcher[key],
                          { _id: value.users_id._id }
                        );
                        if (
                          $scope.maintain.length ==
                          $scope.existingWatcher.length
                        ) {
                        }
                      });
                    }
                  } else {
                    $scope.detail = [];
                  }
                });
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
            $scope.onSelect = function ($item, $model, $label) {
              $scope.maintenance.trader_id = $item._id;
              $model = $item._id;
            };
            $scope.agentForwardRequest = function (data) {
              if (
                $localStorage.role_id == roleId.agent ||
                $localStorage.role_id == roleId.ownAgency
              ) {
                if (
                  $localStorage.userData.agency_id != "undefined" &&
                  $localStorage.userData.agency_id
                ) {
                  $scope.loginLoading = true;
                  if ($scope.createMaintenanceForm.$invalid == false) {
                    var obj = {};
                    obj.maintenance_id = id;
                    obj.request_overview = data.request_overview;
                    obj.request_detail = data.request_detail;
                    obj.trader_id = $scope.maintenance.trader_id;
                    obj.budget = parseInt(data.budget);
                    // obj.due_date = new Date(data.dt);
                    obj.due_date = new Date(data.due_date);

                    if ($scope.newArray2.length) {
                      obj.watchers_list = _.map($scope.newArray2, function (o) {
                        return _.pick(o, "_id");
                      });
                    } else {
                      obj.watchers_list = $scope.existingWatcher;
                    }
                    // console.log("obj    ", obj);
                    if (
                      obj.watchers_list.length == $scope.newArray2.length ||
                      obj.watchers_list.length == $scope.existingWatcher.length
                    ) {
                      maintainService
                        .forwardRequest()
                        .post(obj, function (response) {
                          if (response.code == 200) {
                            // $scope.openChat(obj.maintenance_id, 20);
                            toastr.success(
                              "Successfully forwarded maintenance request"
                            );
                            $scope.requestByTenantList();
                            $scope.loginLoading = false;
                            $scope.cancel();
                          } else {
                            $scope.traderList = [];
                            $scope.loginLoading = false;
                          }
                        });
                    }
                  } else {
                    toastr.error("Please fill the form completely");
                    $scope.loginLoading = false;
                  }
                } else {
                  toastr.error("First associate yourself with any agency");
                }
              } else {
                toastr.warning("You do not have access permission");
              }
            };
            $scope.removeWatcher = function (key) {
              $scope.newArray2.splice(key, 1);
            };
          },
        }));
        modalInstance.result.then(
          function (selectedItem) { },
          function () { }
        );
      } else {
        toastr.warning("You do not have access permission");
      }
    };
    /**
     * Used to get trader/agent review
     * Date
     * @smartData Enterprises (I) Ltd
     * @access private
     * @return json
     */
    $scope.getAgentOrTraderReview = function (id) {
      $scope.id = id;
      $scope.createdByRate = {};
      PropertyService.getReviewForUser($scope.id).get(function (response) {
        if (response.code == 200) {
          $scope.createdByRate = response;
          $scope.createdByRate.data =
            $scope.createdByRate.data > 0 ? $scope.createdByRate.data : 0;
          $scope.createdByRate.total_review = $scope.createdByRate.total_review
            ? $scope.createdByRate.total_review
            : 0;
        } else {
          $scope.createdByRate.data = 0;
          $scope.createdByRate.total_review = 0;
        }

        console.log("1.   ", $scope.createdByRate.data);
        console.log("1.   ", $scope.createdByRate.total_review);
      });
    };
    $scope.goToTraderProfile = function (id) {
      $localStorage.setFocusonme = true;
      $rootScope.navBarOptionSelected = "trader_listing";
      $localStorage.userData.routeState = "trader_listing";
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $location.path("/trader_profile/" + id);
    };
    /**
     * Chat functionality starts from here
     */

    //To initialize the basic chat functionality
    $scope.privateMessage = [];
    $scope.openChat = function (maintenanceId, status) {
      if ($localStorage.loggedInUserId) {
        //add user to the group
        // console.log('$stateParams.id', $stateParams.id);
        socket.emit("addMaintenanceUsers", {
          id: $localStorage.loggedInUserId,
          maintenanceId: maintenanceId,
          firstName: $localStorage.loggedInfirstname,
          lastName: $localStorage.loggedInlastname,
        });
        if (status == 7) {
          var message = {
            from: $localStorage.loggedInUserId,
            to: maintenanceId,
            textMsg: "maintenance_decline",
            time: $scope.getDate(),
            maintenanceId: maintenanceId,
            is_status: true,
          };
          $scope.chat.generalMsg = "";
          // console.log('message sent called', message);
          socket.emit("maintenanceGroupMessageSent", message);
        } else if (status == 2) {
          var message = {
            from: $localStorage.loggedInUserId,
            to: maintenanceId,
            textMsg: "maintenance_accept",
            time: $scope.getDate(),
            maintenanceId: maintenanceId,
            is_status: true,
          };
          $scope.chat.generalMsg = "";
          // console.log('message sent called', message);
          socket.emit("maintenanceGroupMessageSent", message);
        } else if (status == 5) {
          var message = {
            from: $localStorage.loggedInUserId,
            to: maintenanceId,
            textMsg: "Job completed",
            time: $scope.getDate(),
            maintenanceId: maintenanceId,
            is_status: true,
          };
          $scope.chat.generalMsg = "";
          // console.log('message sent called', message);
          socket.emit("maintenanceGroupMessageSent", message);
        } else if (status == 3) {
          var message = {
            from: $localStorage.loggedInUserId,
            to: maintenanceId,
            textMsg: "Booked",
            time: $scope.getDate(),
            maintenanceId: maintenanceId,
            is_status: true,
          };
          $scope.chat.generalMsg = "";
          // console.log('message sent called', message);
          socket.emit("maintenanceGroupMessageSent", message);
        } else if (status == 11) {
          $scope.mrchat_to = "";
          if ($scope.detail.request_type == 1) {
            $scope.mrchat_to = $scope.detail.created_by;
          } else {
            $scope.mrchat_to = maintenanceId;
          }

          var message = {
            from: $localStorage.loggedInUserId,
            to: $scope.mrchat_to,
            textMsg: "Counter Proposal Accepted",
            time: $scope.getDate(),
            maintenanceId: maintenanceId,
            is_status: true,
          };
          $scope.chat.generalMsg = "";
          // console.log('message sent called', message);
          socket.emit("maintenanceGroupMessageSent", message);
        } else if (status == 12) {
          $scope.mrchat_to = "";
          if ($scope.detail.request_type == 1) {
            $scope.mrchat_to = $scope.detail.created_by;
          } else {
            $scope.mrchat_to = maintenanceId;
          }

          var message = {
            from: $localStorage.loggedInUserId,
            to: $scope.mrchat_to,
            textMsg: "Counter Proposal Declined",
            time: $scope.getDate(),
            maintenanceId: maintenanceId,
            is_status: true,
          };
          $scope.chat.generalMsg = "";
          // console.log('message sent called', message);
          socket.emit("maintenanceGroupMessageSent", message);
        } else if (status == 13) {
          var message = {
            from: $localStorage.loggedInUserId,
            to: maintenanceId,
            textMsg: "Confirmation Approved",
            time: $scope.getDate(),
            maintenanceId: maintenanceId,
            is_status: true,
          };
          $scope.chat.generalMsg = "";
          // console.log('message sent called', message);
          socket.emit("maintenanceGroupMessageSent", message);
        } else if (status == 14) {
          var message = {
            from: $localStorage.loggedInUserId,
            to: maintenanceId,
            textMsg: "Confirmation Declined",
            time: $scope.getDate(),
            maintenanceId: maintenanceId,
            is_status: true,
          };
          $scope.chat.generalMsg = "";
          // console.log('message sent called', message);
          socket.emit("maintenanceGroupMessageSent", message);
        } else if (status == 16) {
          var message = {
            from: $localStorage.loggedInUserId,
            to: maintenanceId,
            textMsg: "Request Cancelled",
            time: $scope.getDate(),
            maintenanceId: maintenanceId,
            is_status: true,
          };
          $scope.chat.generalMsg = "";
          // console.log('message sent called', message);
          socket.emit("maintenanceGroupMessageSent", message);
        } else if (status == 20) {
          var message = {
            from: $localStorage.loggedInUserId,
            to: maintenanceId,
            textMsg: "Sent",
            time: $scope.getDate(),
            maintenanceId: maintenanceId,
            is_status: true,
          };
          $scope.chat.generalMsg = "";
          // console.log('message sent called', message);
          socket.emit("maintenanceGroupMessageSent", message);
        } else if (status == 21) {
          var message = {
            from: $localStorage.loggedInUserId,
            to: maintenanceId,
            textMsg: "Quote Sent",
            time: $scope.getDate(),
            maintenanceId: maintenanceId,
            is_status: true,
          };
          $scope.chat.generalMsg = "";
          // console.log('message sent called', message);
          socket.emit("maintenanceGroupMessageSent", message);
        }
      }
    };
    $scope.chatInitialize = function () {
      if ($localStorage.loggedInUserId) {
        //add user to the group
        // console.log('$stateParams.id', $stateParams.id);
        socket.emit("addMaintenanceUsers", {
          id: $localStorage.loggedInUserId,
          maintenanceId: $stateParams.id,
          firstName: $localStorage.loggedInfirstname,
          lastName: $localStorage.loggedInlastname,
        });
      }
    };
    /**
     * Function is use to get response sender and show message to their window
     * @access private
     * @return json
     * Created by Minakshi
     * @smartData Enterprises (I) Ltd
     * Created Date 5-Aug-2017
     */
    socket.on("maintenanceUserJoined", function (data) {
      //to check added users
      // console.log('data', data);
      if (data.id == $localStorage.loggedInUserId) {
        toastr.info("You are online to the chat");
      } else {
        toastr.info(
          data.firstName + " " + data.lastName + " have joined the chat"
        );
      }
      socket.emit("maintenanceGroupChatHistory", {
        maintenanceId: $stateParams.id,
        userId: $localStorage.loggedInUserId,
      });
    });
    //group chat response come here
    socket.on("maintenanceUserLeaveChat", function (leaveData) {
      // console.log('leaveData', leaveData);
      if (leaveData.id != $localStorage.loggedInUserId) {
        toastr.info(
          leaveData.firstName + " " + leaveData.lastName + " is offline now"
        );
      }
    });
    //group chat Leave
    // $scope.detail = {
    //     req_status: 1
    // }
    socket.on("maintenanceGroupChatResponse", function (data) {
      $scope.lastCounterProposalCreatedBy = "";
      // console.log("here to call   ", data);
      if (data.length > 0) {
        var count = data.length;
        // $scope.detail.req_status = (data[count - 1].maintenance_id._id == $stateParams.id) ? data[count - 1].maintenance_id.req_status : 1;
        // $scope.detail.req_status = (data[count - 1]._id == $stateParams.id) ? data[count - 1].maintenance_id.req_status : 1;
      }
      var box = document.getElementById("conversation");
      if (box) box.scrollTop = box.scrollHeight;

      $scope.privateMessage = data;
      console.log("$scope.privateMessage  ", $scope.privateMessage);
      if ($scope.privateMessage && $scope.privateMessage.length > 0) {
        $scope.privateMessage.map(function (item) {
          // if (item.proposal_id && item.proposal_id._id && item.proposal_id.proposal_created_by) {
          //     $scope.lastCounterProposalCreatedBy = item.proposal_id.proposal_created_by;
          // }
          // && is_maintenance_chat: true ,msg: 'Counter proposal'
          if (
            item.from &&
            item.from._id &&
            item.from._id &&
            item.msg &&
            (item.msg == "Counter proposal" || item.msg == "Quote Sent") &&
            item.is_maintenance_chat == true
          ) {
            $scope.lastCounterProposalCreatedBy = item.from._id;
          }
        });
      }
    });
    //group chat messages recived here for notification purpose
    socket.on("maintenanceGroupMessageRecieved", function (message) {
      // console.log('message', message);
      if (message.from != $localStorage.loggedInUserId) {
        toastr.info("user message", message.msg);
      }
      socket.emit("maintenanceGroupChatHistory", {
        maintenanceId: $stateParams.id,
      });
    });

    //chat messages recevive here for notification purpose to specific user
    socket.on("maintenanceGroupMessageRecieved", function (message) {
      // console.log('message', message);
      if (message.from != $localStorage.loggedInUserId) {
        toastr.info("user message", message.msg);
      }
      socket.emit("maintenanceGroupChatResponse", {
        maintenanceId: $stateParams.id,
      });
    });
    //get current data functionality
    $scope.getDate = function () {
      var d = moment().format("YYYY-MM-DD h:mm:ss a");
      var n = moment().format("MMM Do") + ", " + moment().format("LT");
      return n;
    };
    //group messages sent from here
    $scope.send_message = function (message) {
      $timeout(function () {
        $("#conversation").scrollTop(99999999999999);
      }, 1000);
      // Listens for a new chat message
      let newMessage = JSON.stringify(message)

      if (!_.isEmpty(newMessage) && newMessage !== "" || newMessage !== undefined) {

        $scope.mrchat_to = "";
        if ($scope.detail.request_type == 1) {
          if (
            $scope.selected_trader_id != "" &&
            $scope.detail.created_by._id &&
            $localStorage.loggedInUserId == $scope.detail.created_by._id
          )
            $scope.mrchat_to = $scope.selected_trader_id;
          else $scope.mrchat_to = $scope.detail.created_by;
        } else {
          $scope.mrchat_to = $stateParams.id;
        }

        var messages = {
          from: $localStorage.loggedInUserId,
          to: $scope.mrchat_to,
          textMsg: message,
          time: $scope.getDate(),
          maintenanceId: $stateParams.id,
        };
        $scope.chat.generalMsg = "";
        // console.log('message sent called', messages);
        let myObj = {
          maintenanceId: $stateParams.id,
          from_user: $localStorage.loggedInUserId,
          to_user: $scope.mrchat_to
        }
        socket.emit("maintenanceGroupMessageSent", messages);
        $scope.searchTextbox(myObj)
      }
      //$scope.chat.generalMsg = '';
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

    $scope.callAPI = function (myObj) {
      maintainService.sendMailForChat().post(myObj, function (response) {
        console.info('---------------------------------')
        console.info('response for mail sent =>', response)
        console.info('---------------------------------')
      })
    }

    $scope.searchTextbox = $scope.debounce($scope.callAPI, 2000);



    //group messages sent with counter proposal id
    $scope.sentGeneralChatMessageWithJOBCompleted = function (proposalData) {
      //Listens for a new chat message
      console.log("message sent called", proposalData);
      var message = {
        from: $localStorage.loggedInUserId,
        to: proposalData.maintenance_id,
        textMsg: "Job completed",
        time: $scope.getDate(),
        maintenanceId: proposalData.maintenance_id,
        proposal_id: proposalData._id,
        is_status: true,
      };
      console.log("message : ", message);
      socket.emit("maintenanceGroupMessageSent", message);
      // var message = {
      //     from: $localStorage.loggedInUserId,
      //     to: proposalData.maintenance_id,
      //     textMsg: (proposalData.req_complete_message) ? proposalData.req_complete_message : proposalData.message,
      //     time: $scope.getDate(),
      //     maintenanceId: proposalData.maintenance_id,
      //     proposal_id: proposalData._id
      // }
      // console.log("message : ", message);
      // socket.emit('maintenanceGroupMessageSent', message);
    };

    $scope.sentGeneralChatMessageWithCounterProposal = function (proposalData) {
      $scope.mrchat_to = "";
      if ($scope.detail.request_type == 1) {
        $scope.mrchat_to = $scope.selected_trader_id;
      } else {
        $scope.mrchat_to = proposalData.maintenance_id;
      }

      //Listens for a new chat message
      console.log("message sent called", proposalData);
      var message = {
        from: $localStorage.loggedInUserId,
        to: $scope.mrchat_to,
        textMsg: "Counter proposal",
        time: $scope.getDate(),
        maintenanceId: proposalData.maintenance_id,
        proposal_id: proposalData._id,
        is_status: true,
      };
      console.log("message : ", message);
      socket.emit("maintenanceGroupMessageSent", message);
    };

    $scope.sentGeneralChatMessageWithQuote = function (proposalData) {
      //Listens for a new chat message
      console.log("message sent called", proposalData);

      var message = {
        from: $localStorage.loggedInUserId,
        to: $scope.detail.created_by,
        textMsg: "Quote Sent",
        time: $scope.getDate(),
        maintenanceId: proposalData.maintenance_id,
        proposal_id: proposalData._id,
        group_id: proposalData.maintenance_id,
        is_status: true,
      };
      console.log("message : ", message);
      socket.emit("maintenanceGroupMessageSent", message);
    };

    $scope.sentGeneralChatMessageWithQuoteAcceptDecline = function (
      proposalData,
      status
    ) {
      //Listens for a new chat message
      console.log("message sent called", proposalData);
      var message = {
        from: $localStorage.loggedInUserId,
        to: proposalData.proposal_created_by,
        textMsg: status == 1 ? "Quote Approved" : "Quote Declined",
        time: $scope.getDate(),
        maintenanceId: proposalData.maintenance_id,
        proposal_id: proposalData._id,
        is_status: true,
      };
      console.log("message : ", message);
      socket.emit("maintenanceGroupMessageSent", message);
    };

    /**
     * file uploads
     * @param {*} file
     */
    $scope.private_Message = "";
    $scope.uploadFile = function (file) {
      console.log("file => ", file);
      $scope.mrchat_to = "";
      if ($scope.detail.request_type == 1) {
        if (
          $scope.selected_trader_id != "" &&
          $scope.detail.created_by._id &&
          $localStorage.loggedInUserId == $scope.detail.created_by._id
        )
          $scope.mrchat_to = $scope.selected_trader_id;
        else $scope.mrchat_to = $scope.detail.created_by;
      } else {
        $scope.mrchat_to = $stateParams.id;
      }

      var postData = {
        from: $localStorage.loggedInUserId,
        to: $scope.mrchat_to,
        textMsg: $scope.private_Message,
        time: $scope.getDate(),
        maintenanceId: $stateParams.id,
      };
      // console.log('postData', postData);
      if (file) {
        $scope.fileUpload(file, postData);
      }
      // console.log('file', file);
    };
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
        url: baseUrl + "/api/uploadDocumentForChat",
        data: {
          data: data,
          file: file,
        },
      }).then(
        function (response) {
          if (response.data.code == 200) {
            toastr.success(response.data.message);
            var obj = {};
            obj = $localStorage.loggedInUserId;
            socket.emit("maintenanceGroupMessageSentWithFile", {
              from: $localStorage.loggedInUserId,
              to: $stateParams.id,
              // propertyId: $stateParams.id,
              textMsg: "File uploaded " + response.data.data.document_name,
              time: $scope.getDate(),
              maintenanceId: $stateParams.id,
              document_name: response.data.data.document_name,
              document_path:
                response.data.data.document_path +
                response.data.data.picture_path,
              size: response.data.data.size,
              is_file: true,
            });

            socket.on("sent", function (data) {
              $scope.private_chat_history();
            });
          } else {
            toastr.error(response.data.message);
          }
        },
        null,
        function (evt) {
          $scope.fileProgress = parseInt((100.0 * evt.loaded) / evt.total);
        }
      );
    };
    /**
     * Chat functionality ends here
     */

    //go to agent profile
    $scope.goToAgentProfile = function (id) {
      $localStorage.userData.routeState = "agents_listing";
      $rootScope.navBarOptionSelected = "agents_listing";
      $location.path("/profile/" + id);
    };

    // Pagination for Trader dropdown
    $scope.myPagingFunction = function (loadingMore) {
      // $scope.myPagingFunction = function (search, loadingMore) {
      console.log(
        "pagination function called :: trader list dropdown => ",
        loadingMore
      );

      // if (!search) { }
      if (!loadingMore) {
        $scope.curPage = 1;
      } else {
        $scope.curPage++;
      }
      let obj = {
        user_id: $localStorage.loggedInUserId,
        page_number: $scope.curPage,
        number_of_pages: 10,
        limit: 10,
      };
      $scope.isLoading = true;
      maintainService.traderList().post(obj, function (response) {
        console.log("traders :: before response=> ", $scope.traders);
        if (response.code == 200) {
          response.data.map((ele) => {
            $scope.traders.push(ele);
          });
        }
        $scope.isLoading = false;
      });
      console.log("$scope.traders => ", $scope.traders);
    };

    //go to maintenance creator's profile
    $scope.goToCreatorProfile = function (id, role) {
      if (role == roleId.agent) {
        $localStorage.userData.routeState = "agents_listing";
        $rootScope.navBarOptionSelected = "agents_listing";
        $location.path("/profile/" + id);
      } else if (role == roleId.tenant) {
        $localStorage.userData.routeState = "tenants_listing";
        $rootScope.navBarOptionSelected = "tenants_listing";
        $location.path("/tenant_profile/" + id);
      } else if (role == roleId.owner) {
        $localStorage.userData.routeState = " ";
        $rootScope.navBarOptionSelected = " ";
        $location.path("/owner_profile/" + id);
      } else if (role == roleId.ownAgency) {
        $localStorage.userData.routeState = "agency_profile";
        $rootScope.navBarOptionSelected = "agency_profile";
        $location.path("/agency_profile/" + id);
      }
    };
    $scope.isTaderPickFromSave = false;
    // $scope.traders = [];
    $scope.selectTraderFromSaved = function () {
      console.log("called =================>");
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

    $scope.goToTenantProfile = function (id) {
      $rootScope.navBarOptionSelected = "tenants_listing";
      $localStorage.userData.routeState = "tenants_listing";
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      $location.path("/tenant_profile/" + id);
    };
    /**
     * Function is to open add rating popup to ahent
     * @access private
     * @return json
     * Created
     * @smartData Enterprises (I) Ltd
     * Created Date
     */
    $scope.openReviewPopupForAgent = function (data, rate) {
      var modalInstance = ($scope.model = $uibModal.open({
        animation: false,
        templateUrl: "/frontend/modules/users/views/addReview.html",
        scope: $scope,
        controller: function ($uibModalInstance, $scope) {
          /* Rating section start from here */
          $scope.userMax = 5;
          /*
                        Rate is default set to 3
                    */
          $scope.qualityOfWorkRate = 0;
          $scope.punctualityRate = 0;
          $scope.communicationRate = 0;
          /*
                        Max value is default set to 5
                    */
          $scope.qualityOfWorkMax = 5;
          $scope.punctualityMax = 5;
          $scope.communicationMax = 5;

          $scope.filterMatch = "By best match";
          $scope.isUserReadonly = true;
          $scope.isReadonly = false;
          /*
                        label default set to average
                    */
          $scope.qualityOfWorkLabel = "";
          $scope.punctualityLabel = "";
          $scope.communicationLabel = "";
          /*
                        value to be used
                    */
          $scope.qualityOfWorkValue = 0;
          $scope.punctualityValue = 0;
          $scope.communicationValue = 0;
          /*
                       hover function for quality of work
                    */
          $scope.imageUrl = baseUrl + "/user_image/";
          $scope.userInfo = data;
          $scope.userRate = rate.data;
          $scope.outOFReviewer = rate.total_review;

          $scope.qualityOfWorkOver = function (value) {
            $scope.qualityOfWorkPercent =
              100 * (value / $scope.qualityOfWorkMax);
            $scope.qualityOfWorkValue = value;
            if (value == 1) {
              $scope.qualityOfWorkLabel = "Bad";
            } else if (value == 2) {
              $scope.qualityOfWorkLabel = "Poor";
            } else if (value == 3) {
              $scope.qualityOfWorkLabel = "Average";
            } else if (value == 4) {
              $scope.qualityOfWorkLabel = "Good";
            } else if (value == 5) {
              $scope.qualityOfWorkLabel = "Excellent!";
            }
          };
          /*
                       hover function for puntuality
                    */
          $scope.punctualityOver = function (value) {
            $scope.punctualityPercent = 100 * (value / $scope.qualityOfWorkMax);
            $scope.punctualityValue = value;
            if (value == 1) {
              $scope.punctualityLabel = "Bad";
            } else if (value == 2) {
              $scope.punctualityLabel = "Poor";
            } else if (value == 3) {
              $scope.punctualityLabel = "Average";
            } else if (value == 4) {
              $scope.punctualityLabel = "Good";
            } else if (value == 5) {
              $scope.punctualityLabel = "Excellent!";
            }
          };
          /*
                       hover function for communication
                    */
          $scope.communicationOver = function (value) {
            $scope.communicationPercent =
              100 * (value / $scope.qualityOfWorkMax);
            $scope.communicationValue = value;
            if (value == 1) {
              $scope.communicationLabel = "Bad";
            } else if (value == 2) {
              $scope.communicationLabel = "Poor";
            } else if (value == 3) {
              $scope.communicationLabel = "Average";
            } else if (value == 4) {
              $scope.communicationLabel = "Good";
            } else if (value == 5) {
              $scope.communicationLabel = "Excellent!";
            }
          };
          $scope.ratingStates = [
            { stateOn: "glyphicon-ok-sign", stateOff: "glyphicon-ok-circle" },
            { stateOn: "glyphicon-star", stateOff: "glyphicon-star-empty" },
          ];
          /* Rating section start from here */
          $scope.ok = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
          };
          $scope.addReview = function (reviewData) {
            blockUI.start();
            $scope.loginLoading = true;
            var agencyId;
            if ($localStorage.userData.agency_id) {
              agencyId = $localStorage.userData.agency_id._id
                ? $localStorage.userData.agency_id._id
                : $localStorage.userData.agency_id;
            }
            var postData = {
              review_by: $localStorage.loggedInUserId,
              review_to: data._id,
              comments: reviewData.review_comments,
              quality_of_work: $scope.qualityOfWorkValue,
              punctaulity: $scope.punctualityValue,
              communication: $scope.communicationValue,
              review_by_role: $localStorage.role_id,
            };
            maintainService.addReview().post(postData, function (response) {
              if (response.code == 200) {
                toastr.success("Review added successfully");
                $scope.getAgentOrTraderReview(data._id);
                $scope.loginLoading = false;
                $uibModalInstance.dismiss("cancel");
                blockUI.stop();
              } else {
                toastr.warning("Server is busy please try a while");
                blockUI.stop();
                $scope.getAgentOrTraderReview(data._id);
                $scope.loginLoading = false;
                $uibModalInstance.dismiss("cancel");
              }
            });
          };
          $scope.reviewData = {};
          $scope.isRatingFractional = false;
          $scope.frationalArray = [];
        },
      }));
      modalInstance.result.then(
        function (selectedItem) { },
        function () { }
      );
    };
    //go to agent's profile
    $scope.goToAgentProfile = function (id) {
      $location.path("/profile/" + id);
      $localStorage.userData.routeState = "agents_listing";
      $rootScope.navBarOptionSelected = "agents_listing";
    };

    $scope.openReviewPopup = function (mr_id, id, status) {
      blockUI.start();
      $scope.loginLoading = true;
      if (status == "yes") {
        var postData = {
          maintenence_id: mr_id,
          job_close_confirmation: 2,
        };

        maintainService
          .approveJobConfirmation()
          .post(postData, function (response) {
            if (response.code == 200) {
              $scope.openChat(mr_id, 13);
              toastr.success(response.message);
              socket.emit("maintenanceGroupChatHistory", {
                mr_id: $stateParams.id,
              });
            } else {
              toastr.error(response.message);
            }
            $scope.maintenanceDetail();
          });
      }
      // if ($localStorage.role_id != roleId.trader && $scope.created_logged_in_both == 'yes') {
      if ($localStorage.role_id != roleId.trader) {
        blockUI.stop();
        $scope.loginLoading = false;
        var userData = {
          userId: id,
          roleId: roleId.trader,
        };
        userService.getUserById().post(userData, function (response) {
          if (response.code == 200) {
            $scope.userInfo = response.data;
          }
        });

        var modalInstance = ($scope.model = $uibModal.open({
          animation: false,
          templateUrl: "/frontend/modules/maintenance/views/addReview.html",
          scope: $scope,
          controller: function ($uibModalInstance, $scope) {
            /* Rating section start from here */
            $scope.userRate = 0;
            $scope.userMax = 5;
            $scope.outOFReviewer = 0;
            /*
                            Rate is default set to 3
                        */
            $scope.qualityOfWorkRate = 0;
            $scope.punctualityRate = 0;
            $scope.communicationRate = 0;
            /*
                            Max value is default set to 5
                        */
            $scope.qualityOfWorkMax = 5;
            $scope.punctualityMax = 5;
            $scope.communicationMax = 5;

            $scope.filterMatch = "By best match";
            $scope.isUserReadonly = true;
            $scope.isReadonly = false;
            /*
                            label default set to average
                        */
            $scope.qualityOfWorkLabel = "";
            $scope.punctualityLabel = "";
            $scope.communicationLabel = "";
            /*
                            value to be used
                        */
            $scope.qualityOfWorkValue = 0;
            $scope.punctualityValue = 0;
            $scope.communicationValue = 0;
            /*
                           hover function for quality of work
                        */
            $scope.qualityOfWorkOver = function (value) {
              $scope.qualityOfWorkPercent =
                100 * (value / $scope.qualityOfWorkMax);
              $scope.qualityOfWorkValue = value;
              if (value == 1) {
                $scope.qualityOfWorkLabel = "Bad";
              } else if (value == 2) {
                $scope.qualityOfWorkLabel = "Poor";
              } else if (value == 3) {
                $scope.qualityOfWorkLabel = "Average";
              } else if (value == 4) {
                $scope.qualityOfWorkLabel = "Good";
              } else if (value == 5) {
                $scope.qualityOfWorkLabel = "Excellent!";
              }
            };
            /*
                           hover function for puntuality
                        */
            $scope.punctualityOver = function (value) {
              $scope.punctualityPercent =
                100 * (value / $scope.qualityOfWorkMax);
              $scope.punctualityValue = value;
              if (value == 1) {
                $scope.punctualityLabel = "Bad";
              } else if (value == 2) {
                $scope.punctualityLabel = "Poor";
              } else if (value == 3) {
                $scope.punctualityLabel = "Average";
              } else if (value == 4) {
                $scope.punctualityLabel = "Good";
              } else if (value == 5) {
                $scope.punctualityLabel = "Excellent!";
              }
            };
            /*
                           hover function for communication
                        */
            $scope.communicationOver = function (value) {
              $scope.communicationPercent =
                100 * (value / $scope.qualityOfWorkMax);
              $scope.communicationValue = value;
              if (value == 1) {
                $scope.communicationLabel = "Bad";
              } else if (value == 2) {
                $scope.communicationLabel = "Poor";
              } else if (value == 3) {
                $scope.communicationLabel = "Average";
              } else if (value == 4) {
                $scope.communicationLabel = "Good";
              } else if (value == 5) {
                $scope.communicationLabel = "Excellent!";
              }
            };
            $scope.ratingStates = [
              { stateOn: "glyphicon-ok-sign", stateOff: "glyphicon-ok-circle" },
              { stateOn: "glyphicon-star", stateOff: "glyphicon-star-empty" },
            ];
            /* Rating section start from here */
            $scope.ok = function () {
              $uibModalInstance.dismiss("cancel");
            };
            $scope.cancel = function () {
              $uibModalInstance.dismiss("cancel");
            };
            $scope.addReview = function (reviewData) {
              blockUI.start();
              $scope.loginLoading = true;
              var agencyId;
              if ($localStorage.userData.agency_id) {
                agencyId = $localStorage.userData.agency_id._id
                  ? $localStorage.userData.agency_id._id
                  : $localStorage.userData.agency_id;
              }
              var postData = {
                review_by: $localStorage.loggedInUserId,
                review_to: id,
                comments: reviewData.review_comments,
                quality_of_work: $scope.qualityOfWorkValue,
                punctaulity: $scope.punctualityValue,
                communication: $scope.communicationValue,
                review_by_role: $localStorage.role_id,
              };
              if (status == "yes") {
                postData.job_id = mr_id;
              }
              maintainService.addReview().post(postData, function (response) {
                if (response.code == 200) {
                  toastr.success("Review added successfully.");

                  var postData1 = {
                    user_id: id,
                    user_role: $localStorage.role_id,
                  };
                  $scope.check_review_permission(postData1);

                  $scope.loginLoading = false;
                  $scope.cancel();
                  blockUI.stop();
                } else {
                  toastr.warning("Server is busy please try a while");
                  blockUI.stop();
                  $scope.loginLoading = false;
                  $scope.cancel();
                }
                $scope.maintenanceDetail();
              });
            };
          },
        }));
        modalInstance.result.then(
          function (selectedItem) { },
          function () { }
        );
      }
    };

    $scope.category_list = function () {
      userService.getServiceCategoryList().get(function (response) {
        if (response.code == 200) {
          $scope.category_listing = response.data;
        }
      });
    };

    $scope.addressInitialize = function () {
      // $scope.maintenance.latitude = parseFloat(angular.element("#latitude").val());
      // $scope.maintenance.longitude = parseFloat(angular.element("#longitude").val());
      // $scope.getTraders();
      // console.log('angular.element("#address1").val() => ', angular.element("#address1").val());
      const input = document.getElementById("address1");
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener("place_changed", () => {
        console.log("event called => ");
        const place = autocomplete.getPlace();
        console.log("place =====================> ", place);
        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
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
    $scope.allTradersList = [];
    $scope.getTraders = function () {
      console.info("--------------------------");
      console.info("$scope.query =>", $scope.query);
      console.info("--------------------------");
      console.log(
        "getTraders    focus  ",
        $scope.maintenance,
        "   ===   ",
        $scope.maintenance.request_type
      );
      // console.log($scope.maintenance.address + " ---  " + typeof $scope.maintenance.request_type + " ---  " + $scope.maintenance.category_id)
      // && $scope.maintenance.category_id
      // && $scope.maintenance.category_id != ''
      if (
        $scope.maintenance.address &&
        $scope.maintenance.address != "" &&
        $scope.maintenance.request_type == 0
      ) {
        console.log("Inside    ");
        $scope.showTraderSearch = true;
        var obj = {};
        if ($scope.maintenance.address && $scope.maintenance.address != "")
          obj.address = $scope.maintenance.address;
        if (
          $scope.maintenance.category_id &&
          $scope.maintenance.category_id != ""
        )
          obj.categories_id = $scope.maintenance.category_id;
        // var obj = {
        // "address": maintenance.address,
        // "address": $scope.maintenance.address,
        // "categories_id": $scope.maintenance.category_id,
        // "categories_id": "5d3e9b6ce7406a34c8160748",
        // "search_text" : 'ra'
        // };
        if (obj) {
          maintainService
            .provious_existing_traders()
            .post(obj, function (response) {
              if (response.code == 200 && response.data) {
                $scope.traderData = response.data;
                console.log(
                  "$scope.traderData  :: Trader list ",
                  $scope.traderData
                );
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
        maintainService.getSavedTradersList().post(obj1, function (response) {
          if (response.code == 200) {
            $scope.traders = response.data;
            console.log("response.data :: saved traders => ", response.data);
          }
          blockUI.stop();
        });
      }
    };

    $scope.getMRList = function (value) {
      console.log(
        "$scope.public_list      ",
        $scope.public_list,
        "   ======",
        $scope.maintainList
      );
      $scope.maintainList = _.filter($scope.public_list, function (item) {
        console.log("item.categories_id[0]    ", item.categories_id[0]);
        if (
          new RegExp(value, "i").test(item.request_overview) ||
          new RegExp(value, "i").test(item.request_detail) ||
          new RegExp(value, "i").test(item.suburb) ||
          new RegExp(value, "i").test(item.postcode) ||
          new RegExp(value, "i").test(item.address) ||
          new RegExp(value, "i").test(item.budget) ||
          new RegExp(value, "i").test(item.request_id) ||
          new RegExp(value, "i").test(item.address_id) ||
          (item.categories_id &&
            item.categories_id[0] &&
            item.categories_id[0].name &&
            new RegExp(value, "i").test(item.categories_id[0].name))
        ) {
          console.log("yes   ", value);
          return item;
        } else {
          console.log("no exist");
        }
      });
    };

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
  }
})();
