export class registerModel {
    constructor() {
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
    }
}

export default class {
    static get $inject() {
        return [
            'userService',
            'httpProxyService',
        ];
    }

    constructor(
        user,
        proxy
    ) {
        this.user = user;
        this.proxy = proxy;
    }

    create() {
        return new registerModel();
    }

    register(
        /* registerModel */ model
    ) {
        return this.proxy
            .call('Register', {}, model)
            .then(() => this.user.load());
    }

    login(
        /* string */ email,
        /* string */ password
    ) {
        return this.proxy
            .call('Login', {}, { email, password })
            .then(() => this.user.load());
    }

    logout() {
        return this.proxy
            .call('Logout')
            .then(() => this.user.clear());
    }

    isLoggedIn() {
        return this.user.isLoggedIn();
    }
}