
module.exports =  {    
    
               replace:function(str,repalcement){
                   var re = new RegExp(Object.keys(repalcement).join("|"),"gi");
                    str = str.replace(re, function(matched){
                   return repalcement[matched.toLowerCase()];
                });
                return str;
               },
               html:function(template){ 
                  __rootRequire('app/api/'+version+'/app_modules/email');   
                 var fs  = require('fs');   
                 var html  = fs.readFileSync('./app/api/'+__api_version__+'/views/templates/'+template,'utf-8');
                 return html.toString();
               },
              __:function(config){   
                  if(typeof(config)===undefined || typeof(config)!=='object')
                      throw Error("First argument is missing. It must be configuration object");
                  return {
                           to: config.to, 
                           subject: 'Account Invitation - RehabCo EHR ', 
                           html: this.replace(this.html(config.template),config.repalcement)
                        };                  
                }
};