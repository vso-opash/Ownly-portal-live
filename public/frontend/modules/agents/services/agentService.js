'use strict';
angular.module('SYNC').factory('AgentService', function ($resource, $rootScope) {
    return {

        getAgencyAgentList: function () {
            return $resource(webservices.getAgencyAgentList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getMyAgentList: function () {
            return $resource(webservices.getMyAgentList, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        agentsListByLinkedAgency: function () {
            return $resource(webservices.agentsListByLinkedAgency, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        sendMessage: function () {
            return $resource(webservices.sendMessage, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        maintenceProperty: function (data) {
            return $resource(webservices.maintenceProperty, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        agentRemoval: function (data) {
            return $resource(webservices.agentRemoval, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getAgentList: function () {
            return $resource(webservices.getAgentList, null, {
                get: {
                    method: 'GET'
                }
            })
        },
        agentsListWithSearch: function () {
            return $resource(webservices.agentsListWithSearch, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        getPropertyForAgentRemoval: function (data) {
            return $resource(webservices.getPropertyForAgentRemoval, null, {
                post: {
                    method: 'POST'
                }
            })
        },
        bulkDeleteAgents: function () {
            return $resource(webservices.bulk_delete_agents, null, {
                post: {
                    method: 'POST'
                }
            })
        }
    }
});