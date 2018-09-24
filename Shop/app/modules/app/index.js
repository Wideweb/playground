﻿import angular from 'angular';
import angularMessages from 'angular-messages';
import uiRouter from 'angular-ui-router';

import routingConfiguration  from './configuration/routing.config';

import COMMON_MODULE from '../common';
import AUTH_MODULE from '../auth';
import TRAINING_MODULE from '../training';
import DICTIONARY_MODULE from '../dictionary';
import TIC_TAC_TOE_MODULE from '../tic-tac-toe';
import PHYSICS_MODULE from '../physics';
import CHAT_MODULE from '../chat';
import TETRIS_MODULE from '../tetris';

import { appState, homeState } from './states';

import layoutComponent from './components/layout/layout.component';
import homeComponent from './components/home/home.component';

import controlsService from './services/controls.service';

const ngModule = angular
    .module('app', [
        uiRouter,
        angularMessages,

        COMMON_MODULE.name,
        AUTH_MODULE.name,
        TRAINING_MODULE.name,
        DICTIONARY_MODULE.name,
        TIC_TAC_TOE_MODULE.name,
        PHYSICS_MODULE.name,
        CHAT_MODULE.name,
        TETRIS_MODULE.name,
    ])

    .component('layout', layoutComponent)
    .component('home', homeComponent)

    .service('controlsService', controlsService)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(appState.name, appState)
            .state(homeState.name, homeState);
    }]);

routingConfiguration(ngModule);

export default ngModule;