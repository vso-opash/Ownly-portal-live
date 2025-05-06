'use strict';
module.exports = function (app, express) {
    var router = express.Router();
    var version = __api_version__;
    
    /*Index Layout Load*/
    app.get('/', function (req, res, next) {
        res.render('layouts/views/index.html');
    });

    /*Invester Index Layout Load*/
    /* Admin Layout Load */
    app.get('/admin/', function (req, res, next) {
        res.render('layouts/views/admin_layout.html');
    });
    app.use('/', router);
};