import angular from 'angular';

import equalToDirective from './directives/equalTo';

const ngModule = angular
    .module('common', [])

    .directive('equalTo', equalToDirective);

export default ngModule;