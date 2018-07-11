/**********************************************************************************************
 * Controller
 **********************************************************************************************/
const Controller = {
    list: []
};

/**********************************************************************************************
 Declaration
 **********************************************************************************************/
export default class {
    static get $inject() {
        return [];
    }

    /******************************************************************************************
     Initialization
     ******************************************************************************************/
    constructor() {}

    register(handler) {
        Controller.list.push(handler);
    }
    
    handle(response) {
        let result = { data: null, response };

        Controller.list.forEach(handler => handler(response));
        
        if (response.status === 403) {
            throw {
                title: 'Error',
                text: 'Bad credentials.'
            };
        }

        if (response.status >= 500 && response.status <= 599) {
            throw {
                title: 'Error',
                text: 'Something is going wrong. Please try again later.'
            };
        }

        // check NO_CONTENT
        if (response.status === 204) {
            return result;
        }

        // Bad Request
        if (response.status === 400) {
            return response.json().then((data) => {
                throw data;
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