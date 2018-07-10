import { API_ENDPOINT, CONTEXT } from './global.config';

/**********************************************************************************************
 DEFAULT HTTP OPTIONS
 **********************************************************************************************/
export const HTTP_OPTIONS = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};
/**********************************************************************************************
 APPLICATION SPECIFIC ROUTES
 **********************************************************************************************/
export const API_ROUTES = {
    Login: {
        url: API_ENDPOINT + '/Account/Login',
        options: { method: 'POST' }
    },
    Logout: {
        url: API_ENDPOINT + '/Account/Logout',
        options: { method: 'POST' }
    },
    Register: {
        url: API_ENDPOINT + '/Account/Register',
        options: { method: 'POST' }
    },
};
