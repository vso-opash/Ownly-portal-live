'use strict';
var mongoose = require('mongoose');
var imageSubschema = new mongoose.Schema({
    path: {type: String},
    status: {type: Boolean, default: true}
});

var MaintenanceProposalsSchema = mongoose.Schema({
    maintenance_id:{type: mongoose.Schema.Types.ObjectId,ref: 'maintenances'},
    proposed_price: {type: String,required: Number},
    proposed_date: {type: Date},
    message: {type: String,required: true},
    is_proposal_accept:{type: Boolean,default:false},
    proposal_accepted_by:{type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    images: [imageSubschema],
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
var maintenance_proposals = mongoose.model('maintenance_proposals', MaintenanceProposalsSchema);