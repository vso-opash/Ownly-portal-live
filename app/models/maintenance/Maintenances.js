'use strict';

var mongoose = require('mongoose');

var watcherSubschema = new mongoose.Schema({
    users_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    is_read: {type: Boolean, default: false}
});

var imageSubschema = new mongoose.Schema({
    path: {type: String},
    status: {type: Boolean, default: true}
});

var MaintenancesSchema = mongoose.Schema({
    request_id:{type: Number,required: true}, //10 digits unique id  
    request_overview: {type: String,required: true},
    request_detail: {type: String},
    property_id: {type: mongoose.Schema.Types.ObjectId,ref: 'properties'},
    agency_id: {type: mongoose.Schema.Types.ObjectId,ref: 'Agency'},
    trader_id: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    is_forward: {type: Boolean,default:false},
    created_by_role: {type: mongoose.Schema.Types.ObjectId,ref: 'Role'},
    created_by: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    forwarded_by: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    categories_id: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'services_cats'
    }],
    job_close_confirmation: {type: Number,default: 1}, //1 No confirm 2 confirm 3 decline
    watchers_list: [watcherSubschema],
    budget: {type: Number},
    due_date: {type: Date},
    images: [imageSubschema],
    //is_req_forward: {type: Boolean,default: false},
    is_job_completed: {type: Boolean,default: false},
    complete_images: [imageSubschema],
    req_complete_message:{type: String},
    completed_date: {type: Date,default:Date.now},
    req_status:{type: Number,default:1}, // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied  
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
var maintenances = mongoose.model('maintenances', MaintenancesSchema);