export default class {
    static get $inject() {
        return [
            '$state',
            'chatService'
        ];
    }

    constructor(
        $state,
        chat
    ) {
        this.$state = $state;
        this.chat = chat;
    }

    selectChannel(channel) {
        this.chat.channel = channel;
        this.$state.go('channels.channel');
    }

    selectUser(user) {
        this.chat.user = user;
        this.$state.go('channels.channel');
    }
}