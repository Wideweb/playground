export const userDictionaryState = {
    parent: 'app',
    name: 'userDictionary',
    url: '/dictionary',
    template: '<user-dictionary></user-dictionary>',
    data: {
        showSpinner: true
    },
    resolve: {
        dictionaryData: dictionaryData
    }
}

/**********************************************************************************************
 * DICTIONARY DATA loading
 **********************************************************************************************/
dictionaryData.$inject = [
    'dictionaryService'
];
function dictionaryData(dictionary) {
    console.log('Dictionary data loading...');

    return dictionary.load();
}