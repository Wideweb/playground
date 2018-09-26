import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { tetrisState, tetrisResultsState } from './states';

import COMMON_MODULE from '../common';

import tetrisComponent from './components/tetris/tetris.component';
import tetrisResultsComponent from './components/tetris-results/tetris-results.component';

import tetrisService from './services/tetris.service';

const ngModule = angular
    .module('tetris', [
        uiRouter,

        COMMON_MODULE.name
    ])
    
    .component('tetris', tetrisComponent)
    .component('tetrisResults', tetrisResultsComponent)

    .service('tetrisService', tetrisService)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(tetrisState.name, tetrisState)
            .state(tetrisResultsState.name, tetrisResultsState);
    }]);

export default ngModule;