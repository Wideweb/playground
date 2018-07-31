import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { chainState } from './states';

import COMMON_MODULE from '../common';

import chainComponent from './components/chain/chain.component';

const ngModule = angular
    .module('physics', [
        uiRouter,

        COMMON_MODULE.name
    ])
    
    .component('chain', chainComponent)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(chainState.name, chainState);
    }]);

export default ngModule;