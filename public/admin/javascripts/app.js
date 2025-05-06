"use strict";

angular.module("Authentication", []);
angular.module("Home", []);
angular.module("communicationModule", []);
angular.module("Users", []);
angular.module("Jobs", []);
angular.module("Message", []);
angular.module("Notification", []);
angular.module("Company", []);

var twosidedPropertyMarket = angular.module('twosidedPropertyMarket', ['ngRoute', 'ngStorage', 'ngTable', 'ngResource', 'ui.grid', 'Authentication', 'Home', 'communicationModule', 'Users', 'Jobs', 'satellizer', 'Message', 'Notification', 'mgcrea.ngStrap.dropdown', 'ngSanitize', 'angularFileUpload', 'duScroll', 'ChatModule', 'socketService', 'Company', 'naif.base64','angular-loading-bar',"linkCredentialsServiceModule"])

// .factory('basicAuthenticationInterceptor', function() {

//  var basicAuthenticationInterceptor = {
//      request:function(config) {
//          config.headers['Authorization'] = 'Basic ' + appConstants.authorizationKey;
//          return config;
//      }
//  };

//  return basicAuthenticationInterceptor;

// })

.config(['$routeProvider', '$httpProvider', '$authProvider', '$locationProvider', function($routeProvider, $httpProvider, $authProvider, $locationProvider) {

    // $httpProvider.interceptors.push('basicAuthenticationInterceptor');


    $authProvider.facebook({
        clientId: facebookConstants.facebook_app_id,
        url: '/login/auth/facebook'
    });

    $authProvider.twitter({
        url: '/adminlogin/auth/twitter'
    });

    $authProvider.google({
        clientId: googleConstants.google_client_id,
        url: '/adminlogin/auth/google'
    });

    $routeProvider
        .when('/', {
            controller: 'homeController',
            templateUrl: '/modules/home/views/home.html',
            //activetab: 'home'
        })

    .when('/jobs', {
        controller: 'JobsController',
        templateUrl: '/modules/jobs/views/joblist.html'
            // ,
            // resolve: { isAuthenticated: doAuthenticate(0) }
    })

    .when('/jobsDetail/:job_id', {
        controller: 'JobsController',
        templateUrl: '/modules/jobs/views/jobDetail.html'
    })

    .when('/home', {
        controller: 'homeController',
        templateUrl: '/modules/home/views/home.html'
    })


    .when('/login', {
        controller: 'loginController',
        templateUrl: '/modules/authentication/views/login.html'
    })

    .when('/signup', {
        controller: 'loginController',
        templateUrl: '/modules/authentication/views/signup.html'
    })

    .when('/verify-user', {
        controller: 'loginController',
        templateUrl: '/modules/authentication/views/verify-user.html'
    })

    .when('/regenrateVerificationCode', {
        controller: 'loginController',
        templateUrl: '/modules/authentication/views/regenrateVerificationCode.html'
    })

    .when('/forgot-password', {
        controller: 'loginController',
        templateUrl: '/modules/authentication/views/forgot-password.html'
    })

    .when('/reset-password/:id', {
        controller: 'loginController',
        templateUrl: '/modules/authentication/views/reset-password.html'
    })

    .when('/users', {
        controller: "userController",
        templateUrl: "/modules/users/views/listuser.html"
    })

    .when('/userProfile/:user_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/userProfile.html",
        resolve: { isAuthenticated: doAuthenticate(2) }
    })

    .when('/postedJoblist/userApplied/viewAppliedUserProfile/:user_id/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userProfile.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/viewAppliedUserProfile/:user_id/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userProfile.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    //viewAssignedUserProfile start

    .when('/postedJoblist/userAssigned/viewAssignedUserProfile/:user_id/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userProfile.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/completeJoblist/userAssigned/viewAssignedUserProfile/:user_id/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userProfile.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/currentScheduledJob/userAssigned/viewAssignedUserProfile/:user_id/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userProfile.html",
        title:'scheduledjob',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/viewAssignedUserProfile/:user_id/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userProfile.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    //viewAssignedUserProfile end

    .when('/setting/:user_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/setting.html"
    })

    //Profile visible to other

    .when('/userVisibleProfile/:user_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/userVisibleProfile.html",
        // resolve: { isAuthenticated: doAuthenticate(2) }
    })

    .when('/seekerVisibleProfile/:user_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/seekerVisibleProfile.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    //user Job History

    .when('/userJobHistory/:user_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/userJobHistory.html",
        title:'jobHistory',
        resolve: { isAuthenticated: doAuthenticate(2) }
    })

    .when('/awardList/:user_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/awardViewList.html",
        title:'awardlist',
        resolve: { isAuthenticated: doAuthenticate(2) }
    })

    .when('/calanderView', {
        controller: "userController",
        templateUrl: "/modules/users/views/calanderView.html",
        title:'awardlist',
        resolve: { isAuthenticated: doAuthenticate(2) }
    })

    //jobHistoryDetail

    .when('/jobHistoryDetail/:job_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/jobHistoryDetail.html",
        resolve: { isAuthenticated: doAuthenticate(2) }
    })

    .when('/editProfile/:user_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/editProfile.html",
        resolve: { isAuthenticated: doAuthenticate(2) }
    })

    .when('/jobseekerDashboard', {
        controller: "userController",
        templateUrl: "/modules/users/views/jobseekerDashboard.html",
        title:'dashboard',
        resolve: { isAuthenticated: doAuthenticate(2) }
    })

    .when('/users/add', {
        controller: "userController",
        templateUrl: "/modules/users/views/adduser.html"
    })

    .when('/users/signup', {
        controller: "userController",
        templateUrl: "/modules/users/views/signup.html"
    })

    .when('/users/edit/:id', {
        controller: "userController",
        templateUrl: "/modules/users/views/adduser.html"
    })

    //Message
    .when('/messageinbox', {
        controller: "messageController",
        templateUrl: "/modules/messages/views/messageinbox.html"
    })

    .when('/messageDetail/:_id', {
        controller: "messageController",
        templateUrl: "/modules/messages/views/messageDetail.html"
    })

    .when('/messageSent', {
        controller: "messageController",
        templateUrl: "/modules/messages/views/messageSent.html"
    })

    .when('/messageTemplate', {
        controller: "messageController",
        templateUrl: "/modules/messages/views/messageTemplate.html"
    })

    //Employer Message

    .when('/pendingmsg', {
        controller: "loginController",
        templateUrl: "/modules/communication/views/pendingMsgList.html",
        title: 'message',
        resolve: { isAuthenticated: doAuthenticate(0) }
    })

    //Notification List

    .when('/notificationList', {
        controller: "notificationController",
        title: 'notify',
        templateUrl: "/modules/notifications/views/notificationList.html"
    })

    //jobcompletedNotes

    .when('/jobcompletedNotes/:job_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/jobcompletedNotes.html",
        //  resolve: { isAuthenticated: doAuthenticate(2) }

    })

    .when('/jobsDocuments/:jobId/:userId', {
        controller: "userController",
        templateUrl: "/modules/users/views/jobsDocuments.html",
        resolve: { isAuthenticated: doAuthenticate(1) }

    })

    //Employer 

    .when('/employerDashboard', {
        controller: "userController",
        templateUrl: "/modules/users/views/employerDashboard.html",
        title: 'dashboard',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/employerProfile/:user_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/employerProfile.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/editEmployerProfile/:user_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/editEmployerProfile.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/currentScheduledJob/:user_id', {
        controller: "userController",
        templateUrl: "/modules/users/views/currentScheduledJob.html",
        title:'scheduledjob',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })
    .when('/currentScheduledJob', {
        controller: "userController",
        templateUrl: "/modules/users/views/currentScheduledJob.html",
        title:'scheduledjob',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/allJoblist', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/allJoblist.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/postedJoblist', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/allPostedJoblist.html",
        title:'dashboard',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/completeJoblist', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/completeJoblist.html",
        title:'dashboard',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/pendingJoblist', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/pendingJoblist.html",
        title:'dashboard',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/cancelJoblist', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/cancelJoblist.html",
        title:'dashboard',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/postJob', {
        controller: "JobPostController", //"JobsController",
        templateUrl: "/modules/jobs/views/postJob.html",
        title: 'postjob',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/postJob/:jobId', {
        controller: "JobPostController", //"JobsController",
        templateUrl: "/modules/jobs/views/postJob.html",
        title: 'postjob',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/jobPreview/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/jobPreview.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/editJob/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/editJob.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/allAcceptJobHistory', {
        controller: "JobsController",
        templateUrl: "/modules/users/views/allAcceptJobHistory.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    // userApplied start

    .when('/postedJoblist/userApplied/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userApplied.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/userApplied/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userApplied.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    // userApplied end

    // userassigned start

    .when('/postedJoblist/userAssigned/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userAssigned.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/completeJoblist/userAssigned/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userAssigned.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/currentScheduledJob/userAssigned/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userAssigned.html",
        title:'scheduledjob',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/userAssigned/:job_id', {
        controller: "JobsController",
        templateUrl: "/modules/jobs/views/userAssigned.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    // userassigned end

    //companyDetail
    .when('/companyDetails', {
        controller: "companyController",
        templateUrl: "/modules/company/views/companyDetail.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    //chat module
    .when('/chat/:id', {
        controller: "chatController",
        templateUrl: "/modules/communication/views/chat.html",
        resolve: { isAuthenticated: doAuthenticate(2) }
    })

    .when('/userApplied/chat/:id', {
        controller: "chatController",
        templateUrl: "/modules/communication/views/chat.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/userAssigned/chat/:id', {
        controller: "chatController",
        templateUrl: "/modules/communication/views/chat.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    .when('/changepassword/:id', {
        controller: "userController",
        templateUrl: "/modules/users/views/changePassword.html"
    })

    // Gallery for jobseeker
    .when('/jobsRelatedDoc/:jobId', {
        controller: "userController",
        templateUrl: "/modules/users/views/jobsRelatedDoc.html",
        resolve: { isAuthenticated: doAuthenticate(2) }
    })

    // Gallery for Employee

    .when('/userDoc/:jobId/:userId', {
        controller: "userController",
        templateUrl: "/modules/users/views/userDoc.html",
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    //Feedback
    .when('/feedback/:job_id/:user_id/', {
        controller: "feedbackController",
        templateUrl: "/modules/jobs/views/feedback.html",
        resolve: { isAuthenticated: doAuthenticate(0) }
    })

    .when('/feedbackList/:user_id', {
        controller: "feedbackController",
        templateUrl: "/modules/jobs/views/feedbackList.html",
        resolve: { isAuthenticated: doAuthenticate(0) }
    })

    .when('/feedbackDetails/:job_id/:user_id', {
        controller: "feedbackController",
        templateUrl: "/modules/jobs/views/feedback&rating.html",
        resolve: { isAuthenticated: doAuthenticate(0) }
    })

    // For jobseeker details to invite for particular job
    .when('/jobsSeekerList/:jobId', {
        controller: 'JobsController',
        templateUrl: '/modules/jobs/views/jobsSeekerList.html',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    // To see invited jobseekers list for particular job

    .when('/invitees/:jobId', {
        controller: 'JobsController',
        templateUrl: '/modules/jobs/views/invitees.html',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    // To Upload job related docs
    .when('/uploadJobDocs/:job_id', {
        controller: 'JobsController',
        templateUrl: '/modules/jobs/views/jobDocuments.html',
        resolve: { isAuthenticated: doAuthenticate(1) }
    })

    // Seeker can view Upload job related docs
    .when('/viewJobDocument/:job_id', {
        controller: 'JobsController',
        templateUrl: '/modules/jobs/views/viewJobDocument.html',
        resolve: { isAuthenticated: doAuthenticate(2) }
    })



    .otherwise({
        templateUrl: '/modules/authentication/views/404.html'
    });

    //to remove the # from the URL
    //$locationProvider.html5Mode({enabled : true, requireBase : false});
    $locationProvider.html5Mode(true);
}])

.run(['$rootScope', '$location', '$http', '$localStorage', function($rootScope, $location, $http, $localStorage) {

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        // if (previous) {
        //     $localStorage.previous2 = $localStorage.previousUrl;
        //     $localStorage.previousUrl = previous.originalPath;
        // }

        // $rootScope.previousUrl = (previous) ? previous.originalPath : $localStorage.previousUrl;
        // $rootScope.previous2 = (previous) ? $localStorage.previousUrl : $localStorage.previous2;
          if (current.$$route) {
            $rootScope.title = current.$$route.title;
        } else {
            $rootScope.title = 'Error';
        }
    });

    var refreshFlag = false;
}]);

var doAuthenticate = function(tokenType) {

    return ["AuthenticationService", "$q", "$rootScope", "$location", "$localStorage", '$window', 'socket', function(AuthenticationService, $q, $rootScope, $location, $localStorage, $window, socket) {
        var deferred = $q.defer();
        AuthenticationService.isAuth(function(response) {
            if (response.code == 200) {
                //set localscope
                $localStorage.adminuserloggedIn = true;
                $localStorage.loggedInUserId = response.data.id;
                $localStorage.loggedInfirstname = response.data.firstname;
                $localStorage.role = response.data.role;
                // add user to chat room..
                socket.emit("addUser", { id: $localStorage.loggedInUserId });
                // get people to chat
                var loggedUser = {
                        _id: $localStorage.loggedInUserId,
                        firstname: $localStorage.loggedInfirstname,
                        role: $localStorage.role
                    }
                    //$scope.getUserforChat(loggedUser);
                socket.emit("pendingmsgs", loggedUser);
                //set rootscope
                $rootScope.authenticatedUser = response.data;
                $rootScope.authenticatedUser.useremail = response.data.email;
                $rootScope.authenticatedUser.fname = response.data.firstname;
                $rootScope.authenticatedUser.lname = response.data.lastname;
                $rootScope.role = response.data.role;
                $rootScope.userloggedIn = true;
                if (tokenType == response.data.role || tokenType == 0) {
                    deferred.resolve(true);
                } else {

                    $location.path("/unauthorised");
                }
            } else {
                $rootScope.userloggedIn = false;
                $localStorage.$reset();
                $location.path("/");
                deferred.resolve(true);
            }
        });
    }];
};
twosidedPropertyMarket.directive('showDuringResolve', function($rootScope) {

  return {
    link: function(scope, element) {

      element.addClass('ng-hide');

      var unregister = $rootScope.$on('$routeChangeStart', function() {
        element.removeClass('ng-hide');
      });

      scope.$on('$destroy', unregister);
    }
  };
});

twosidedPropertyMarket.controller("footerCtrl",["$scope","linkCredentials", function($scope,linkCredentials){
    linkCredentials.get(function(response){
        if(response.code==200){
            $scope.links=response.data.links;
        }
    });
}])

 // twosidedPropertyMarket.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
 //    // cfpLoadingBarProvider.includeBar = false;
 //    // cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
 //    //cfpLoadingBarProvider.spinnerTemplate = '<div style = "color: red"><span class="fa fa-spinner">Custom Loading Message...</div>';
 //  }])
// twosidedPropertyMarket.directive('resolveLoader', function($rootScope, $timeout) {

//   return {
//     restrict: 'E',
//     replace: true,
//     template: ' <div class="overlay text-center" style="position:absolute;padding:300px 0px; top:0;bottom:0;left:0;right:0;display:teble-cell"><span style="background: gray;font-weight: 500;opacity: 1;padding: 15px;"><i class="fa fa-refresh fa-spin fa-3x" style="vertical-align:middle; z-index: 10000;"></i> Please Wait..</span></div>',
//     link: function(scope, element) {

//       $rootScope.$on('$routeChangeStart', function(event, currentRoute, previousRoute) {
//         if (previousRoute) return;

//         $timeout(function() {
//           element.removeClass('ng-hide');
//         });
//       });

//       $rootScope.$on('$routeChangeSuccess', function() {
//         element.addClass('ng-hide');
//       });
//     }
//   };
// });


