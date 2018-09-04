export default class {
    static get $inject() {
        return [
            'dictionaryService'
        ];
    }

    constructor(
        /*Service*/ dictionary
    ) {
        this.dictionary = dictionary;
    }

    get model() {
        return this.dictionary.current;
    }

    remove(id) {
        this.dictionary.remove(id);
    }
}