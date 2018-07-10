import { fillTemplate } from '../helpers/utils';
import { HTTP_OPTIONS, API_ROUTES } from '../configuration/api-routes.config';

export const ACCESS_TOKEN_KEY = '__ACCESS_TOKEN__';

/**********************************************************************************************
 * DECLARATION
 **********************************************************************************************/
export default class {

    static get $inject() {
        return [];
    }

    /******************************************************************************************
     INITIALIZATION
     ******************************************************************************************/
    constructor() {}

    /******************************************************************************************
     PUBLIC METHODS
     ******************************************************************************************
     simple HTTP request options generator
     ******************************************************************************************/
    getRoute(
        /* String */ routeName,
        /* Object */ parameters = {}
    ) {
        let route;
        let headers = {};
        if (API_ROUTES.hasOwnProperty(routeName)) {
            // copy route options
            route = JSON.parse(JSON.stringify(API_ROUTES[routeName]));
            // fulfilling of URL by parameters if any
            route.url = fillTemplate(route.url, parameters, {}, (param) => encodeURIComponent(param));
            // merge request options
            route.options = route.options || {};
            // merge & save headers section
            headers = Object.assign({}, HTTP_OPTIONS.headers, route.options.headers || {});
            // merge options section
            route.options = Object.assign({}, HTTP_OPTIONS, route.options);
            // attach saved headers
            route.options.headers = headers;
        }
        return route;
    }

    /******************************************************************************************
     secure HTTP request options generator
     ******************************************************************************************/
    getSecureOptions(
        /* String */ routeName
    ) {
        return API_ROUTES.hasOwnProperty(routeName) ? JSON.parse(JSON.stringify(API_ROUTES[routeName])).options : {};
    }

}
