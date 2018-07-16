import controller from './tic-tac-toe.ctrl';
import template from './tic-tac-toe.tpl.html';
import './tic-tac-toe.scss';

let wordTranslationComponent = {
    restrict: 'E',
    bindings: {},
    template,
    controller
};

export default wordTranslationComponent;