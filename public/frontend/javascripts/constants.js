// var baseUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
// var baseUrl = "http://52.64.215.66:5095";
// var baseUrl = "http://52.34.207.5:5095"; 

// var facebook_client_id = "870499776350043";

// for staging - syncitt
// var facebook_client_id = "241632193622159";
var facebook_client_id = "1017305537170257";
// production - ownly
// var facebook_client_id = "628195454704182";

var baseUrl_development_public = 'http://syncitt.world/'
var baseUrl_production_public = 'https://ownly.com.au/'

var baseUrl_development_site = 'http://portal.syncitt.world'
var baseUrl_production_site = 'https://portal.ownly.com.au'

var baseUrl = location.protocol + '//' + location.hostname + ':5095';
// var baseUrl = 'http://13.54.34.150:5095';
var baseURL_for_site = location.protocol + '//' + location.hostname + ':5094';
// console.log("API URL ==> ",baseUrl);
// var baseUrl = 'http://localhost:5095';

// for staging - syncitt
var stripe_key = 'pk_test_kpzcl6wcferYLu6J73j9rwIi00yXh4xYoA';
var baseUrl = "https://portal.ownly.com.au:5095";
// for Production
// var stripe_key = 'pk_live_mqPmqCz4RvwfOy4xdbnL8lst00At7CDrc3';

// var stripe_key = global.gConfig.stripePublishableKey;

var roleId = {
    agent: "5a12b4fe6b53784648d45479",
    ownAgency: "5a1d113016bed22901ce050b",
    tenant: "5a1d11c016bed22901ce050c",
    owner: "5a1d295034240d4077dff208",
    runStrataManagementCompany: "5a1d27076ef60c3d44e9b378",
    workForStrataManagementCompany: "5a1d2be334240d4077dff209",
    trader: "5a1d26b26ef60c3d44e9b377"
}
var noticeBoardRoles = [
    { name: "Agent", _id: "5a12b4fe6b53784648d45479" },
    { name: "Tenant", _id: "5a1d11c016bed22901ce050c" },
    { name: "Property Owner", _id: "5a1d295034240d4077dff208" },
    { name: "Agency Owner", _id: "5a1d113016bed22901ce050b" },
    { name: "Run Strata Management Company", _id: "5a1d27076ef60c3d44e9b378" },
    { name: "Work For Strata Management Company", _id: "5a1d2be334240d4077dff209" }
]
var role = {
    agent: "agents",
    ownAgency: "ownAgencies",
    tenant: "tenants",
    owner: "owners",
    runStrataManagementCompany: "runStrataManagementCompany",
    workForStrataManagementCompany: "workForStrataManagementCompany",
    trader: "trader"
}

age_numbers = [];
for (i = 0; i <= 100; i++) {
    if (i == 0)
        age_numbers.push({ value: i, label: 'Less than 1' });
    else
        age_numbers.push({ value: i, label: i });
}

var age_groups = [
    {
        value: 0,
        label: "Under 12 years old"
    },
    {
        value: 1,
        label: "12-17 years old"
    },
    {
        value: 2,
        label: "18-24 years old"
    },
    {
        value: 3,
        label: "25-34 years old"
    },
    {
        value: 4,
        label: "35-44 years old"
    },
    {
        value: 5,
        label: "45-54 years old"
    },
    {
        value: 6,
        label: "55-64 years old"
    },
    {
        value: 7,
        label: "65-74 years old"
    }
]

var relationships = [
    {
        value: 0,
        label: "Spouse"
    },
    {
        value: 1,
        label: "Son"
    },
    {
        value: 2,
        label: "Daughter"
    },
    {
        value: 3,
        label: "Father"
    },
    {
        value: 4,
        label: "Mother"
    },
    {
        value: 5,
        label: "Grand Father"
    },
    {
        value: 6,
        label: "Grand Mother"
    }
]

var vehicle_types = [
    {
        value: 0,
        label: "Convertible"
    },
    {
        value: 1,
        label: "Crossover"
    },
    {
        value: 2,
        label: "Hatchback "
    },
    {
        value: 3,
        label: "Sedan"
    },
    {
        value: 4,
        label: "SUV"
    },
    {
        value: 5,
        label: "Other"
    }
];

// var vehicle_types = [
//     {
//         value: 0,
//         label: "Two-wheeler"
//     },
//     {
//         value: 1,
//         label: "Four-wheeler"
//     }
// ]

