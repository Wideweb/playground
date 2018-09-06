const DEFAULT_ANONYMOUS_USER = 'Anonymous';
const USER_STORAGE_KEY = 'me';

export class UserModel {
    constructor(data) {
        this.userName = data.userName;
        this.email = data.email;
        this.role = data.role;
        this.isEmailConfirmed = data.IsEmailConfirmed;
        this.imageId = data.imageId;

        this._image = data.image;
    }

    set image(value) {
        this._image = value;
        this.imageId = null;
    }

    get image() {
        return this._image;
    }

    serialize() {
        return {
            userName: this.userName,
            email: this.email,
            imageId: this.imageId,
            image: this.image
        }
    }
}

const Controller = {
    current: null,
    getDefaultUser: function() {
        return {
            userName: '',
            email: '',
            role: DEFAULT_ANONYMOUS_USER,
            isEmailConfirmed: undefined,
        };
    }
}

export default class {
    static get $inject() {
        return [
            'storageService',
            'httpProxyService'
        ];
    }

    constructor(
        storage,
        proxy
    ) {
        this.storage = storage;
        this.proxy = proxy;
    }

    get user() {
        if (!Controller.current) {
            let userData = this.storage.get(USER_STORAGE_KEY) || Controller.getDefaultUser();
            Controller.current = new UserModel(userData);
        }

        return Controller.current;
    }

    get name() {
        return this.user.email;
    }

    get image() {
        return this.user.image;
    }

    load() {
        return this.proxy
            .call('GetUser')
            .then(data => this.store(data));
    }

    update(model){
        return this.proxy
            .call('UpdateUser', {}, model.serialize())
            .then(() => this.load());
    }

    store(user) {
        if (!(user instanceof UserModel)) {
            user = new UserModel(user);
        }

        this.storage.set(USER_STORAGE_KEY, user.serialize());

        Controller.current = user;
    }

    clear() {
        this.storage.remove(USER_STORAGE_KEY);
        Controller.current = null;
    }

    inRole(role) {
        return this.user.role === role;
    }

    isLoggedIn() {
        return !this.inRole(DEFAULT_ANONYMOUS_USER);
    }

    clone() {
        return new UserModel(this.user.serialize());
    }
}