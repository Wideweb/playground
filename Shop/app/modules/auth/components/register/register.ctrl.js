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
        this.model = this.auth.create();
        
        this.error = [];
    }

    submit() {
        if (this.form.$invalid) {
            return;
        }

        this.spinner.show();

        this.auth
            .register(this.model)
            .then(() => this.$state.go('home'))
            .catch(error => this.error = error[""])
            .finally(() => this.spinner.hide());
    }
}