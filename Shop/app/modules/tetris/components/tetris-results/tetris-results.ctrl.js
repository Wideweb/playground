export default class {
    static get $inject() {
        return [
            '$state'
        ];
    }

    constructor($state) {
        this.$state = $state;
    }

    newGame() {
        this.$state.go('tetris');
    }
}