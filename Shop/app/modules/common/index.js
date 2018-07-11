import angular from 'angular';
import angularLocalStorage from 'angular-local-storage';

import equalToDirective from './directives/equalTo';

import apiRouterService from './services/api-router.service';
import httpProxyService from './services/http-proxy.service';
import httpResponseHandler from './services/http-response.handler';
import storageService from './services/storage.service';
import spinnerService from './services/spinner.service';

const ngModule = angular
    .module('common', [
        angularLocalStorage
    ])

    .service('apiRouterService', apiRouterService)
    .service('httpProxyService', httpProxyService)
    .service('httpResponseHandler', httpResponseHandler)
    .service('storageService', storageService)
    .service('spinnerService', spinnerService)

    .directive('equalTo', equalToDirective);

export default ngModule;