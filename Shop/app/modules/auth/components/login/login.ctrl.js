export default class {
    static get $inject() {
        return [
            'authService'
        ];
    }

    constructor(
        /*Service*/ auth
    ) {
        this.auth = auth;

        this.email = '';
        this.password = '';
        this.error = '';
    }

    submit() {
        if (this.form.$invalid) {
            return;
        }

        this.auth.login(this.email, this.password);
    }
}