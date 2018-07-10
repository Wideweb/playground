/**********************************************************************************************
 Declaration
 **********************************************************************************************/
export default class {
    static get $inject() {
        return [
            'apiRouterService',
            '$q'
        ];
    }

    /******************************************************************************************
     Initialization
     ******************************************************************************************/
    constructor(
        /* Service */ router,
        $q
    ) {
        this.router = router;
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
            .then(response => this.handleResponse(response))
            .then(deferred.resolve)
            .catch(deferred.reject);

        return deferred.promise;
    }

    handleResponse(response) {
        let result = { data: null, response };

        // Forbidden
        if (response.status === 403) {
            throw {
                title: 'Error',
                text: 'Bad credentials.',
                status: response.status
            };
        }
        if (response.status >= 500 && response.status <= 599) {
            throw {
                title: 'Error',
                text: 'Something is going wrong. Please try again later.',
                status: response.status
            };
        }

        // check NO_CONTENT
        if (response.status === 204) {
            return result;
        }

        // Bad Request
        if (response.status === 400) {
            return response.json()
                .then(() => {
                    throw result;
                });
        }

        let contentType = response.headers.get('Content-Type');
        if (contentType && contentType.indexOf("application/json") >= 0) {
            return response.json().then((data) => {
                result.data = data;
                return result;
            });
        }

        result.data = response;

        return result;
    }
}