'use strict';

var mongoose = require('mongoose');
var imageSubschema = new mongoose.Schema({
    url: { type: String },
    status: { type: Boolean, default: true }
});
var UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    mobile_no: { type: String },
    date_of_birth: { type: Date },
    image: { type: String },
    gender: { type: Number, enum: [1, 2, 3] }, //Role 1 male , 2 female ,3 others  
    is_invited: { type: Boolean, default: false },
    accept_invitation: { type: Boolean, default: false },
    totalPropertyCount: { type: Number, default: 0 },
    is_active: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    about_user: { type: String },
    images: [imageSubschema],
    country: { type: String },
    address: { type: String },
    is_online: { type: Boolean, default: false },//to check user is already available for previous group chat 
    city: { type: String },
    bannerImage: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    state: { type: String },
    zipCode: { type: String },
    is_opened_trade_email: { type: Boolean, default: false, required: false },
    // User associate with agency
    agency_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agency'
    },
    is_accepted_req: { type: Boolean, default: false },
    // For traders //
    categories_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'services_cats'
    }],
    social_provider: { type: String, required: false },
    social_id: { type: String, required: false },
    social_token: { type: String, required: false }
}, {
    timestamps: true
});

var User = mongoose.model('User', UserSchema);
module.exports = User;