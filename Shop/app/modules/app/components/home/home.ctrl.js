export default class {
    static get $inject() {
        return [
            '$timeout',
            'chatService'
        ];
    }

    constructor(
        $timeout,
        chat
    ) {
        this.$timeout = $timeout;
        this.chat = chat;

        this.message = '';
        this.sending = false;
    }

    sendMessage() {
        if (!this.message) {
            return;
        }

        this.sending = true;

        this.chat
            .sendMessage(this.message)
            //IE
            .then(() => this.$timeout(() => (this.message = null, this.sending = false)))
            .catch(() => this.$timeout(() => this.sending = false))
    }

    selectChannel(channel) {
        this.chat.channel = channel;
    }

    selectUser(user) {
        this.chat.user = user;
    }

    canSendMessage() {
        return !!this.chat.id && !this.sending
    }
}