'use strict';
module.exports = function (basepath) {
var   i18n2 = require('i18n-2');    
global.__base               = basepath;
global.__app_path__         = basepath +'/app';
global.__config_path__      = __app_path__ + '/config';
global.__controllers_path__ = __app_path__ + '/controllers';
global.__models_path__      = __app_path__ + '/models';
global.__views_path__       = __app_path__ + '/views';
global.__middlewares_path__ = __app_path__ + '/middlewares';
global.__locales_path__     = __app_path__ + '/locales';
global.__helpers_path__     = __app_path__ + '/helpers';
global.__api_version__      = 'v1.0';

global.__rootRequire = function(relpath) { 
    //console.log(global.__base +relpath);
    return  require(global.__base + relpath);
};
global.__env = process.env.NODE_ENV || 'development';
global.i18n = new (i18n2)(__rootRequire('app/config/i18n')['i18n']);
};

global.__debug = function(){
    if(global.__env==='development')
     console.log.apply(console, arguments);
}