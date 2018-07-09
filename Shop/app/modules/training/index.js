import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { wordTranslationState } from './states';

import COMMON_MODULE from '../common';

import wordTranslationComponent from './components/word-translation/word-translation.component';

const ngModule = angular
    .module('training', [
        uiRouter,

        COMMON_MODULE.name
    ])
    
    .component('wordTranslation', wordTranslationComponent)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(wordTranslationState.name, wordTranslationState);
    }]);

export default ngModule;