import controller from './home.ctrl';
import template from './home.tpl.html';
import './home.scss';

let homeComponent = {
    restrict: 'E',
    bindings: {},
    template,
    controller
};

export default homeComponent;