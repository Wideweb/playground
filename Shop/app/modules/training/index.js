import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { wordTranslationState } from './states';

import COMMON_MODULE from '../common';

import wordTranslationComponent from './components/word-translation/word-translation.component';

import trainingService from './services/training.service';

const ngModule = angular
    .module('training', [
        uiRouter,

        COMMON_MODULE.name
    ])
    
    .component('wordTranslation', wordTranslationComponent)

    .service('trainingService', trainingService)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(wordTranslationState.name, wordTranslationState);
    }]);

export default ngModule;