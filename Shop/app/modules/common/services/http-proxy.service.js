/**********************************************************************************************
 Declaration
 **********************************************************************************************/
export default class {
    static get $inject() {
        return [
            'apiRouterService',
            'httpResponseHandler',
            '$q'
        ];
    }

    /******************************************************************************************
     Initialization
     ******************************************************************************************/
    constructor(
        /* Service */ router,
        /* Service */ handler,
        $q
    ) {
        this.router = router;
        this.handler = handler;
        this.$q = $q;
    }

    /******************************************************************************************
     PUBLIC METHODS
     ******************************************************************************************
     simple HTTP request
     *******************************************************************************************/
    call(
        /* String */ routeName,
        /* Object */ parameters,
        /* Object */ data = undefined
    ) {
        return this.callWithInfo(
            routeName,
            parameters,
            data
        ).then((res) => {
            return res.data;
        });
    }

    callWithInfo(
        /* String */ routeName,
        /* Object */ parameters,
        /* Object */ data = undefined
    ) {
        let deferred = this.$q.defer();
        let options = this.router.getRoute(routeName, parameters);
        
        data && (options.options.body = JSON.stringify(data));

        fetch(
            options.url,
            options.options
        )
            .then(response => this.handler.handle(response))
            .then(deferred.resolve)
            .catch(deferred.reject);

        return deferred.promise;
    }
}