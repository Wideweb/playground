import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { userDictionaryState, addDictionaryItemState, dictionaryItemViewState } from './states';

import COMMON_MODULE from '../common';

import userDictionaryComponent from './components/user-dictionary/user-dictionary.component';
import addDictionaryItemComponent from './components/add-dictionary-item/add-dictionary-item.component';
import dictionaryItemViewComponent from './components/dictionary-item-view/dictionary-item-view.component';

import dictionaryService from './services/dictionary.service';

const ngModule = angular
    .module('dictionary', [
        uiRouter,

        COMMON_MODULE.name
    ])
    
    .component('userDictionary', userDictionaryComponent)
    .component('addDictionaryItem', addDictionaryItemComponent)
    .component('dictionaryItemView', dictionaryItemViewComponent)

    .service('dictionaryService', dictionaryService)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(userDictionaryState.name, userDictionaryState)
            .state(addDictionaryItemState.name, addDictionaryItemState)
            .state(dictionaryItemViewState.name, dictionaryItemViewState);
    }]);

export default ngModule;