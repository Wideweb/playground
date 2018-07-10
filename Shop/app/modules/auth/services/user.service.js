const DEFAULT_ANONYMOUS_USER = 'Anonymous';
const USER_STORAGE_KEY = 'me';

export class UserModel {
    constructor(data) {
        this.userName = data.userName;
        this.email = data.email;
        this.role = data.role;
        this.isEmailConfirmed = data.IsEmailConfirmed;
    }
}

const Controller = {
    current: null,
    getDefaultUser: function() {
        return new UserModel({
            userName: '',
            email: '',
            role: DEFAULT_ANONYMOUS_USER,
            isEmailConfirmed: undefined,
        });
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
            Controller.current = this.storage.get(USER_STORAGE_KEY) || Controller.getDefaultUser();
        }

        return Controller.current;
    }

    load() {
        return this.proxy
            .call('GetUser')
            .then(data => this.store(data));
    }

    store(user) {
        if (!(user instanceof UserModel)) {
            user = new UserModel(user);
        }

        this.storage.set(USER_STORAGE_KEY, user);

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
}