// var baseUrl = "http://52.64.215.66:5095";
// var baseUrl = "http://13.210.134.130:5095";
// var facebook_client_id = "870499776350043";

// for staging - syncitt
var facebook_client_id = "1017305537170257";
// var facebook_client_id = "241632193622159";
// production - ownly
// var facebook_client_id = "628195454704182";

//var baseUrl = location.protocol+'//'+location.hostname+'5075';
var baseUrl = location.protocol + '//' + location.hostname + ':5095';
// var baseUrl = 'http://3.104.181.36:5095';
var roleId = {
    agent: "5a12b4fe6b53784648d45479",
    ownAgency: "5a1d113016bed22901ce050b",
    tenant: "5a1d11c016bed22901ce050c",
    owner: "5a1d295034240d4077dff208",
    runStrataManagementCompany: "5a1d27076ef60c3d44e9b378",
    workForStrataManagementCompany: "5a1d2be334240d4077dff209",
    trader: "5a1d26b26ef60c3d44e9b377"
}
var webservices = {
    //dashboard counts   floorLevel
    "getPropertySaleCount": baseUrl + "/api/getPropertySaleCount",
    "getPropertyRentalCount": baseUrl + "/api/getPropertyRentCount",
    "getTotalPropertyCount": baseUrl + "/api/getTotalPropertyCount",
    "getRegisteredUsersCount": baseUrl + "/api/getRegisteredUsersCount",
    "getUnapprovedProperty": baseUrl + "/api/unApprovedProperty",
    "getSingleProperty": baseUrl + "/api/adminSingleProperty",
    "getRecentAddedProperty": baseUrl + "/api/adminRecentProperty",
    "getAdminStatisticsData": baseUrl + "/api/getAdminStatisticsData",

    //users
    "UserList": baseUrl + "/api/adminGetUserList",
    "tradersList": baseUrl + "/api/tradersList",
    "tradersListForAdmin": baseUrl + "/api/tradersListForAdmin",
    "userDetail": baseUrl + "/api/adminUserInfo",
    "getTenantUSerReview": baseUrl + "/api/GetUserRolesReview",
    "editUser": baseUrl + "/api/adminUpdateProfile",
    "deleteUser": baseUrl + "/api/admin_deleteUser",
    "addUser": baseUrl + "/api/admin_userRegister",
    "searchUser": baseUrl + "/api/adminSearchUser",
    "adminDetail": baseUrl + "/api/adminProfileInfo",
    "adminUpdateOwnProfile": baseUrl + "/api/adminOwnProfileUpdate",
    "editUserByAdmin": baseUrl + "/api/adminUpdateUserProfile",
    "uploadUserImage": baseUrl + "/api/updateUserPic",
    "updateAdminPassword": baseUrl + "/api/changePasswordAdmin",
    "AdminForgotPassword": baseUrl + "/api/adminforgotPassword",
    "AdminResetPassword": baseUrl + "/api/resetAdminPassword",
    "getAllUSerReview": baseUrl + "/api/getTraderAllReviews",
    "deleteReview": baseUrl + "/api/deleteReview",
    "updateUserProperty": baseUrl + "/api/updateUserProperty",

    //properties
    "propertyList": baseUrl + "/api/adminGetAllProperty",
    "deleteProperty": baseUrl + "/api/adminDeletePropertyById",
    "searchProperty": baseUrl + "/api/adminSearch",
    "setApprovalStatus": baseUrl + "/api/adminUpdateApproveFlag",
    "setApprovalStatusToTrue": baseUrl + "/api/adminUpdateToTrueApproveFlag",
    "featuredProperty": baseUrl + "/api/featuredProperty",
    "mailToSeller": baseUrl + "/api/sendMailToSeller",
    "getAgentPropertyList": baseUrl + "/api/adminAgentProperties",
    "getAmenities": baseUrl + "/api/getAmenites",

    //Maintenance List
    "maintenanceList": baseUrl + "/api/adminMaintenanceList",
    "getAdminMRcounts": baseUrl + "/api/getAdminMRcounts",

    //admin login
    "adminLogin": baseUrl + "/api/adminLogin",
    "adminLogout": baseUrl + "/api/adminUserLogout",
    //Agency
    "AgencyList": baseUrl + "/api/adminGetAllAgencies",
    "AddAgency": baseUrl + "/api/adminAddAgency",
    "getMyAgentList": baseUrl + "/api/agentsListWithInAgency",
    "AgencyBulkImport": baseUrl + "/api/AdminBulkImportAgencies",
    //Agent
    "AgentList": baseUrl + "/api/adminGetAgentsList",
    "AgentBulkImport": baseUrl + "/api/AdminAgentBulkImport",
    //Maintenance
    "propertyMaintenanceList": baseUrl + "/api/adminGetMaintenanceProperty",
    "getPropertyMaintenanceDetails": baseUrl + "/api/adminGetMaintenanceDetail",
    //agent removal
    "getAgentRemovalList": baseUrl + "/api/adminAgentRemovalList",
    //filelisting
    "getFileListing": baseUrl + "/api/adminGetUserUploadedDocument",
    "getServiceCategory": baseUrl + "/api/getServiceCategory",

    // Advertising Manager
    "addAd": baseUrl + "/api/addAdvertise",
    "adList": baseUrl + "/api/adminAdvertiseList",
    "adDetail": baseUrl + "/api/advertiseDetail",
    "updateAdStatus": baseUrl + "/api/updateAdvertiseStatus",
}
var appConstants = {
    "authorizationKey": "dGF4aTphcHBsaWNhdGlvbg=="
}

var headerConstants = {
    "json": "application/json"
}

var country = "Australia";

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
