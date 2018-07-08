import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { appState } from './states';

import layoutComponent from './components/layout/layout.component';

const ngModule = angular
    .module('app', [
        uiRouter
    ])

    .component('layout', layoutComponent)

    .config(['$locationProvider', $locationProvider => $locationProvider.hashPrefix('')])

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(appState.name, appState);
    }]);

export default ngModule;