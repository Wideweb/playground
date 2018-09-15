export default class {
    static get $inject() {
        return [
			'errorHandler'
		];
    }

    constructor(
		error
	) {
		this.error = error;
	}

	$onDestroy() {
        this.error.viewed = true;
    }
}