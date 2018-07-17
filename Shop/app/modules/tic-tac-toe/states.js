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
    'ticTacToeCellService'
];
function ticTacToeData(map) {
    console.log('ticTacToe data loading...');
    map.clear();
    return Promise.resolve();
}