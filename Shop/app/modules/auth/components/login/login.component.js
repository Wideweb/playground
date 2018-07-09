import controller from './login.ctrl';
import template from './login.tpl.html';
import './login.scss';

let loginComponent = {
    restrict: 'E',
    bindings: {},
    template,
    controller
};

export default loginComponent;