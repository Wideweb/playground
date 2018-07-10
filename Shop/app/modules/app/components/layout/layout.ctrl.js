export default class {
    static get $inject() {
        return [
            '$state',
            'authService'
        ];
    }

    constructor(
        $state,
        /* Service */ auth
    ) {
        this.$state = $state;
        this.auth = auth;
    }

    logout() {
        this.auth
            .logout()
            .then(() => this.$state.go('login'));
    }
  
}