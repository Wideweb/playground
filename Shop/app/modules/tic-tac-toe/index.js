﻿import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { ticTacToeState } from './states';

import COMMON_MODULE from '../common';

import ticTacToeComponent from './components/tic-tac-toe/tic-tac-toe.component';

import ticTacToeService from './services/tic-tac-toe.service';

const ngModule = angular
    .module('ticTacToe', [
        uiRouter,

        COMMON_MODULE.name
    ])
    
    .component('ticTacToe', ticTacToeComponent)

    .service('ticTacToeService', ticTacToeService)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(ticTacToeState.name, ticTacToeState);
    }]);

export default ngModule;