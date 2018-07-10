import angular from 'angular';
import uiRouter from 'angular-ui-router';
import angularCookies from 'angular-cookies';

import { loginState, registerState } from './states';

import COMMON_MODULE from '../common';

import loginComponent from './components/login/login.component';
import registerComponent from './components/register/register.component';

import authService from './services/auth.service';
import userService from './services/user.service';

const ngModule = angular
    .module('auth', [
        uiRouter,
        angularCookies,

        COMMON_MODULE.name
    ])

    .component('login', loginComponent)
    .component('register', registerComponent)

    .service('authService', authService)
    .service('userService', userService)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(loginState.name, loginState)
            .state(registerState.name, registerState);
    }]);

export default ngModule;