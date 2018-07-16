import controller from './word-translation.ctrl';
import template from './word-translation.tpl.html';
import './word-translation.scss';

let wordTranslationComponent = {
    restrict: 'E',
    bindings: {},
    template,
    controller
};

export default wordTranslationComponent;