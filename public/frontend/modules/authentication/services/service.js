'use strict'

angular.module('SYNC')

    .factory('AuthenticationService', ['communicationService', '$rootScope',
        function (communicationService, $rootScope) {
            var service = {};
            service.Login = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.authenticate, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            };

            service.logout = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.userlogout, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            };

            service.isAuth = function (callback) {
                communicationService.resultViaGet(webservices.userIsAuth, appConstants.authorizationKey, headerConstants.json, "xyz", function (response) {
                    callback(response.data);
                });
            };

            service.resendPassword = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.forgot_password, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }

            service.fbLogin = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.facebookLogin, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }

            service.gLogin = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.googleLogin, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }

            service.resetPassword = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.resetpassword, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }

            service.saveUser = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.signup, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }

            service.activeAccount = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.activateUserAccount, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }

            service.regenrateVarificationCode = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.regenrateVarificationCode, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }

            service.facebookLogin = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.facebookLogin, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }
            service.saveInvitedUser = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.saveInvitedUserPassword, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }
            service.registrationData = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.registrationInfo, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            };
            service.getUserDefaultRollId = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.getUserDefaultRollId, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            };
            service.resendAccountActivationMail = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.resendActivationMail, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }
            service.confirmRole = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.confirmUserRole, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }
            service.validateAccountActivationCode = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.validate_account_activation_code, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }
            service.accountActivationRegistration = function (inputJsonString, callback) {
                communicationService.resultViaPost(webservices.account_activation_registration, appConstants.authorizationKey, headerConstants.json, inputJsonString, function (response) {
                    callback(response.data);
                });
            }
            return service;
        }
    ])