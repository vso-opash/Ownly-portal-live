'use strict';
const clientId = 'client_c5e77d49b80c4efda639f751c5e2e168';
const secret = 'secret_d417765e54dd9577910b83632a6bea36';
let accessToken = '';

angular.module('SYNC').factory('HomeService', function ($http, $rootScope) {
    return {
        getAccessToken: function () {
            let data = 'grant_type=client_credentials&scope=api_agencies_read%20api_listings_read';
            try{
                return $http.post('https://auth.domain.com.au/v1/connect/token', data,{
                    headers: {
                        'Authorization': `Basic ${btoa(`${clientId}:${secret}`)}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }).then(result => {
                    // accessToken = result ? result.data : '';
                    console.log(result.data);
                }).catch(err => console.error(err.response.data));
            }catch(e){
                console.log('\n Err : ', e);
            }
        }
    }
});