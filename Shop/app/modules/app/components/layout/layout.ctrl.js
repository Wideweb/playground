export default class {
    static get $inject() {
        return [
            '$state',
            'authService',
            'spinnerService'
        ];
    }

    constructor(
        $state,
        /* Service */ auth,
        /* Service */ spinner
    ) {
        this.$state = $state;
        this.auth = auth;
        this.spinner = spinner;
    }

    logout() {
        this.auth
            .logout()
            .then(() => this.$state.go('login'));
    }
  
}