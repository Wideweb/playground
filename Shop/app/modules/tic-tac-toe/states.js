export const ticTacToeState = {
    parent: 'app',
    name: 'ticTacToe',
    url: '/tic-tac-toe',
    template: '<tic-tac-toe></tic-tac-toe>',  
    resolve: {
        ticTacToeData: ticTacToeData
    }
}

/**********************************************************************************************
 * TRAINING DATA loading
 **********************************************************************************************/
ticTacToeData.$inject = [
    'ticTacToeService'
];
function ticTacToeData(ticTacToe) {
    console.log('ticTacToe data loading...');
    ticTacToe.clear();
    return Promise.resolve();
}