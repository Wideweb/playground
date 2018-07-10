const DEFAULT_ANONYMOUS_USER = 'Anonymous';
const USER_STORAGE_KEY = 'me';
const TOKEN_KEY = 'id_token';

export class UserModel {
    constructor(data) {
        this.userId = data.id;
        this.userName = data.sub;
        this.userFirstName = data.first_name;
        this.userLastName = data.last_name;
        this.userFullName = data.first_name + ' ' + data.last_name;
        this.userFullNameAlt = data.last_name + ', ' + data.first_name;
        this.userRole = data.roles[0];
        this.userRights = data.rights;
    }
}

const Controller = {
    current: null,
    getDefaultUser: function() {
        return new UserModel({
            uid: '',
            sub: '',
            first_name: '',
            last_name: '',
            roles: [DEFAULT_ANONYMOUS_USER],
            rights: null,
            lastLogin: null,
            bpGuid: null,
        });
    }
}

export default class {
    static get $inject() {
        return [
            'storageService'
        ];
    }

    constructor(storage) {
        this.storage = storage;
    }

    get user() {
        if (!Controller.current) {
            Controller.current = this.storage.get(USER_STORAGE_KEY) || Controller.getDefaultUser();
        }

        return Controller.current;
    }

    get token() {
        return this.storage.get(TOKEN_KEY);
    }

    set token(token) {
        this.storage.put(TOKEN_KEY, token);
    }

    store(user, accessToken) {
        if (!(user instanceof UserModel)) {
            user = new UserModel(user);
        }

        this.storage.put(USER_STORAGE_KEY, user);
        this.token = accessToken;

        Controller.current = user;
    }

    clear() {
        this.storage.rem(USER_STORAGE_KEY);
        this.storage.rem(TOKEN_KEY);

        this.user = null;
    }

    inRole(role) {
        return this.user.userRole === role;
    }

    inAnyRole(roles) {
        return roles.includes(this.user.userRole);
    }

    isLoggedIn() {
        return !this.inRole(DEFAULT_ANONYMOUS_USER);
    }
}