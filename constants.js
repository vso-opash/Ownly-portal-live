const messages = {
    "errorRetreivingData": "Error occured while retreiving the data from collection",
    "successRetreivingData": "Data retreived successfully from the collection",
    "success": "Save successfully",
    "error": "Problem in save data.",
    "documentError": "Problem in delete document.",
    "documents": "./public/uploads/documents/",
    "path": "/uploads/documents/",
    "sendEmail": "Email send successfully",

}


const gmailSMTPCredentials = {
    "service": "gmail",
    "host": "smtp.gmail.com",
    "username": "username",
    "password": "password"

}


const statusCode = {
    "success": 200,
    "error": 401
}
const ImagePath = {
    "ImageNotAvailable": 'uploads/property/no_image.png',
    "ImageAvailable": 'uploads/property/',
    "contractor_sign": 'uploads/contractor/signature/',
    "vendor_sign": 'uploads/users/signature/',
}


const googleCredentials = {
    "client_secret_key": "leWdLHJOoo9g6B9oLCV1lMqY"
}
var obj = { messages: messages, statusCode: statusCode, gmailSMTPCredentials: gmailSMTPCredentials, googleCredentials: googleCredentials };
module.exports = obj; 
