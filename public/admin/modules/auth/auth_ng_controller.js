/**
 * Super Angular Controller
 * @author Ankur A
 * @created 10 August
 */
(function() {
    angular.module('TSM_ADMIN')
        .controller("AuthCtrl", AuthCtrl);
    AuthCtrl.$inject = [
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
        'localStorageService',
        'blockUI',
        'AdminService',
        'toastr',
        '$cookieStore',
        'AdminService'
    ];

    function AuthCtrl($state, $route, $scope, $localStorage, $rootScope, $http, $filter, $window, $location, $stateParams, localStorageService, blockUI, AdminService,toastr,$cookieStore,AdminService) {
        $scope.totalPropertyCount = 0;
        $scope.PropertySaleCount = 0;
        $scope.PropertyRentalCount = 0;
        $scope.totalUserCount = 0;
        $scope.remember = false;
         $scope.checkLogin = function (){
           if($rootScope.userlogin!=true || typeof($rootScope.userlogin)){
            $rootScope.userlogin = false;
           }if($rootScope.userlogin == true){
            $rootScope.userlogin = true;
           }
        }()
        /**
         * Function is used to get property count
         * @access private
         * @return json
         * Created by AnkurA
         * @smartData Enterprises (I) Ltd
         * Created Date 19-Sep-2017
         */
        $scope.getPropertyCount = function() {
            AdminService.getPropertySaleCount().get(function(response) {
                if (response.code == 200) {
                    $scope.PropertySaleCount = response.data;
                }
            })
            AdminService.getPropertyRentalCount().get(function(response) {
                if (response.code == 200) {
                    $scope.PropertyRentalCount = response.data;
                }
            })
            AdminService.getTotalPropertyCount().get(function(response) {
                if (response.code == 200) {
                    $scope.totalPropertyCount = response.data;
                }
            })
            AdminService.getRegisteredUsersCount().get(function(response) {
                if (response.code == 200) {
                    $scope.totalUserCount = response.data;
                }
            })
        };
        /**
         * Function is use to read cookies for remeber password
         * @access private
         * @return json
         * Created by Minakshi
         * @smartData Enterprises (I) Ltd
         * Created Date 16-August-2017
         */
        $scope.readcookie = function() {
            // $scope.Name="afs";
            if($cookieStore.get("email")!=="undefined")
            {
                $scope.admin={};
                $scope.admin.email = $cookieStore.get("email");
                $scope.admin.password = $cookieStore.get('password');
                $scope.remember = $cookieStore.get('remember');
            }   
            // $cookieStore.put("Name", $scope.Name);
            // console.log("$cookieStore",$cookieStore);
            // $scope.isRemebercheck = $scope.admin.remember ? true : false
        }
        $scope.rememberme = function(user) {
            $scope.email= user.email;
            $scope.password= user.password;
                if ($scope.remember == true) {
                    var exp = moment().add(30, 'days').format("YYYY-MM-DD");
                    $cookieStore.put("email", $scope.email,{ expires: exp });  
                    $cookieStore.put("password", $scope.password,{ expires: exp });
                    $cookieStore.put("remember", $scope.remember,{ expires: exp });
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
             * Function is use to verify forgot password link
             * @access private
             * @return json
             * Created by Minakshi
             * @smartData Enterprises (I) Ltd
             * Created Date 26-Sept-2017
             */
        $scope.forgotPasswordLink = function() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            $state.go('forgotPassword');
        }
          /**
         * Function is use to resend password(forgot password)
         * @access private
         * @return json
         * Created by Minakshi
         * @smartData Enterprises (I) Ltd
         * Created Date 11-Oct-2017
         */
        $scope.resendPassword = function (forgot) {
            // console.log("forgot", forgot);
            var str = forgot.email;
            forgot.email = str.toLowerCase();
            AdminService.AdminForgotPassword().post(forgot, function (response) {
                if (response.code == 200) {
                    toastr.success("An email has been sent to you with further instruction. So please check your email and reset password.");
                    // swal("An email has been sent to you with further instruction. So please check your email and reset password.")
                } else {
                    toastr.error("Sorry your email is not registered");
                    //swal("Sorry your email is not registered")
                }
            });
        }

        /**
         * Function is used for admin Login
         * @access private
         * @return json
         * Created by AnkurA
         * @smartData Enterprises (I) Ltd
         * Created Date 19-Sep-2017
         */
        $scope.login = function(loginData) {
            AdminService.adminLogin().post(loginData, function(response) {
                if (response.code == 200) {
                    $scope.userLogin = response.data;
                    $localStorage.adminData = response.data;
                    $rootScope.userlogin = true;
                    $localStorage.adminuserloggedIn = true;
                    $localStorage.token = response.token;
                    toastr.success('Successfully logged in');
                    $state.go('home');
                }else{
                      toastr.error('Either password or email is incorrect');
                }
            });
        }
          /**
         * Function is use to reset Password
         * @access private
         * @return json
         * Created by Minakshi
         * @smartData Enterprises (I) Ltd
         * Created Date 13-October-2017
         */
        $scope.resetPassword = function (reset, confirmPassword) {
            reset.id = $stateParams.id;
            if (reset.password != confirmPassword) {
                toastr.warning("New password doesn't match with confirm password ");
            }
            if (reset.password == confirmPassword) {
                AdminService.AdminResetPassword().post(reset, function (response) {
                    if (response.code == 200) {
                        toastr.success(response.message);
                        //swal(response.message);
                        $state.go('Login');
                    }
                    if (response.code == 700) {
                        toastr.error("Reset password token expires")
                        //swal("Reset password token expires")
                    } else {
                        $scope.message = response.message;
                        toastr.error($scope.message)
                        //swal($scope.message)
                    }
                });

            }
        }
    }
}());
