"use strict";

(function () {
    angular.module('SYNC')
        .controller("loginController", loginController);
    loginController.$inject = [
        '$scope',
        '$rootScope',
        '$timeout',
        '$location',
        '$stateParams',
        'SweetAlert',
        'permissions',
        'APP_CONST',
        'Flash',
        'AuthenticationService',
        'toastr',
        '$localStorage',
        '$state',
        '$window',
        '$uibModal',
        '$q',
        '$cookieStore',
        '$auth',
        'userService',
        'PropertyService',
        'AgentService',
        'blockUI',
        '$http'
    ];

    function loginController($scope, $rootScope, $timeout, $location, $stateParams, SweetAlert, permissions, APP_CONST, Flash, AuthenticationService, toastr, $localStorage, $state, $window, $uibModal, $q, $cookieStore, $auth, userService, PropertyService, AgentService, blockUI, $params, $http) {
        $scope.loginLoading = false;
        $scope.role = {};
        $rootScope.userName;
        $rootScope.permission;
        $rootScope.isLoggedIn;
        $rootScope.name;

        $scope.login_form = {};
        $scope.step1 = {
            agent: roleId.agent,
            ownAgency: roleId.ownAgency,
            tenant: roleId.tenant,
            owner: roleId.owner,
            trader: roleId.trader,
            runStrataManagementCompany: roleId.runStrataManagementCompany,
            workForStrataManagementCompany: roleId.workForStrataManagementCompany
        };
        $scope.step3 = {};
        $scope.step3.checkedStatus = false;
        $scope.accountActivationData = {};
        $scope.accountActivationData.checkedStatus = false;
        $scope.role.value = $scope.step1.agent;
        // $scope.remember = false;
        $scope.user = {};
        var inputJSON = "";
        $scope.checked = true;
        $rootScope.show = false;
        $rootScope.user_id = $localStorage.loggedInUserId;

        $scope.showPassword = false;
        $scope.paramsUserId;
        $scope.userRoleId;
        $scope.agreementId;
        $scope.isTrader = $localStorage.role_id == roleId.trader ? true : false;

        $scope.checkforManagerRequest = function () {
            var user_id_ = $stateParams.id;
            // console.log("Name ==> ", $stateParams.name);
            if (user_id_ && ($stateParams.name == 'strata_manager' || $stateParams.name == 'property_manager' || $stateParams.name == 'property_owner')) {
                console.info('--------------------------')
                console.info('$stateParams =>', $stateParams, $location.search())
                console.info('--------------------------')
                let inviteByRole = $location.search()
                var user_obj = {};
                user_obj.user_id = user_id_;
                $scope.signup_status = 0;
                $rootScope.step2 = {};
                userService.getUserActiveRole().post(user_obj, function (response) {
                    if (response.code == 200) {
                        $scope.roleInformation = response.data;
                        $scope.roleInformation.map(function (item) {
                            if (item.role_id && item.role_id._id) {
                                if ($stateParams.name == 'strata_manager') {
                                    if (item.role_id._id == roleId.runStrataManagementCompany) {
                                        $scope.signup_status = 1;

                                    }
                                }
                                if ($stateParams.name == 'property_manager') {
                                    if (item.role_id._id == roleId.ownAgency) {
                                        $scope.signup_status = 1;

                                    }
                                }
                                if ($stateParams.name == 'property_owner') {
                                    if (inviteByRole.role && inviteByRole.role === 'trader') {
                                        if (item.role_id._id == roleId.trader) {
                                            $scope.signup_status = 1;
                                        }
                                    } else if (item.role_id._id == roleId.agent) {
                                        $scope.signup_status = 1;
                                    }
                                }
                            } else {
                                $scope.error = 'Invalid URL called for Sign Up';
                                $location.path('/signup');
                            }
                        });

                        if ($scope.signup_status == 0) {
                            $scope.error = 'Invalid URL called for Sign Up';
                            $location.path('/signup');
                        } else {
                            if ($stateParams.name == 'property_owner') {
                                $rootScope.step2.role_id = roleId.owner;
                            }
                            if ($stateParams.name == 'strata_manager') {
                                $rootScope.step2.role_id = roleId.workForStrataManagementCompany;
                            }
                            if ($stateParams.name == 'property_manager') {
                                $rootScope.step2.role_id = roleId.agent;
                            }

                            var user_obj = {};
                            user_obj.userId = user_id_;
                            userService.getUserById().post(user_obj, function (user_response) {

                                if (user_response.code == 200) {
                                    if (user_response.data && user_response.data.agency_id && user_response.data.agency_id._id) {
                                        $rootScope.step2.agency_id = user_response.data.agency_id._id;
                                    }
                                    if (inviteByRole.role && inviteByRole.role === 'trader') {
                                        if (user_response.data && user_response.data._id) {
                                            $rootScope.step2.trader_id = user_response.data._id;
                                        }
                                    } else if (user_response.data && user_response.data._id) {
                                        $rootScope.step2.agent_id = user_response.data._id;
                                    }
                                }
                            });
                            // console.log("$rootScope.step2  ", $rootScope.step2);
                        }
                    } else {
                        $scope.error = 'Invalid URL called for Sign Up';
                        $location.path('/signup');
                    }
                });
            } else if ($stateParams.name == 'account_activation' || $stateParams.name == 'confirm_role') {
                console.log('user_id_ => ', user_id_);
                $scope.userRoleId = $stateParams.role_id;
                $scope.paramsUserId = user_id_;
                $scope.agreementId = $stateParams.agreement_id;
                console.log('$stateParams.token => ', $stateParams.token);
                if ($stateParams.token) {

                    let activationCode = $stateParams.token;
                    AuthenticationService.validateAccountActivationCode({ "activation_code": activationCode }, function (response) {
                        console.log('response => ', response);
                        if (response.code == 401) {
                            toastr.error(response.message);
                            $scope.message = response.message;
                            $state.go('home');
                        } else {
                            if (response.code == 200) {
                                $scope.accountActivationData.email = response.data.email
                            }
                        }
                    });



                }

            } else {
                $scope.error = 'Invalid URL called for Sign Up';
                $location.path('/signup');
            }
        }

        $scope.toggleShowPassword = function () {
            $scope.showPassword = !$scope.showPassword;
        }

        $scope.todayDate = new moment().format();
        $scope.getDate = function () {
            var d = moment().format('YYYY-MM-DD h:mm:ss a');
            var n = moment().format("MMM Do") + ', ' + moment().format('LT');
            return n;
        }

        /**
         * Function is use to read cookies for remeber password
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 16-August-2017
         */
        $scope.readcookie = function () {
            if ($cookieStore.get("email") !== "undefined") {
                $scope.user = {};
                $scope.user.email = $cookieStore.get("email");
                $scope.user.password = $cookieStore.get('password');
                // $scope.remember = $cookieStore.get('remember');
            }
        }
        /**
         * Function is use for remember me functionality
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 16-August-2017
         */
        $scope.rememberme = function (user) {
            $scope.email = user.email;
            $scope.password = user.password;
            if ($scope.remember == true) {
                var exp = moment().add(30, 'days').format("YYYY-MM-DD");
                $cookieStore.put("email", $scope.email, { expires: exp });
                $cookieStore.put("password", $scope.password, { expires: exp });
                $cookieStore.put("remember", $scope.remember, { expires: exp });
            } else if ($scope.remember == false) {
                $cookieStore.remove("email");
                $cookieStore.remove("password");
                $cookieStore.remove("remember");
            } else {
                var exp = moment().add(30, 'days').format("YYYY-MM-DD");
                $cookieStore.put('email', user.email, { expires: exp });
                $cookieStore.put('password', user.password, { expires: exp });
                $cookieStore.put('remember', true, { expires: exp });
            }

        }
        /**
         * Function is use to resend password
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 16-August-2017
         */
        $scope.resendPassword = function (forgot) {
            $scope.loginLoading = true;
            if (typeof forgot != 'undefined') {
                blockUI.start();
                $rootScope.userEmail = {};
                var str = forgot.email;
                forgot.email = str.toLowerCase();
                $rootScope.userEmail.email = str;
                AuthenticationService.resendPassword(forgot, function (response) {
                    if (response.code == 200) {
                        $state.go('reGeneratePassword');
                        $scope.loginLoading = false;
                        blockUI.stop();
                    } else {
                        var err = (response.message) ? response.message : 'Something went wrong. Please try again later.';
                        toastr.error(err);
                        $scope.loginLoading = false;
                        blockUI.stop();
                    }
                });
                blockUI.stop();
            } else {
                $scope.loginLoading = false;
                toastr.error("Please enter your email address");
            }

        }
        $scope.reGeneratePassword = function () {
            $scope.loginLoading = true;
            var forgot = {};
            forgot = $rootScope.userEmail;
            AuthenticationService.resendPassword(forgot, function (response) {
                blockUI.start();
                if (response.code == 200) {
                    toastr.success("An email has been sent to you with further instruction. So please check your email and reset password.");
                    // $state.go('login');
                    $scope.loginLoading = false;
                    blockUI.stop();
                } else {
                    toastr.error("Sorry your email is not registered");
                    $scope.loginLoading = false;
                    blockUI.stop();
                }
            });
        }
        /**
         * Function is use to reset Password
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 16-August-2017
         */
        $scope.resetPassword = function (reset, confirmPassword) {
            $scope.loginLoading = true;
            if (typeof reset != 'undefined' && typeof confirmPassword) {
                var obj = {};
                obj.id = $stateParams.id;
                obj.password = reset.password;
                if (reset.password != confirmPassword) {
                    toastr.warning("Password doesn't match with Confirm password ");
                    $scope.loginLoading = false;
                    blockUI.stop();
                }
                if (reset.password == confirmPassword) {
                    AuthenticationService.resetPassword(obj, function (response) {
                        blockUI.start();
                        if (response.code == 200) {
                            toastr.success(response.message);
                            $state.go('login');
                            $scope.loginLoading = false;
                            blockUI.stop();
                        }
                        else if (response.code == 700) {
                            toastr.error("Reset password token expires");
                            $scope.loginLoading = false;
                            blockUI.stop();

                        }
                        else if (response.code == 400) {
                            $scope.message = response.message;
                            toastr.error($scope.message);
                            $state.go('forgotPassword');
                            $scope.loginLoading = false;
                            blockUI.stop();
                        }
                    });

                }

            } else {
                toastr.error("Please fill the form completely");
                $scope.loginLoading = false;
            }
        }

        /**
         * Function is use for facebook login
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 6-Sept-2017
         */
        $scope.authenticateLogin = function (provider) {
            $auth.authenticate(provider)
                .then(function (response) {
                    if (response.data.code == 200) {
                        $localStorage.userLoggedIn = true;
                        $localStorage.isLoggedIn = true;
                        $localStorage.loggedInUserId = response.data.data.data._id;
                        $localStorage.loggedInfirstname = response.data.data.data.firstname;
                        $localStorage.loggedInlastname = response.data.data.data.lastname;
                        $rootScope.userName = response.data.data.firstname + ' ' + response.data.data.data.lastname;
                        $localStorage.token = response.data.data.token;
                        $localStorage.facebook = "facebook"
                        $state.go("dashboard");
                    }
                })
                .catch(function (response) { });
        };
        /**
         * Function is use to verify user account is active or not
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 6-Sept-2017
         */
        $scope.verifycode = function (verify) {
            var id = $stateParams.id;
            var user = {};
            user.username = localStorage.getItem("email");
            verify.uid = id;
            AuthenticationService.activeAccount(verify, function (response) {
                if (response.code == 401) {
                    toastr.error(response.message);
                    $scope.message = response.message;
                    $state.go('home');
                } else {
                    if (response.code == 200) {
                        if (response.message === "Already your account is activated") {
                            toastr.success("Already your account is activated");
                        } else {
                            toastr.success(response.message);
                        }
                        $state.go('login');
                    }
                }
            });
        }
        $scope.getRoleListInfo = function () {
            blockUI.start();
            $scope.roleList;
            userService.getRoleList().get(function (response) {
                if (response.code == 200) {
                    console.log(' response.data :: response of api  => ', response.data);
                    $scope.roleList = response.data;
                    console.log('roleList => ', $scope.roleList);
                    blockUI.stop();
                }
                blockUI.stop();
            });

            $scope.staticUserRole = [
                // {
                //     _id: "5a1d113016bed22901ce050b",
                //     description: "Agency Owner",
                //     title: "I own an agency (Principle)"
                // },
                // {
                //     _id: "5a12b4fe6b53784648d45479",
                //     description: "Agent",
                //     title: "I am a property manager (PM)"
                // },
                // {
                //     _id: "5a1d27076ef60c3d44e9b378",
                //     description: "Strata Principle",
                //     title: "I run a strata management company (Strata Principle)"
                // },
                // {
                //     _id: "5a1d2be334240d4077dff209",
                //     description: "Strata Manager",
                //     title: "I work for a strata management company(SM)"
                // },
                // {
                //     _id: "5a1d11c016bed22901ce050c",
                //     description: "Tenant",
                //     title: "I am a tenant (Tenant)"
                // },
                {
                    _id: "5a1d26b26ef60c3d44e9b377",
                    description: "Trader",
                    title: "I am a Trades Person (Trade)"
                },
                {
                    _id: "5a1d295034240d4077dff208",
                    description: "Owner",
                    title: "I am a Consumer (Property Owner/Tenant)"
                },

            ]
            console.log('staticUserRole => ', $scope.staticUserRole);

        }
        $scope.registrationStep1 = function (type) {
            $rootScope.step2 = {};
            $state.go('signupStep2');
            $rootScope.step2.role_id = type.value;

        }
        $scope.registrationstep2 = function (info) {
            // console.log("info", info);
            blockUI.start();
            $scope.loginLoading = true;
            let inviteByRole = $location.search()
            if (($scope.signup_form.$invalid) == false) {
                if (info.password === info.confirmPassword && info.checkedStatus == true) {
                    var obj = {};
                    obj = info;
                    obj.role_id = $rootScope.step2.role_id;
                    obj.agency_id = $rootScope.step2.agency_id;
                    if (inviteByRole.role && inviteByRole.role === 'trader') {
                        if ($stateParams.name == 'property_owner') {
                            obj.trader_id = $rootScope.step2.trader_id;
                            obj.agency_id = "";
                            obj.agent_id = "";
                        }
                    } else if ($stateParams.name == 'property_owner') {
                        obj.agent_id = $rootScope.step2.agent_id;
                        obj.agency_id = "";
                        obj.trader_id = "";
                    }
                    AuthenticationService.saveUser(obj, function (response) {
                        if (response.statusCode == 401) {
                            toastr.error(response.message);
                        } else if (response.code == 406) {
                            const userEmail = info.email;
                            console.log('userEmail => ', userEmail);
                            toastr.warning(
                                'Congrats! Your email is already registered with us.' +
                                ' To complete registration simply Click Here to receive activation email.',
                                {
                                    timeOut: 12000,
                                    onTap: function () {
                                        AuthenticationService.resendAccountActivationMail({ email: userEmail }, function (response) {
                                            console.log('response => ', response);
                                            if (response['code'] == '200') {
                                                toastr.success(response['message']);
                                            }
                                        }, err => {
                                            console.log('err => ', err);
                                            toastr.error(err['message']);
                                        });
                                    }
                                });
                        } else {
                            if (response.code == 201 && response.message === "Email already exist.") {
                                toastr.warning("This email already exist");
                            } else if (response.code == 200) {
                                $rootScope.name = response.data.firstname;
                                toastr.success("An email has been sent to you with your account activation instruction. So please check your email");;
                                $state.go('login');
                            }
                        }
                    });
                } else if (info.password != info.confirmPassword) {
                    toastr.warning("Confirm Password & Password are not same");
                } else if (info.checkedStatus == false) {
                    toastr.warning("Please agree to the Synciit Conditions");
                }
                $scope.loginLoading = false;
                blockUI.stop();
            } else {
                toastr.error("Please fill the form completely");
                $scope.loginLoading = false;
                blockUI.stop();
            }
        }
        $scope.getRegisteredUserName = function () {
            $scope.data;
            $scope.data = $rootScope.name;
            // console.log($rootScope.name, "$rootScope.name");
        }
        $scope.activeUser = function () {
            var id = $stateParams.id;
            var user = {};
            user.user_id = id;
            userService.directLogin().post(user, function (response) {
                blockUI.start();
                var errorMessage = '';
                // $localStorage.role = response.data.role;
                // $rootScope.role = response.data.role;
                var obj = {};
                obj.userId = $localStorage.loggedInUserId;
                if (response.code == 200) {
                    $localStorage.userLoggedIn = true;
                    $localStorage.isLoggedIn = true;
                    $localStorage.loggedInfirstname = response.data.userInfo.firstname;
                    $localStorage.loggedInlastname = response.data.userInfo.lastname;
                    $localStorage.loggedInUserId = response.data.userInfo._id;
                    $localStorage.userData = response.data.userInfo;
                    $rootScope.userName = response.data.firstname + ' ' + response.data.lastname;
                    $localStorage.token = response.token;
                    $localStorage.role_id = response.data.roleInfo.role_id;
                    $scope.loader = false;
                    $rootScope.isLoggedIn = true;
                    $state.go('welcome');
                    blockUI.stop();
                } else {
                    toastr.warning("Activation link expires or your account is already activated");
                    $state.go('login');
                    blockUI.stop();
                }

            });

        };

        /**
         * Confirm User role to continue
         */
        $scope.confirmRoleSubmit = function () {
            console.log('confirm function => ');
            console.log('$scope.paramsUserId :: confirm function => ', $scope.paramsUserId);
            console.log('$scope.userRoleId :: confirm function => ', $scope.userRoleId);

            console.log('$scope.agreementId => ', $scope.agreementId);
            AuthenticationService.confirmRole({ "user_id": $scope.paramsUserId, "role_id": $scope.userRoleId }, function (response) {
                console.log('response => ', response);
                if (response.code == 401) {
                    toastr.error(response.message);
                    $scope.message = response.message;
                    $state.go('home');
                } else {
                    if (response.code == 200) {
                        $location.path('/detail_agreement/' + $scope.agreementId);
                    }
                }
            });

        };
        /**
         * Account Activation as per user role
         */
        $scope.accountActivationSubmit = function (formdata) {
            console.log('account activation function => ', formdata);
            console.log('scope.agreementId => ', $scope.agreementId);
            console.log('$scope.userRoleId => ', $scope.userRoleId);
            if (formdata.checkedStatus) {
                $scope.loginLoading = true;
                blockUI.start();
                let reqObj = {
                    first_name: formdata.firstname,
                    last_name: formdata.lastname,
                    mobile_no: formdata.mobile_no,
                    password: formdata.password,
                    activation_code: $stateParams.token,
                    role_id: $scope.userRoleId
                }
                AuthenticationService.accountActivationRegistration(reqObj, function (response) {
                    console.log('response => ', response);
                    if (response.code == 401) {
                        toastr.error(response.message);
                        $scope.message = response.message;
                        $state.go('home');
                    } else {
                        if (response.code == 200) {
                            console.log('reqObj.email => ', formdata.email);
                            console.log('reqObj.password => ', reqObj.password);
                            if (formdata.email && reqObj.password) {
                                AuthenticationService.Login({
                                    "email": formdata.email,
                                    "password": reqObj.password
                                }, function (response) {
                                    console.log('response :: Login => ', response);
                                    if (response.code == 200) {
                                        var obj = {};
                                        $rootScope.isLoggedIn = true;
                                        obj.userId = $localStorage.loggedInUserId;
                                        $localStorage.userLoggedIn = true;
                                        $localStorage.isLoggedIn = true;
                                        $localStorage.role_id = ($localStorage.role_id) ? $localStorage.role_id : response.data.roleInfo.role_id;
                                        $localStorage.loggedInUserId = response.data.userInfo._id;
                                        $localStorage.loggedInfirstname = response.data.userInfo.firstname;
                                        $localStorage.loggedInlastname = response.data.userInfo.lastname;
                                        $localStorage.userData = response.data.userInfo;
                                        $rootScope.userName = response.data.userInfo.firstname + ' ' + response.data.userInfo.lastname;
                                        $localStorage.token = response.token;
                                        var send_data = {
                                            user_id: $localStorage.loggedInUserId,
                                            role_id: $localStorage.role_id
                                        };

                                        AuthenticationService.getUserDefaultRollId(send_data, function (response_data) {
                                            if (response_data.code === 200) {
                                                $localStorage.defaultRoleId = (response_data.data) ? response_data.data.role_id : '';
                                                $rootScope.masterRoleId = $localStorage.defaultRoleId;
                                            }
                                        });
                                        $location.path('/detail_agreement/' + $scope.agreementId);
                                        toastr.success('Account activated successfully.');
                                        blockUI.stop();
                                        $scope.loginLoading = false
                                    } else {
                                        if (response.code == 400) {
                                            toastr.error(response.message);
                                            // $scope.activeMyAccount = false;
                                            blockUI.stop();
                                            $scope.loginLoading = false;
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                toastr.error('Please fill all fields.');
            }
        }

        /**
         * Function is use navbar to home
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 16-Aug-2017
         */

        $scope.home = function () {
            $location.path('/home');
        }
        /**
         * Function is use to regenerate verification code
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 6-Sept-2017
         */
        $scope.regenrateVarificationCode = function (userEmail) {
            AuthenticationService.regenrateVarificationCode({
                userEmail: userEmail
            }, function (response) {
                localStorage.setItem('userId', response.userId);
                localStorage.setItem('email', response.email);
                localStorage.setItem('password', response.password);
                if (response.statusCode == 401) {
                    toastr.error(response.message);
                    $scope.message = response.message;
                    $scope.error = response.message;
                } else {
                    toastr.success(response.message);
                    $scope.message = response.message;
                    $location.path('/verify-user');
                }

            });

        }
        /**
         * Function is use to login
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 6-Sept-2017
         */
        // , remember
        $scope.login = function (user) {
            $scope.loginLoading = true;
            // console.log("hello called");
            blockUI.start();
            var userInfo = {};
            userInfo = user;
            user = {};
            if (typeof userInfo.email != 'undefined' && typeof userInfo.password != 'undefined') {
                $scope.loader = true;
                var userEmail = (typeof userInfo.email != 'undefined') ? userInfo.email : '';
                userInfo.email = userEmail.toLowerCase();
                AuthenticationService.Login(userInfo, function (response) {
                    // console.log("Login response", response)
                    var errorMessage = '';
                    if (response.code == 200) {
                        var obj = {};
                        $rootScope.isLoggedIn = true;
                        obj.userId = $localStorage.loggedInUserId;
                        $localStorage.userLoggedIn = true;
                        $localStorage.isLoggedIn = true;
                        $localStorage.role_id = ($localStorage.role_id) ? $localStorage.role_id : response.data.roleInfo.role_id;
                        $localStorage.loggedInUserId = response.data.userInfo._id;
                        $localStorage.loggedInfirstname = response.data.userInfo.firstname;
                        $localStorage.loggedInlastname = response.data.userInfo.lastname;
                        $localStorage.userData = response.data.userInfo;
                        $rootScope.userName = response.data.userInfo.firstname + ' ' + response.data.userInfo.lastname;
                        $localStorage.token = response.token;
                        $scope.loader = false;
                        $state.go('dashboard');
                        // window.location.reload();
                        // window.location = baseURL_for_site + '/#!/dashboard';
                        // if (remember == true) {
                        //     $scope.rememberme(userInfo);
                        // }
                        $scope.loginLoading = false;

                        var send_data = {
                            user_id: $localStorage.loggedInUserId,
                            role_id: $localStorage.role_id
                        };

                        AuthenticationService.getUserDefaultRollId(send_data, function (response_data) {
                            if (response_data.code === 200) {
                                $localStorage.defaultRoleId = (response_data.data) ? response_data.data.role_id : '';
                                $rootScope.masterRoleId = $localStorage.defaultRoleId;
                            }
                        });
                        //$scope.getUserDefaultRollId();
                        blockUI.stop();
                        //$scope.getUserRollId();
                    } else {
                        $scope.loginLoading = false;

                        $rootScope.isLoggedIn = false;
                        errorMessage = response.message;
                        if (response.code == 400) {
                            toastr.error(errorMessage);
                            $scope.activeMyAccount = false;
                            $scope.user.password = '';
                            $scope.login_form.password.$touched = false;
                            $scope.loginLoading = false;

                            blockUI.stop();
                        } else if (response.code == 406) {
                            console.log('userInfo => ', userInfo);
                            const userEmail = userInfo.email;
                            console.log('userEmail => ', userEmail);
                            $scope.user = {};
                            toastr.warning(
                                'Congrats! Your email is already registered with us.' +
                                ' To complete registration simply Click Here to receive activation email.',
                                {
                                    timeOut: 12000,
                                    onTap: function () {
                                        AuthenticationService.resendAccountActivationMail({ email: userEmail }, function (response) {
                                            console.log('response => ', response);
                                            if (response['code'] == '200') {
                                                toastr.success(response['message']);
                                            }
                                        }, err => {
                                            console.log('err => ', err);
                                            toastr.error(err['message']);
                                        });
                                    }
                                });
                            $scope.login_form.username.$touched = false;
                            $scope.login_form.password.$touched = false;
                            $scope.loginLoading = false;

                            blockUI.stop();
                        } else if (response.code == 404) {
                            $scope.user = {};
                            toastr.error(errorMessage);
                            $scope.login_form.username.$touched = false;
                            $scope.login_form.password.$touched = false;
                            $scope.loginLoading = false;

                            blockUI.stop();
                        } else {
                            $scope.user = {};
                            $scope.login_form.username.$touched = false;
                            $scope.login_form.password.$touched = false;
                            $scope.loginLoading = false;

                            toastr.error(errorMessage);
                            blockUI.stop();
                        }
                        $scope.loader = false;
                        blockUI.stop();
                    }
                });

            } else {
                $scope.loginLoading = false;
                if (typeof userInfo.email == 'undefined' && typeof userInfo.password == 'undefined') {
                    toastr.error("Please fill the form completely");
                }


                blockUI.stop();
            }
        };
        /**
         * Function For login with Facebook
         * @access private
         * @returns json
         * created date 27-04-2020
         */
        $scope.socialLogin = function (provider, role) {
            console.log('facebooklogin function => ', provider);
            console.log('role => ', role);
            $auth.authenticate(provider)
                .then(function (response) {
                    console.log('response ====> ', response);
                    if (response) {
                        let obj = {};
                        // console.log('response.config.data => ', response.config.data);
                        if (role && role.value) {
                            obj = { ...response.config.data, role_id: role.value }
                        } else {
                            obj = { ...response.config.data }
                        }
                        console.log('obj => ', obj);
                        if (obj) {
                            if (provider === 'facebook') {
                                AuthenticationService.fbLogin(obj, function (res) {
                                    $scope.loginLoading = true;
                                    // console.log("hello called");
                                    blockUI.start();
                                    console.log('res => ', res);
                                    console.log('res.code => ', res.code);
                                    var errorMessage = '';
                                    if (res.code == 200) {
                                        var obj = {};
                                        $rootScope.isLoggedIn = true;
                                        obj.userId = $localStorage.loggedInUserId;
                                        $localStorage.userLoggedIn = true;
                                        $localStorage.isLoggedIn = true;
                                        $localStorage.role_id = ($localStorage.role_id) ? $localStorage.role_id : res.data.roleInfo.role_id;
                                        $localStorage.loggedInUserId = res.data.userInfo._id;
                                        $localStorage.loggedInfirstname = res.data.userInfo.firstname;
                                        $localStorage.loggedInlastname = res.data.userInfo.lastname;
                                        $localStorage.userData = res.data.userInfo;
                                        $rootScope.userName = res.data.userInfo.firstname + ' ' + res.data.userInfo.lastname;
                                        $localStorage.token = res.token;
                                        $scope.loader = false;
                                        $state.go('dashboard');
                                        // window.location.reload();
                                        // window.location = baseURL_for_site + '/#!/dashboard';
                                        // if (remember == true) {
                                        //     $scope.rememberme(userInfo);
                                        // }
                                        $scope.loginLoading = false;

                                        var send_data = {
                                            user_id: $localStorage.loggedInUserId,
                                            role_id: $localStorage.role_id
                                        };

                                        AuthenticationService.getUserDefaultRollId(send_data, function (response_data) {
                                            if (response_data.code === 200) {
                                                $localStorage.defaultRoleId = (response_data.data) ? response_data.data.role_id : '';
                                                $rootScope.masterRoleId = $localStorage.defaultRoleId;
                                            }
                                        });
                                        //$scope.getUserDefaultRollId();
                                        blockUI.stop();
                                        //$scope.getUserRollId();
                                    } else {
                                        $scope.loginLoading = false;
                                        $rootScope.isLoggedIn = false;
                                        errorMessage = res.message;
                                        if (res && res.code == 500) {
                                            $scope.user = {};
                                            toastr.error(res.message);
                                            blockUI.stop();
                                        }
                                        $scope.loader = false;
                                        blockUI.stop();
                                    }
                                }, err => {
                                    console.log('err => ', err);
                                    toastr.error(err.message);
                                });
                            } else if (provider === 'google') {
                                AuthenticationService.gLogin(obj, function (res) {
                                    $scope.loginLoading = true;
                                    // console.log("hello called");
                                    blockUI.start();
                                    console.log('res => ', res);
                                    var errorMessage = '';
                                    if (res.code == 200) {
                                        var obj = {};
                                        $rootScope.isLoggedIn = true;
                                        obj.userId = $localStorage.loggedInUserId;
                                        $localStorage.userLoggedIn = true;
                                        $localStorage.isLoggedIn = true;
                                        $localStorage.role_id = ($localStorage.role_id) ? $localStorage.role_id : res.data.roleInfo.role_id;
                                        $localStorage.loggedInUserId = res.data.userInfo._id;
                                        $localStorage.loggedInfirstname = res.data.userInfo.firstname;
                                        $localStorage.loggedInlastname = res.data.userInfo.lastname;
                                        $localStorage.userData = res.data.userInfo;
                                        $rootScope.userName = res.data.userInfo.firstname + ' ' + res.data.userInfo.lastname;
                                        $localStorage.token = res.token;
                                        $scope.loader = false;
                                        $state.go('dashboard');
                                        // window.location.reload();
                                        // window.location = baseURL_for_site + '/#!/dashboard';
                                        // if (remember == true) {
                                        //     $scope.rememberme(userInfo);
                                        // }
                                        $scope.loginLoading = false;

                                        var send_data = {
                                            user_id: $localStorage.loggedInUserId,
                                            role_id: $localStorage.role_id
                                        };

                                        AuthenticationService.getUserDefaultRollId(send_data, function (response_data) {
                                            if (response_data.code === 200) {
                                                $localStorage.defaultRoleId = (response_data.data) ? response_data.data.role_id : '';
                                                $rootScope.masterRoleId = $localStorage.defaultRoleId;
                                            }
                                        });
                                        //$scope.getUserDefaultRollId();
                                        blockUI.stop();
                                        //$scope.getUserRollId();
                                    } else {
                                        $scope.loginLoading = false;
                                        $rootScope.isLoggedIn = false;
                                        errorMessage = res.message;
                                        if (res && res.code == 500) {
                                            $scope.user = {};
                                            toastr.error(res.message);
                                            blockUI.stop();
                                        }
                                        $scope.loader = false;
                                        blockUI.stop();
                                    }
                                }, err => {
                                    toastr.error(err.message);
                                })
                            }
                        }
                    }
                });

            // let check = $auth.getPayload();

            // console.log('check => ', check);

            // let token = $auth.getToken();
            // console.log('token => ', token);
        }

        /**
         * Function is used to get default role id
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 6-Sept-2017
         */
        // $scope.getUserDefaultRollId=function(){
        //     var obj = {};
        //     obj.user_id = $localStorage.loggedInUserId;
        //     AuthenticationService.getUserDefaultRoll().post(obj2, function (response) {
        //         if (response.code == 200) {
        //             console.log('response.data',response.data);
        //             // obj.role_id = response.data.role_id;
        //             // $localStorage.role_id =  obj.role_id;
        //             // blockUI.stop();
        //         }
        //     });
        // }
        /**
         * Function is use to verify user
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 6-Sept-2017
         */
        $scope.VerifyUser = function () {
            $scope.cancel();
            $location.path('/verify-user');
        }
        /**
         * Function is use to verify forgot password link
         * @access private
         * @return json
         * Created by
         * @smartData Enterprises (I) Ltd
         * Created Date 6-Sept-2017
         */
        $scope.forgotPasswordLink = function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $state.go('forgotPassword');
        }
        $rootScope.displayName = $localStorage.loggedInfirstname;
        String.prototype.isNumber = function () {
            return /^\d+$/.test(this);
        }
        $scope.authenticate = function (provider) {
            $auth.authenticate(provider)
                .then(function (response) { })
                .catch(function (response) { });
        }

        $scope.roleSelected = function (roleData) {
        }
        $scope.getWelcomeScreen = function () {
            $rootScope.canCreateProperty = ($localStorage.role_id == roleId.agent || $localStorage.role_id == roleId.ownAgency || $localStorage.role_id == roleId.owner) ? true : false;
            $rootScope.name = $localStorage.loggedInfirstname;
        }
        $scope.propertyListing = function () {
            $state.go('createProperty');
        }
        /**
        * Function is use to get user info & save the password
        * @access private
        * @return json
        * Created by
        * @smartData Enterprises (I) Ltd
        * Created Date
        */
        $scope.getUserInfo = function () {
            if ($state.current.name == 'newUsers') {
                var obj = {};
                obj.userId = $stateParams.id;
                AuthenticationService.registrationData(obj, function (response) {
                    if (response.code == 200) {
                        $scope.userData = response.data;
                        $scope.userData.checkedStatus = false;
                        // console.log("$scope.userData.hasOwnProperty('password')", $scope.userData.hasOwnProperty('password'));
                        if ($scope.userData.hasOwnProperty('password') == true && $scope.userData.password != "") {
                            toastr.success('You have already set the password for your account');
                            $state.go("login");
                        }

                    } else {
                        toastr.error("Incorrect url");
                    }
                });
            }
        }
        /**
       * Function is use to save the password of new invited user
       * @access private
       * @return json
       * Created by
       * @smartData Enterprises (I) Ltd
       * Created Date
       */
        $scope.submitPassword = function (userInfo) {
            if (userInfo.password === userInfo.confirmPassword && userInfo.checkedStatus == true) {
                var obj = {};
                obj.userId = userInfo._id;
                obj.password = userInfo.password;
                AuthenticationService.saveInvitedUser(obj, function (response) {
                    if (response.code == 200) {
                        toastr.success('Successfully saved your password');
                        $state.go("login");
                    } else {
                        toastr.warning('Server is busy please try after some time');
                    }
                });
            } else if (userInfo.password != userInfo.confirmPassword) {
                toastr.warning("Confirm Password & Password are not same");
            } else if (userInfo.checkedStatus == false) {
                toastr.warning("Please agree to the Synciit Conditions");
            }
        }

        //To check the reset password link
        $scope.checkResetPasswordLink = function () {
            blockUI.start();
            var obj = {};
            obj.id = $stateParams.id;
            userService.checkResetPasswordLink().post(obj, function (response) {
                if (response.code == 404) {
                    toastr.error('Sorry! you are accessing an already expired link');
                    $state.go("forgotPassword");
                    blockUI.stop();
                } else {
                    blockUI.stop();
                }

            });
        }

        $scope.user_id = 0;
        $scope.check_tenent_request = function () {

            if ($stateParams.id && $stateParams.id != '') {

                var obj = {};
                $scope.user_id = obj.user_id = $stateParams.id;
                obj.role_id = roleId.tenant;
                userService.check_user_valid().post(obj, function (response) {
                    if (response.code == 200) {

                        if (response.data) {
                            if (response.data.tenant_request_status == '0') {

                            }
                            else if (!response.data.tenant_request_status) {
                                toastr.error('Invalid request');
                                $location.path('/login');
                            }
                            else if (response.data.tenant_request_status == '1' || response.data.tenant_request_status == '2') {
                                toastr.error('You have already sent your response.');
                                $location.path('/login');
                            }
                        }
                    } else {
                        toastr.error('Invalid Request.');
                        $location.path('/login');
                    }
                });
            } else {
                toastr.error('Invalid Request.');
                $location.path('/login');
            }
            // blockUI.stop();
        }

        $scope.update_tentant_status = function (status) {

            if (status == '1' || status == '2') {
                var obj = {};
                $scope.user_id = obj.user_id = $stateParams.id;
                obj.role_id = roleId.tenant;

                userService.check_user_valid().post(obj, function (response) {
                    if (response.code == 200) {
                        if (response.data && response.data.tenant_request_status && response.data.tenant_request_status != 0) {
                            toastr.error('You have already sent your response.');
                            $location.path('/login');
                        } else {

                            var obj = {};
                            obj.user_id = $scope.user_id;
                            obj.tenant_request_status = status;
                            obj.role_id = roleId.tenant;
                            obj.status = status;

                            userService.update_tanent_status().post(obj, function (response) {
                                if (response.code == 200) {
                                    toastr.success(response.message);
                                    $location.path('/login');
                                } else {
                                    toastr.error('Invalid Request.');
                                    $location.path('/login');
                                }
                            });
                        }
                    } else {
                        toastr.error('Invalid Request.');
                        $location.path('/login');
                    }
                });
            }
        }
    }
}());
