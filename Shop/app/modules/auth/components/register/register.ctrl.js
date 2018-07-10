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
        this.model = this.auth.create();
        
        this.error = '';
    }

    submit() {
        if (this.form.$invalid) {
            return;
        }

        this.auth
            .register(this.model)
            .then(() => this.$state.go('home'));
    }
}