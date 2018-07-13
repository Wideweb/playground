import * as signalR from "@aspnet/signalr";

export default class {
    static get $inject() {
        return [
            '$scope',
            '$timeout'
        ];
    }

    constructor(
        $scope,
        $timeout
    ) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.messages = [];
        this.users = [];
        this.message = '';

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/chatHub")
            .build();

        this.connection.on("ReceiveMessage", (user, message) => {
            $scope.$apply(() => this.messages.push({ user, message }));

            this.$timeout(() => $('.message-list').scrollTop($('.message-list').prop("scrollHeight")), 0);
        });

        this.connection.on("UserConnected", (user) => {
            $scope.$apply(() => {
                this.messages.push({ user, message: 'Connected' });
                this.users.push(user);
            });

            this.$timeout(() => $('.message-list').scrollTop($('.message-list').prop("scrollHeight")), 0);
        });

        this.connection.on("UserDisconnected", (user) => {
            $scope.$apply(() => {
                this.messages.push({ user, message: 'Disconnected' });
                this.users.splice(this.users.indexOf(user), 1);
            });

            this.$timeout(() => $('.message-list').scrollTop($('.message-list').prop("scrollHeight")), 0);
        });

        this.connection.start().catch(err => console.error(err.toString()));
    }

    sendMessage() {
        if (!this.message) {
            return;
        }

        this.connection
            .invoke("SendMessage", this.message)
            .catch(err => console.error(err.toString()));
        this.message = '';
    }
}