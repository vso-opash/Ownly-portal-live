/* @function : Chats (database)
 *  @created  : 03112016
 *  @Creator  : smartData
 *  @purpose  : create the model to keep record of chats among job seekers and employees
 */

var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
    property_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'properties'
    },
    from: { type: mongoose.Schema.Types.ObjectId, required: true, trim: true, ref: 'User' }, // refers _id in user schema
    to: { type: mongoose.Schema.Types.ObjectId, trim: true, ref: 'User' },// refers _id in user schema
    proposal_id: { type: mongoose.Schema.Types.ObjectId, trim: true, ref: 'maintenance_proposals' },// refers _id in user schema
    maintenance_id: { type: mongoose.Schema.Types.ObjectId, trim: true, ref: 'maintenances' },// refers _id in user schema
    dispute_id: { type: mongoose.Schema.Types.ObjectId, trim: true, ref: 'Disputes' },// refers _id in user schema
    msg: { type: String },
    isRead: { type: Boolean, default: false },
    time: { type: String },
    document_name: { type: String },
    document_path: { type: String },
    size: { type: String },
    is_file: { type: Boolean, default: false },
    created: { type: Date, default: Date.now() },
    group_id: { type: String, default: null },
    is_available: { type: Boolean, default: false },//to check user is already available for previous group chat 
    is_status: { type: Boolean, default: false },
    is_general_communication: { type: Boolean, default: false },
    is_disputes_communication: { type: Boolean, default: false },
    is_maintenance_chat: { type: Boolean, default: false },
    isPropertyDeleted: { type: Boolean, default: false },
    agencyPrincipleId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    sender_role_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Role' }
});

// create the model for chat within friends
module.exports = mongoose.model('Chats', chatSchema);