import { fillTemplate } from '../helpers/utils';

const KNOWN_ERROR_TYPES = {
	DICTIONARY_CAPACITY: 'DICTIONARY_CAPACITY',
}

const ERROR_DESCRIPTION = {
	[KNOWN_ERROR_TYPES.DICTIONARY_CAPACITY]: 'There should be atleast {number} words in the dictionary.',
}

export default class {
	static get $inject() {
		return [
			'$state'
		];
	}

	constructor(
		$state
	) {
		this.$state = $state;
		this.description = null;
		this.viewed = true;
	}

	handle(error = {}) {
		this.description = null;
		this.viewed = false;

		if (!error || !error.code) {
			this.description = 'Unknown error';
			return;
		}

		switch (error.code) {
			case KNOWN_ERROR_TYPES.DICTIONARY_CAPACITY:
				this.description = fillTemplate(ERROR_DESCRIPTION[error.code], { number: error.data });
				break;
			default:
				this.description = 'Unknown error';
				break;
		}

		this.$state.$current.name !== 'home' && this.$state.go('home');
	}
}