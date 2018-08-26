export default class {
    static get $inject() {
        return [
            '$timeout',
            '$state',
            'chatService'
        ];
    }

    constructor(
        $timeout,
        $state,
        chat
    ) {
        this.$timeout = $timeout;
        this.$state = $state;
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

    canSendMessage() {
        return !!this.chat.id && !this.sending
    }

    $onDestroy() {
        this.chat.resetCurrent();
    }
}