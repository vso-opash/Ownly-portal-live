'use strict';
angular.module('SYNC').factory('disputesService', function($resource, $rootScope) {
    return {
         disputesList: function(data) {
            //  console.log("am calling service from here");
            return $resource(webservices.addDisputes, null, {
                post: {
                    method: 'POST'
                }
            })
        }, 
        addDisputes: function(data) {
            return $resource(webservices.getDisputesList, null, {
                post: {
                    method: 'POST'
                }
            })
        }
      }
});