import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { wordTranslationState } from './states';

import COMMON_MODULE from '../common';

import wordTranslationComponent from './components/tic-tac-toe/tic-tac-toe.component';

import ticTacToeService from './services/tic-tac-toe.service';

const ngModule = angular
    .module('training', [
        uiRouter,

        COMMON_MODULE.name
    ])
    
    .component('wordTranslation', wordTranslationComponent)

    .service('ticTacToeService', ticTacToeService)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(wordTranslationState.name, wordTranslationState);
    }]);

export default ngModule;