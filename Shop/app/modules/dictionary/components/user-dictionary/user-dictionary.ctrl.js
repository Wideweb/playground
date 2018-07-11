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

    submit() {
        if (this.form.$invalid) {
            return;
        }

        this.dictionary.save(this.term, this.translation).catch(() => this.error = "Error");
    }
}