import * as signalR from "@aspnet/signalr";

export default class {
    static get $inject() {
        return [
            'userService'
        ];
    }

    constructor(
        /* Service */ user
    ) {
        this.user = user.user;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("/chatHub")
            .build();

        connection.on("ReceiveMessage", (user, message) => {
            const msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const encodedMsg = user + " says " + msg;
            const li = document.createElement("li");
            li.textContent = encodedMsg;
            document.getElementById("messagesList").appendChild(li);
        });

        connection.start().catch(err => console.error(err.toString()));

        document.getElementById("sendButton").addEventListener("click", event => {
            const user = this.user.email;;
            const message = document.getElementById("messageInput").value;
            connection.invoke("SendMessage", user, message).catch(err => console.error(err.toString()));
            event.preventDefault();
        });
    }
  
}