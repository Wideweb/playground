export default class {
    static get $inject() {
        return [
            '$state',
            'authService'
        ];
    }

    constructor(
        $state,
        /*Service*/ auth
    ) {
        this.$state = $state;
        this.auth = auth;

        this.email = '';
        this.password = '';
        this.error = '';
    }

    submit() {
        if (this.form.$invalid) {
            return;
        }

        this.auth
            .login(this.email, this.password)
            .then(() => this.$state.go('home'));
    }
}