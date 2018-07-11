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

        this.email = '';
        this.password = '';
        this.error = [];
    }

    submit() {
        if (this.form.$invalid) {
            return;
        }

        this.spinner.show();

        this.auth
            .login(this.email, this.password)
            .then(() => this.$state.go('home'))
            .catch(error => this.error = error[""])
            .finally(() => this.spinner.hide());
    }
}