import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { userDictionaryState } from './states';

import COMMON_MODULE from '../common';

import userDictionaryComponent from './components/user-dictionary/user-dictionary.component';

import dictionaryService from './services/dictionary.service';

const ngModule = angular
    .module('dictionary', [
        uiRouter,

        COMMON_MODULE.name
    ])
    
    .component('userDictionary', userDictionaryComponent)

    .service('dictionaryService', dictionaryService)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(userDictionaryState.name, userDictionaryState);
    }]);

export default ngModule;