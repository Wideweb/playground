export default class {
	static get $inject() {
		return [
			'$state',
			'authService',
			'spinnerService',
			'userService',
			'chatService',
			'subscriptionService',
		];
	}

	constructor(
		$state,
        /* Service */ auth,
        /* Service */ spinner,
        /* Service */ me,
        /* Service */ chat,
        /* Service */ subscriptionService,
	) {
		this.$state = $state;
		this.auth = auth;
		this.spinner = spinner;
		this.me = me;
		this.chat = chat;
		this.subscriptionService = subscriptionService;

		this.chat.connect();

		this.collapsed = true;
		this.subscriptionService.subscribe();
	}

	logout() {
		this.auth
			.logout()
			.then(() => this.$state.go('login'));
	}

	$onDestroy() {
		this.chat.disconnect();
	}

}