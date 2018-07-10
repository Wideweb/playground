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
        userService,
        proxy
    ) {
        this.userService = userService;
        this.proxy = proxy;
    }

    create() {
        return new registerModel();
    }

    register(
        /* registerModel */ model
    ) {
        return this.proxy.call('Register', {}, model);
    }

    login(
        /* string */ email,
        /* string */ password
    ) {
        return this.proxy.call('Login', {}, { email, password });
    }

    logout() {
        return this.proxy.call('Logout');
    }

    isLoggedIn() {
        return this.userService.isLoggedIn();
    }
}