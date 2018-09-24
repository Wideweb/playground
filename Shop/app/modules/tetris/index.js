import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { tetrisState } from './states';

import COMMON_MODULE from '../common';

import tetrisComponent from './components/tetris/tetris.component';

import tetrisService from './services/tetris.service';

const ngModule = angular
    .module('tetris', [
        uiRouter,

        COMMON_MODULE.name
    ])
    
    .component('tetris', tetrisComponent)

    .service('tetrisService', tetrisService)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(tetrisState.name, tetrisState);
    }]);

export default ngModule;