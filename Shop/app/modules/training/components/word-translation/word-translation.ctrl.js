export default class {
	static get $inject() {
		return [
			'$timeout',
			'trainingService',
			'spinnerService'
		];
	}

	constructor(
		$timeout,
        /*Service*/ training,
        /*Service*/ spinner,
	) {
		this.$timeout = $timeout;
		this.training = training;
		this.spinner = spinner;

		this.wait = false;
	}

	hint() {
		this.submit(null);
	}

	submit(option) {
		if (this.wait) {
			return;
		}

		this.wait = true;
		this.training.submit(option);
		this.$timeout(() => {
			this.training.next();
			this.wait = false;
			this.training.finish && this.training.save();
		}, 500);
	}

	play() {
		this.spinner.show();
		this.training
			.load()
			.finally(() => this.spinner.hide());
	}
}