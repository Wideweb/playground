import angular from 'angular';
import angularLocalStorage from 'angular-local-storage';

import equalToDirective from './directives/equalTo';
import fileSelectDirective from './directives/file-select';
import toggleDirective from './directives/toggle';

import apiRouterService from './services/api-router.service';
import httpProxyService from './services/http-proxy.service';
import httpResponseHandler from './services/http-response.handler';
import storageService from './services/storage.service';
import spinnerService from './services/spinner.service';
import serviceWorker from './services/service-worker.manager';
import subscriptionService from './services/subscription.service';

const ngModule = angular
    .module('common', [
        angularLocalStorage
    ])

    .service('apiRouterService', apiRouterService)
    .service('httpProxyService', httpProxyService)
    .service('httpResponseHandler', httpResponseHandler)
    .service('storageService', storageService)
    .service('spinnerService', spinnerService)
    .service('serviceWorker', serviceWorker)
    .service('subscriptionService', subscriptionService)

    .directive('equalTo', equalToDirective)
    .directive('fileSelect', fileSelectDirective)
    .directive('toggle', toggleDirective);

export default ngModule;