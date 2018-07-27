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
    GetUser: {
        url: API_ENDPOINT + '/api/Manage',
        options: { method: 'GET' }
    },
    GetDictionary: {
        url: API_ENDPOINT + '/api/Dictionary',
        options: { method: 'GET' }
    },
    SaveDictionaryItem: {
        url: API_ENDPOINT + '/api/Dictionary',
        options: { method: 'Post' }
    },
    RemoveDictionaryItem: {
        url: API_ENDPOINT + '/api/Dictionary/{id}',
        options: { method: 'Delete' }
    },
    GetTraining: {
        url: API_ENDPOINT + '/api/Training',
        options: { method: 'GET' }
    },
    SaveTraining: {
        url: API_ENDPOINT + '/api/Training',
        options: { method: 'POST' }
    },
};
