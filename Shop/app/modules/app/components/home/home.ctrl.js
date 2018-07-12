import * as signalR from "@aspnet/signalr";

export default class {
    static get $inject() {
        return [
            '$scope',
            '$timeout',
            'userService'
        ];
    }

    constructor(
        $scope,
        $timeout,
        /* Service */ user
    ) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.user = user.user;
        this.messages = [];
        this.message = '';

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/chatHub")
            .build();

        this.connection.on("ReceiveMessage", (user, message) => {
            $scope.$apply(() => this.messages.push({ user, message }));

            this.$timeout(() => $('.message-list').scrollTop($('.message-list').prop("scrollHeight")), 0);
        });

        this.connection.start().catch(err => console.error(err.toString()));
    }

    sendMessage() {
        if (!this.message) {
            return;
        }

        this.connection
            .invoke("SendMessage", this.user.email, this.message)
            .catch(err => console.error(err.toString()));
        this.message = '';
    }
}