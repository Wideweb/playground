import controller from './user-dictionary.ctrl';
import template from './user-dictionary.tpl.html';
import './user-dictionary.scss';

let userDictionaryComponent = {
    restrict: 'E',
    bindings: {},
    template,
    controller
};

export default userDictionaryComponent;