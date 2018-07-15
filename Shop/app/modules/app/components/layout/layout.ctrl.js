export default class {
    static get $inject() {
        return [
            '$state',
            'authService',
            'spinnerService',
            'userService',
            'chatService'
        ];
    }

    constructor(
        $state,
        /* Service */ auth,
        /* Service */ spinner,
        /* Service */ me,
        /* Service */ chat
    ) {
        this.$state = $state;
        this.auth = auth;
        this.spinner = spinner;
        this.me = me;
        this.chat = chat;

        this.chat.connect();
    }

    logout() {
        this.chat.disconnect();

        this.auth
            .logout()
            .then(() => this.$state.go('login'));
    }
  
}