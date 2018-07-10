export default class {

    static get $inject() {
        return [
            'localStorageService',
        ];
    }

    constructor(
        storage
    ) {
        this.storage = storage;
        this.type = 'localStorage';
    }

    get(key) {
        return this.storage.get(key, this.type);
    }

    set(key, value) {
        return this.storage.set(key, value, this.type);
    }

    remove(key) {
        return this.storage.remove(key, this.type);
    }
}