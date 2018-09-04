export default class {
    static get $inject() {
        return [
            '$state',
            'dictionaryService'
        ];
    }

    constructor(
        $state,
        /*Service*/ dictionary
    ) {
        this.$state = $state;
        this.dictionary = dictionary;
    }

    remove(id) {
        this.dictionary.remove(id);
    }

    addItem() {
        this.$state.go('addDictionaryItem');
    }

    submit() {
        if (this.form.$invalid) {
            return;
        }

        this.dictionary.save(this.term, this.translation, this.image).catch(() => this.error = "Error");
    }
}