var pet_types = [
    {
        value: 0,
        label: "Amphibians"
    },
    {
        value: 1,
        label: "Bird"
    },
    {
        value: 2,
        label: "Cat"
    },
    {
        value: 3,
        label: "Dog"
    },
    {
        value: 4,
        label: "Fish"
    },
    {
        value: 5,
        label: "Horse"
    },
    {
        value: 6,
        label: "Reptile"
    },
    {
        value: 7,
        label: "Small Rodent"
    }
]

var weekdays = [
    {
        name: "Sunday",
        value: "0"
    },
    {
        name: "Monday",
        value: "1"
    },
    {
        name: "Tuesday",
        value: "2"
    },
    {
        name: "Wednesday",
        value: "3"
    },
    {
        name: "Thursday",
        value: "4"
    },
    {
        name: "Friday",
        value: "5"
    },
    {
        name: "Saturday",
        value: "6"
    }
]

var agent_specific_questions = [
    {
        name: "Has your tenancy ever been terminated by a landlord or agent?",
        value: "1"
    },
    {
        name: "Has you ever been refused a property by any landlord agent?",
        value: "2"
    },
    {
        name: "Are you in debt to another landlord agent?",
        value: "3"
    },
    {
        name: "Have any deductions ever been made from your rental bond?",
        value: "4"
    },
    {
        name: "Is there any reason known to you that would affect your future rental payments?",
        value: "5"
    },
    {
        name: "Do you have any other applications pending on the other properties?",
        value: "6"
    },
    {
        name: "Do you currently own a property",
        value: "7"
    },
    {
        name: "Are you considering buying a property after this tenancy or in the near future?",
        value: "8"
    },

];

var day_options = {
    0: "7 days a week",
    1: "Weekdays only",
    2: "Weekends only",
    3: "Every day except"
}

var country = "Australia";

var MaintenanceState = {
    sent: 1,
    accepted: 2,
    booked: 3,
    completed: 5,
    closed: 4,
    due: 6
}

var austriliaState = [
    "New South Wales",
    "Australian Capital Territory",
    "Victoria",
    "Queensland",
    "South Australia",
    "Western Australia",
    "Tasmania",
    "Northern Territory"
]

