export const tetrisState = {
    parent: 'app',
    name: 'tetris',
    url: '/tetris',
    template: '<tetris></tetris>',  
    resolve: {
        tetrisData: tetrisData
    }
}

/**********************************************************************************************
 * TRAINING DATA loading
 **********************************************************************************************/
tetrisData.$inject = [
    'tetrisService'
];
function tetrisData(tetris) {
    console.log('tetris data loading...');
    return Promise.resolve();
}