﻿export default class {
    static get $inject() {
        return [
            'ticTacToeService'
        ];
    }

    constructor(
        ticTacToe
    ) {
        this.ticTacToe = ticTacToe;
        this.wait = false;

        this.ticTacToe.connect();
    }

    get map() {
        return this.ticTacToe.map.list;
    }

    get question() {
        return this.ticTacToe.map.current;
    }

    cellClass(index) {
        let className = this.map[index] && this.map[index].status;
        if (index === this.ticTacToe.map.index) {
            className += ' current';
        }

        return className;
    }

    select(index) {
        this.ticTacToe.select(index);
    }

    submit(option) {
        if (!this.ticTacToe.isMyTurn) {
            return;
        }

        this.wait = true;
        this.ticTacToe.submit(option);
    }

    newGame() {
        this.ticTacToe.leave().then(() => this.ticTacToe.search());
    }

    $onDestroy() {
        this.ticTacToe.disconnect();
    }
}