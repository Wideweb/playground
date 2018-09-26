export const tetrisState = {
    parent: 'app',
    name: 'tetris',
    url: '/tetris',
    template: '<tetris></tetris>',  
    resolve: {
        tetrisData: tetrisData
    },
    data: {
        isAddWordButtonVisible: false
    },
}

export const tetrisResultsState = {
    parent: 'app',
    name: 'tetris-results',
    url: '/tetris-results',
    template: '<tetris-results></tetris-results>',
    data: {
        isAddWordButtonVisible: false
    },
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