'use strict';

module.exports = function(app, router) {

    app.get('/admin/', function(req, res, next) {
        res.render('layouts/admin_layout.html');
    });


    app.get('/document/', function(req, res, next) {
        res.render('layouts/frame_layout.html');
    });



    return router;
};
