export default class {
    static get $inject() {
        return [
            'ticTacToeService'
        ];
    }

    constructor(
        ticTacToe
    ) {
        this.ticTacToe = ticTacToe;

        this.ticTacToe.search();
    }

    select(index) {
        this.ticTacToe.isMyTurn && this.ticTacToe.selectSlot(index);
    }

    $onDestroy() {
        this.ticTacToe.disconnect();
    }
}