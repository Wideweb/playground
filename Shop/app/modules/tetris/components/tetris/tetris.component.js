import controller from './tetris.ctrl';
import template from './tetris.tpl.html';
import './tetris.scss';

let tetrisComponent = {
    restrict: 'E',
    bindings: {},
    template,
    controller
};

export default tetrisComponent;