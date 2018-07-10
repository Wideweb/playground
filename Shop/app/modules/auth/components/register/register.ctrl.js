export default class {
    static get $inject() {
        return [
            'authService'
        ];
    }

    constructor(auth) {
        this.auth = auth;
        this.model = this.auth.create();
        
        this.error = '';
    }

    submit() {
        if (this.form.$invalid) {
            return;
        }

        this.auth.register(this.model);
    }
}