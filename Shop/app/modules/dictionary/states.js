export const userDictionaryState = {
    parent: 'app',
    name: 'userDictionary',
    url: '/dictionary',
    template: '<user-dictionary></user-dictionary>',
    data: {
        showSpinner: true
    },
    resolve: {
        dictionaryData
    }
}

export const addDictionaryItemState = {
    parent: 'app',
    name: 'addDictionaryItem',
    url: '/add-dictionary-item',
    template: '<add-dictionary-item></add-dictionary-item>'
}

export const dictionaryItemViewState = {
    parent: 'app',
    name: 'dictionaryItemView',
    url: '/dictionary/:id',
    template: '<dictionary-item-view></dictionary-item-view>',
    params: {
        id: '',
    },
    data: {
        showSpinner: true
    },
    resolve: {
        dictionaryItemData
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

/**********************************************************************************************
 * DICTIONARY ITEM DATA loading
 **********************************************************************************************/
dictionaryItemData.$inject = [
    'dictionaryService',
    '$stateParams'
];
function dictionaryItemData(dictionary, $params) {
    console.log('Dictionary data loading...');

    return dictionary.loadItem($params.id);
}