var webservices = {
    //authentication   floorLevel 
    "authenticate": baseUrl + "/api/userLogin",
    "forgot_password": baseUrl + "/api/forgotPassword",
    "signup": baseUrl + "/api/userRegister",
    "activateUserAccount": baseUrl + "/api/activateUserAccount",
    "resetpassword": baseUrl + "/api/resetUserPassword",
    "facebookLogin": baseUrl + "/api/auth/facebooklogin",
    "googleLogin": baseUrl + "/api/auth/googlelogin",
    "subscription_plan_list": baseUrl + "/api/subscription_plan_list",
    "subscribe_plan": baseUrl + '/api/stripe_subscription',
    "update_credit_card": baseUrl + '/api/update_stripe_card_details',
    "cancelSubscription": baseUrl + "/api/cancelSubscription",
    "resendActivationMail": baseUrl + "/api/resend_account_activation_mail",
    "confirmUserRole": baseUrl + "/api/confirmUserRole",
    "account_activation_registration": baseUrl + "/api/account_activation_registration",

    //property
    "createProperty": baseUrl + "/api/createProperty",
    "createPropertyApplication": baseUrl + "/api/createPropertyApplication",
    "getTenantedProperty": baseUrl + "/api/getTenantedPropertyList",
    "getPropertySales": baseUrl + "/api/getSalesProperty",
    "userLogOut": baseUrl + "/api/userLogout",
    "getPropertyListing": baseUrl + "/api/allProperty",
    "getDatabaseProperty": baseUrl + "/api/getDatabaseProperty",
    "singlePropertyDetail": baseUrl + "/api/singleProperty",
    "getMyProperitesList": baseUrl + "/api/getPropertyListById",
    "postProperty": baseUrl + "/api/propertyPost",
    "rentalPropertyPriceSort": baseUrl + "/api/getRentalPropertyPriceSort",
    "deleteProperty": baseUrl + "/api/deletePropertyById",
    "getPropertyOwner": baseUrl + "/api/getPropertyOwner",
    "latestPropertySortByPsf": baseUrl + "/api/getLatestPropertySortByPsf",
    "savePropertyAsDraft": baseUrl + "/api/savePropertyAsDraft",
    "getAmenities": baseUrl + "/api/getAmenites",
    "updatePropertyById": baseUrl + "/api/updatePropertyById",
    "createPropertyOwner": baseUrl + "/api/addPropertyOwner",
    "getAgencyProperty": baseUrl + "/api/getPropertyByAgentId",
    "addToFavProperty": baseUrl + "/api/addToFavouritesProperty",
    "getPropertyListingBySearch": baseUrl + "/api/getAllPropertyBySearch",
    "getPropertyAgreementDetails": baseUrl + "/api/getAgreementForPropertyDetail",
    "getPropertyTenantHistory": baseUrl + "/api/getTenanciesHistory",
    "getPropertyMaintenanceHistory": baseUrl + "/api/getMaintenanceByProperty",
    "getPropertyForAgentRemoval": baseUrl + "/api/getAgentRemovalProperties",
    "deleteProperty": baseUrl + "/api/deletePropertyById",
    "uploadPropertyDocs": baseUrl + "/api/getPropertyDataForUploadingDocument",
    "checkUserPropertyRelation": baseUrl + "/api/isUserAssociatedWithProperty",

    // individual chat count
    "getPropertyById": baseUrl + "/api/singleProperty",
    "unreadChatNotificationSeller": baseUrl + "/api/chatNotificationUnreadMsgSeller",
    //user service 
    "getUserById": baseUrl + "/api/getUserDetails",
    "send_customer_enquiry": baseUrl + "/api/send_customer_enquiry",
    "getAgentProperty": baseUrl + "/api/getPropertyByAgentId",
    "getFavTenantList": baseUrl + "/api/getFavTenants",
    "getStatisticsCount": baseUrl + "/api/getStatisticsData",
    //application
    "getpropertyApplicationByPropertyid": baseUrl + "/api/getpropertyApplicationByPropertyid",
    "getpropertyApplicationByid": baseUrl + "/api/getpropertyApplicationByid",
    "updateapplicationStatus": baseUrl + "/api/updateapplicationStatus",
    //"updateUserProfile": baseUrl + "/api/updateProfile",
    "updateUserProfile": baseUrl + "/api/updateUserProfile",
    "updateAvailability": baseUrl + "/api/updateAvailability",
    "updateDocumentationStatus": baseUrl + "/api/updateDocumentationStatus",
    "updateOccupacy": baseUrl + "/api/updateOccupacy",
    "updateUserPassword": baseUrl + "/api/changePassword",
    //user notifications 
    "updateNotification": baseUrl + "/api/updateUserNotificationSettings",
    "getNotification": baseUrl + "/api/getUserNotification",
    "uploadUserImage": baseUrl + "/api/updateUserPic",
    "updateAvatarPic": baseUrl + "/api/updateAvatarPic",
    "userNotificationStatus": baseUrl + "/api/getUserNotificationStatus",
    "getRoleList": baseUrl + "/api/roles",
    "lastRoleLogged": baseUrl + "/api/loggedInUserRole",
    "getUserRoleId": baseUrl + "/api/getRoleIdFromUserId",
    "getuserNotificationStatus": baseUrl + "/api/userNotificationStatus",
    "saveUserNotificationStatus": baseUrl + "/api/saveNotificationStatus",
    "userPermission": baseUrl + "/api/getUserPermission",
    "saveRoles": baseUrl + "/api/saveUserMultiRoles",
    "registrationInfo": baseUrl + "/api/userDataOnRegistration",
    "saveInvitedUserPassword": baseUrl + "/api/saveInvitedUserPassword",
    "userNotifications": baseUrl + "/api/notificationList",
    "updateUserBannerImage": baseUrl + "/api/updateBannerPic",
    "updateAgencyBannerImage": baseUrl + "/api/updateAgencyBannerImage",
    "getUserDefaultRollId": baseUrl + "/api/getUserDefaultRoles",
    "directLogin": baseUrl + "/api/directLogin",
    "userRoles": baseUrl + "/api/getUserRoles",
    "getReviewForUser": baseUrl + "/api/getUserReview",
    "getUnreadDashboardMessages": baseUrl + "/api/getUnreadChat",
    "getActiveMaintenanceList": baseUrl + "/api/getActiveMaintenanceList",
    "getAllnGeneralThread": baseUrl + "/api/generalThreadForAll",
    "getMaintenanceThread": baseUrl + "/api/generalThreadForMaintenance",
    "notificationRead": baseUrl + "/api/markNotificationAsRead",


    //message
    "getUserMessage": baseUrl + "/api/getMessageChatUsers",
    "markMessageAsRead": baseUrl + "/api/markMessageAsRead",
    "sendMailForChat": baseUrl + "/api/sendMailForChat",

    //tenant
    "newTenant": baseUrl + "/api/addNewTenant",
    "tenantList": baseUrl + "/api/tenantsList",
    "sendMessage": baseUrl + "/api/sendMessage",
    "tenantDatabaseList": baseUrl + "/api/allTenentsFromDatabase",
    "propertyListingInAddTenant": baseUrl + "/api/getPropertyForAddingTenant",
    "getTenantNameOnPropertyDetail": baseUrl + "/api/TenantListWithinProperty",
    "getUserActiveRole": baseUrl + "/api/getUserActiveRoles",
    "getAgreementOnTenantProfile": baseUrl + "/api/getTenantAgreementsForProfile/:id",
    "check_user_valid": baseUrl + "/api/check_user_valid",
    "update_tanent_status": baseUrl + "/api/update_tanent_request_status",

    //trader
    "traderList": baseUrl + "/api/tradersList",
    "tradersListForMR": baseUrl + "/api/tradersListForMR",
    "getServiceCategoryList": baseUrl + "/api/getServiceCategory",
    "getTraderOptionList": baseUrl + "/api/tradersOptionList",
    "getTraderJobHistoryList": baseUrl + "/api/tradersJobHistory",
    "getAllUSerReview": baseUrl + "/api/getTraderAllReviews/:id",
    "getTenantUSerReview": baseUrl + "/api/GetUserRolesReview",
    "getSavedTradersList": baseUrl + "/api/getAllSavedTraders",
    "provious_existing_traders": baseUrl + "/api/provious_existing_traders",
    //Agency 
    "getAgencyByAgentId": baseUrl + "/api/getAgencyById",
    "getAgencyProperties": baseUrl + "/api/getAcencyProperties",
    "getAgencyAgentList": baseUrl + "/api/agentsListWithInAgency",
    "getMyAgentList": baseUrl + "/api/agentsListWithInAgency",
    "agentsListByLinkedAgency": baseUrl + "/api/agentsListByLinkedAgency",
    "getAllAgencies": baseUrl + "/api/getAgencies",
    "userAssociationWithAgency": baseUrl + "/api/agencyAssociationRequest",
    "getUserNoticeBoard": baseUrl + "/api/noticeboardList",
    "addToFavTrader": baseUrl + "/api/addToFavouritesUser",
    "getFavPropertyListing": baseUrl + "/api/getFaviouratePropertyList",
    "getWatchersList": baseUrl + "/api/getWatchersList/:id",
    "addPropertyManager": baseUrl + "/api/addAgentsByPrinciple",
    "addReview": baseUrl + "/api/addReview",
    "agencyProfileData": baseUrl + "/api/getAgencyProfile",
    "addResponse": baseUrl + "/api/addResponse",
    //  maintenance
    "removeWatcher": baseUrl + "/api/removeUserFromWatcher",
    "maintenanceList": baseUrl + "/api/maintenanceList",
    "addMaintenance": baseUrl + "/api/addMaintenance",
    "addMR": baseUrl + "/api/addMR",
    "getDocumentList": baseUrl + "/api/getUploadedDocument",
    "getIdentificationDocumentList": baseUrl + "/api/getUploadedIdentificationDocument",
    "detailMaintenenace": baseUrl + "/api/getMaintenanceDetail/:id",
    "addToFav": baseUrl + "/api/addDocumentToFav",
    "getFavDocumentList": baseUrl + "/api/getFavUploadedDocument",
    "deleteDocument": baseUrl + "/api/deleteDocument",
    "deleteIdentificationDocument": baseUrl + "/api/deleteIdentificationDocument",
    "maintenceProperty": baseUrl + "/api/propertyListForMaintenance",
    "acceptDenyMaintenanceReq": baseUrl + "/api/acceptorDeniedJob",
    "counterProposal": baseUrl + "/api/counterProposals",
    "applyForQuote": baseUrl + "/api/applyForQuote",
    "hire_decline_trader": baseUrl + "/api/hire_decline_trader",
    "completeMaintJob": baseUrl + "/api/completeJob",
    "getTenantForwardList": baseUrl + "/api/maintenanceRequestByTenant",
    "forwardRequest": baseUrl + "/api/forwardMaintenanceRequest",
    "cancelRequest": baseUrl + "/api/cancelMaintenanceRequest",
    "approvedCounterProposal": baseUrl + "/api/acceptDeclineProposalRequest",
    "declineCounterProposal": baseUrl + "/api/acceptDeclineProposalRequest",
    "getCounterProposals": baseUrl + "/api/getCounterProposals",
    "declineJobConfirmation": baseUrl + "/api/confirmDeclineCompleteJob",
    "approveJobConfirmation": baseUrl + "/api/confirmDeclineCompleteJob",
    "pickedTraderList": baseUrl + "/api/pickFromYourSavedTraders",
    // agreement 
    "getTenantForAgreement": baseUrl + "/api/getTenantListInProperty/:id",
    "getPropertyOwnerForAgreement": baseUrl + "/api/getOwnerListInProperty/:id",
    "addAgreement": baseUrl + "/api/addAgreements",
    "agreementListing": baseUrl + "/api/agreementList",
    "getAgreementDetail": baseUrl + "/api/agreementDetail/:id",
    "deleteAgreement": baseUrl + "/api/deleteAgreement/:id",
    "editAgreement": baseUrl + "/api/editRentalcases",
    "agreementListInAddTenant": baseUrl + "/api/getAgreementByProperty/:id",
    "agreementBulkListing": baseUrl + "/api/agreementBulkUploadListing",
    //agent
    "agentRemoval": baseUrl + "/api/agentRemovalsRequest",
    "getAgentList": baseUrl + "/api/agentsList",
    "agentsListWithSearch": baseUrl + "/api/agentsListWithSearch",
    "getStartaList": baseUrl + "/api/startaUserList",
    "updateAgentExistingPropertyImg": baseUrl + "/api/updateExistingAgentPropertyImage",
    "agentProfileData": baseUrl + "/api/getAgentProfile",
    "validate_account_activation_code": baseUrl + "/api/validate_account_activation_code",
    "activate_account": baseUrl + "/api/activate_account",
    "bulk_delete_agents": baseUrl + "/api/bulkDeleteAgents",

    // AgencyHub
    "agencyhub": baseUrl + '/api/agencyhub',

    //notice board

    "addNoticeBoard": baseUrl + "/api/addNoticeboard",
    "noticeBoardListing": baseUrl + "/api/noticeboardList",
    "addNoticePost": baseUrl + "/api/addNoticeboardPost",
    "getNoticeBoardDetail": baseUrl + "/api/noticeBoardDetail/:id",
    "getPostDetail": baseUrl + "/api/noticeboardPostDetail/:id",
    "getPropertyListForstarta": baseUrl + "/api/getPropertyListForstarta",
    "editPost": baseUrl + "/api/editNoticeboardPost/:id",
    "deletePost": baseUrl + "/api/deleteNoticeboardPost/:id",
    "deleteNoticeBoard": baseUrl + "/api/deleteNoticeBoard/:id",
    "getStatisticsData": baseUrl + "/api/getAdminStatisticsData",
    "editNoticeboard": baseUrl + "/api/editNoticeboard",
    "noticeBoardAddToFavourite": baseUrl + "/api/addToFavNoticeboard",
    "getFavNoticeBoard": baseUrl + "/api/getFaviourateNoticeboardList",
    "getUserCount": baseUrl + "/api/getUserCountsViaProperties",

    //chat
    "getChatUserList": baseUrl + "/api/getChatUsers",
    "updateChatIsRead": baseUrl + "/api/updateMessageAsRead",

    //msg
    "messageList": baseUrl + "/api/messagesList",
    //Adv.search
    "globalSearch": baseUrl + "/api/gobalSearch",

    //file search
    "fileSearch": baseUrl + "/api/getYourFileBySearch",
    "addUserToTag": baseUrl + "/api/addDocumentToTags",
    //disputes
    "addDisputes": baseUrl + "/api/addDisputes",
    "getDisputes": baseUrl + "/api/getDisputes",
    "getDisputesById": baseUrl + "/api/getDisputesById",
    "updateDisputeStatus": baseUrl + "/api/updateDisputeStatusById",
    "searchDispute": baseUrl + "/api/getSearchedDisputes",

    //check reset password link
    "checkResetPasswordLink": baseUrl + "/api/resetUserPasswordLinkExist",
    //Inspection 
    "getInspectionDate": baseUrl + "/api/dashboardInspection",
    "updateRevealContactNumber": baseUrl + "/api/updateRevealContactNumber",
    "getCategoriesBusinessnamesList": baseUrl + "/api/getCategoriesBusinessnamesList",
    "directLoginActivatedAccount": baseUrl + "/api/directLoginActivatedAccount"
}
var appConstants = {
    "authorizationKey": "dGF4aTphcHBsaWNhdGlvbg=="
}

var headerConstants = {
    "json": "application/json"
}


