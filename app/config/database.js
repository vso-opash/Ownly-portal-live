// 'use strict';

// /* DB */
// var mongoose = require('mongoose');
// require('./../models/communication/Chats');
// require('./../models/users/Users');
// require('./../models/maintenanceProposal/MaintenanceProposals');
// require('./../models/maintenance/Maintenances');
// require('./../models/dispute/Disputes');
// var options = {
//     // user: 'syncitt',
//     // pass: 'syncitt@123', //For 52
//     useMongoClient: true
//     // pass: 'syn7890'  // For 172   
// };
// // mongoose.connect("mongodb://172.10.1.7/syncitfrontend", options);
// // mongoose.connect("mongodb://52.34.207.5/syncitfrontend", options);
// // mongoose.connect("mongodb://52.64.215.66:27017/admin",{user: 'syncitt', pass: 'syncitt@123', useMongoClient : true});
// // mongoose.connect("mongodb://3.104.181.36:27017/admin", { user: 'syncitt', pass: 'syncitt@123', useMongoClient: true });
// // mongoose.connect("mongodb://13.54.34.150:27017/admin",{user: 'syncitt', pass: 'syncitt@123', useMongoClient : true});
// mongoose.connect("mongodb://localhost/admin", options);
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, "connection failed"));
// db.once('open', function () {
//     console.log("Database conencted successfully and project Started!");
// });
// mongoose.set('debug', false);
// /* end DB */



'use strict';

/* DB */
var mongoose = require('mongoose');
require('./../models/communication/Chats');
require('./../models/users/Users');
require('./../models/maintenanceProposal/MaintenanceProposals');
require('./../models/maintenance/Maintenances');
require('./../models/dispute/Disputes');
var options = {
    user: 'syncitt',
    pass: 'syncitt@123', //For 52
    // pass: 'syn7890'  // For 172   
    useMongoClient: true
};
// mongoose.connect("mongodb://172.10.1.7/syncitfrontend", options);
// mongoose.connect("mongodb://52.34.207.5/syncitfrontend", options);
// mongoose.connect("mongodb://localhost/admin", options);
// mongoose.connect("mongodb://13.54.34.150:27017/admin", { user: 'syncitt', pass: 'syncitt@123', useMongoClient: true });
// mongoose.connect("mongodb://52.65.124.36:27017/admin", { user: 'syncitt', pass: 'syncitt@123', useMongoClient: true });



// // console.log('global.gConfig.URI => ', global.gConfig.URI);

mongoose.connect(global.gConfig.URI, { user: global.gConfig.dbUser, pass: global.gConfig.dbPass, useMongoClient: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection failed"));
db.once('open', function () {
    console.log("Database connected successfully on", global.gConfig.URI, "and project Started!");
});
mongoose.set('debug', false);
/* end DB */
