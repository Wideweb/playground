export const wordTranslationState = {
    parent: 'app',
    name: 'wordTranslation',
    url: '/word-translation',
    template: '<word-translation></word-translation>',
    data: {
        showSpinner: true
    },
    resolve: {
        trainingData: trainingData
    }
}

/**********************************************************************************************
 * TRAINING DATA loading
 **********************************************************************************************/
trainingData.$inject = [
    'trainingService'
];
function trainingData(training) {
    console.log('training data loading...');

    return training.load();
}