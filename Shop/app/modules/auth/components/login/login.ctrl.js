export default class {

    constructor() {
        this.email = '';
        this.password = '';
        this.error = '';
    }

    submit() {
        this.error = 'server'
        console.log(this.email, this.password)
    }
}