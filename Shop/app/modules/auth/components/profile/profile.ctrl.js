export default class {
    static get $inject() {
        return [
            '$state',
            'userService',
            'spinnerService'
        ];
    }

    constructor(
        $state,
        /* Service */ me,
        /* Service */ spinner
    ) {
        this.$state = $state;
        this.me = me;
        this.spinner = spinner;

        this.model = this.me.clone();
        this.error = [];
    }

    submit() {
        if (this.form.$invalid) {
            return;
        }

        this.spinner.show();

        this.me.update(this.model)
            .catch(error => this.error = error[""])
            .finally(() => this.spinner.hide());
    }
}