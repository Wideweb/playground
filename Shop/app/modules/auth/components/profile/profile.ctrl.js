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

		this.name = this.me.userName;
		this.email = this.me.name;
		this.image = null;
        this.error = [];
    }

    submit() {}
}