export default class {
    static get $inject() {
        return [
            '$state',
            'authService',
            'spinnerService',
            'userService',
            'chatService',
            'controlsService',
        ];
    }

    constructor(
        $state,
        /* Service */ auth,
        /* Service */ spinner,
        /* Service */ me,
        /* Service */ chat,
        /* Service */ controls
    ) {
        this.$state = $state;
        this.auth = auth;
        this.spinner = spinner;
        this.me = me;
        this.chat = chat;
        this.controls = controls;

        this.chat.connect();

        this.collapsed = true;
    }

    logout() {
        this.chat.disconnect();

        this.auth
            .logout()
            .then(() => this.$state.go('login'));
    }
  
}