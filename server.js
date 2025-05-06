var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    router = express.Router(),
    app = express(),
    compression = require('compression');
//qt = require('quickthumb');



const dotenv = require('dotenv');
const _ = require('lodash');
// config variables
const configJson = require('./app/config/config.json');
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */

dotenv.config();
const defaultConfig = configJson.development;
console.log('process.env.NODE_ENV :: server.js => ', process.env.NODE_ENV);
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = configJson[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// global config 
global.gConfig = finalConfig;
// console.log('global.gconfig :: server.js=> ', global.gConfig);




//admin login
require('./app/config/database');
require('./app/config/global')(path.join(__dirname, '/'));

// view engine setup
app.set('views', path.join(__dirname, '/public/frontend/modules'));
app.set("view options", {
    layout: false
});
app.engine('html', function (path, opt, fn) {
    fs.readFile(path, 'utf-8', function (error, str) {
        if (error)
            return str;
        return fn(null, str);
    });

});

//Allowing buffer stream in JSOn type request
app.use(bodyParser.json({
    limit: '50mb'
}));
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
})); //The value can be a string or array (when extended is false), or any type (when extended is true).

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(__dirname + '/public/frontend/'));
app.use('/download', express.static(__dirname + '/public/frontend/images/uploads/Template'));
app.use('/admin', express.static(__dirname + '/public/admin/'));
app.use('/frontend', express.static(__dirname + '/public/frontend/'));
app.use('/bower_components', express.static(__dirname + '/public/bower_components'));
app.use('/partials', express.static(__dirname + '/public/frontend/modules/partials/'));

//compression
app.use(compression({ filter: shouldCompress }))

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }
    // fallback to standard filter function
    return compression.filter(req, res)
}

//Passport  config
__rootRequire('routes/pageRoutes')(app, express);

/*Routing config*/
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
var errorHandler = require('express-error-handler'),
    handler = errorHandler({
        static: {
            '404': __dirname + '/public/frontend/modules/partials/views/server_404.html'
        }
    });
// After all your routes...
// Pass a 404 into next(err)
app.use(errorHandler.httpError(404));

// Handle all unhandled errors:
app.use(handler);
module.exports = app;