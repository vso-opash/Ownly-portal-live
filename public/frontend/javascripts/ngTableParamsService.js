angular.module('SYNC').service("ngTableParamsService", function() {
    var params = {
        page: 1,
        count: 5,
        filter: {},
        searchText: undefined,
        sorting: { 'createdAt': -1 }
    };

    var setParams = function(Npage, Ncount, Nfilter, Nsorting, Type) {
        if (Nfilter === undefined) {
            var filter = '';
        } else {
            var filter = Nfilter;
        }
        params.page = Npage ? Npage : 1;
        params.count = Ncount ? Ncount : 5;
        params.searchText = filter;
        params.sorting = Nsorting ? Nsorting : { '_id': -1 };
    }

    var getParams = function() {
        return params;
    }

    return {
        set: setParams,
        get: getParams
    };

});