import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { loginState, registerState } from './states';

import COMMON_MODULE from '../common';

import loginComponent from './components/login/login.component';
import registerComponent from './components/register/register.component';

const ngModule = angular
    .module('auth', [
        uiRouter,

        COMMON_MODULE.name
    ])

    .component('login', loginComponent)
    .component('register', registerComponent)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(loginState.name, loginState)
            .state(registerState.name, registerState);
    }]);

export default ngModule;