import * as signalR from "@aspnet/signalr";

/**********************************************************************************************
 * Chat Message Model
**********************************************************************************************/
class MessageModel {

    /******************************************************************************************
     Initialization
     ******************************************************************************************/
    constructor(
    /* Object */ data
    ) {
        this.from = data.from;
        this.text = data.text;
        this.isMine = data.isMine;
    }
}

/**********************************************************************************************
 * Chat Model
**********************************************************************************************/
class Model {

    /******************************************************************************************
     Initialization
     ******************************************************************************************/
    constructor(
        /* Object */ data
    ) {
        this.id = data.channel || data.user;
        this.isPrivate = !data.channel;
        this.connected = true;
        this.messages = [];
        this.unreadNumber = 0;
    }
}

/**********************************************************************************************
 * Controller
 **********************************************************************************************/
const Controller = {
    connection: null,
    isConnected: false,
    list: [],
    map: {},

    /******************************************************************************************
     * METHODS
     ******************************************************************************************
     * registration of a new instance
     ******************************************************************************************/
    register: (data) => {
        let item = new Model(data);

        if (!Controller.map[item.id]) {
            Controller.list.push(item);
            Controller.map[item.id] = item;
        } else {
            item = Controller.map[item.id];
            item.connected = true;
        }

        return item;
    },

    /******************************************************************************************
     Clean up registered instances
     ******************************************************************************************/
    clear: () => {
        Controller.list = [];
        Controller.map = {};
    },

    /******************************************************************************************
     Set an instance to be current (by ID) -> or nothing
     ******************************************************************************************/
    setCurrent: (
        /* String? */ id
    ) => {
        Controller.current = Controller.map[id];
        Controller.current && (Controller.current.unreadNumber = 0);
        return Controller.current;
    },

    /******************************************************************************************
     Mark chat as disconnected
     ******************************************************************************************/
    remove: (
        /* String? */ id
    ) => {
        let chat = Controller.map[id];
        chat && (chat.connected = false);
    },
};

/**********************************************************************************************
 * Access Provider
 **********************************************************************************************/
export default class {
    static get $inject() {
        return [
            '$rootScope',
            '$q',
            'httpProxyService',
            'userService'
        ];
    }

    /******************************************************************************************
     * Initialization
     ******************************************************************************************/
    constructor(
        $rootScope,
        $q,
        proxy,
        me
    ) {
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.proxy = proxy;
        this.me = me;

        Controller.connection = null;
    }

    /******************************************************************************************
     References to private resources
     ******************************************************************************************
     * registered channels
     ******************************************************************************************/
    get channels() {
        return Controller.list.filter(item => !item.isPrivate && item.connected);
    }

    /******************************************************************************************
     * registered users
     ******************************************************************************************/
    get users() {
        return Controller.list.filter(item => item.isPrivate && item.connected);
    }

    /******************************************************************************************
     * registered chat messages
     ******************************************************************************************/
    get messages() {
        return Controller.current ? Controller.current.messages : [];
    }

    /******************************************************************************************
     * selected chat id
     ******************************************************************************************/
    get id() {
        return Controller.current ? Controller.current.id : null;
    }

    /******************************************************************************************
     * selected chat privat flag
     ******************************************************************************************/
    get isPrivate() {
        return Controller.current ? Controller.current.isPrivate : false;
    }

    /******************************************************************************************
     * Is connection with Chant hub established
     ******************************************************************************************/
    get isConnected() {
        return Controller.isConnected;
    }

    /******************************************************************************************
     * Select channel
     ******************************************************************************************/
    set channel(value) {
        if (!Controller.setCurrent(value)) {
            Controller.register({ channel: value });
        }
    }

    /******************************************************************************************
     * Select user
     ******************************************************************************************/
    set user(value) {
        if (!Controller.setCurrent(value)) {
            Controller.register({ user: value });
        }
    }

    /******************************************************************************************
     * Establish a connection with the Chat Hub
     ******************************************************************************************/
    connect() {
        if (this.isConnected) {
            return;
        }

        this.channel = 'All';

        let connection = new signalR.HubConnectionBuilder()
            .withUrl("/chatHub")
            .build();

        connection.start()
            .then(() => Controller.isConnected = true)
            .catch(err => {
                console.error(err.toString());
                throw err;
            });

        connection.on("ReceiveMessage", (channel, user, text) => {
            this.$rootScope.$apply(() => this.onMessage(channel, user, text));
        });

        connection.on("ReceivePrivateMessage", (from, to, text) => {
            this.$rootScope.$apply(() => this.onPrivateMessage(from, to, text));
        });

        connection.on("ConnectedUsers", (users) => {
            this.$rootScope.$apply(() => users.forEach(user => Controller.register({ user })));
        });

        connection.on("UserConnected", (user) => {
            this.$rootScope.$apply(() => Controller.register({ user }));
        });

        connection.on("UserDisconnected", (user) => {
            this.$rootScope.$apply(() => this.me.name != user && Controller.remove(user));
        });

        Controller.connection = connection;
    }

    /******************************************************************************************
     * Break connection with the Chat Hub
     ******************************************************************************************/
    disconnect() {
        return Controller.connection.stop().then(() => {
            Controller.isConnected = false;
            Controller.connection = null;
            Controller.clear();
        });
    }

    /******************************************************************************************
     * Receive message in channel
     ******************************************************************************************/
    onMessage(channel, user, text) {
        let chat = Controller.map[channel];
        if (!chat) {
            chat = Controller.register({ channel });
        }

        let message = new MessageModel({ from: user, text, isMine: user === this.me.name });
        chat.messages.push(message);

        this.id !== channel && chat.unreadNumber++;
    }

    /******************************************************************************************
     * Receive private message from user
     ******************************************************************************************/
    onPrivateMessage(from, to, text) {
        let id = this.me.name == from ? to : from;
        let chat = Controller.map[id];
        if (!chat) {
            chat = Controller.register({ user: id });
        }

        let message = new MessageModel({ from, text, isMine: from === this.me.name });
        chat.messages.push(message);

        this.id !== id && chat.unreadNumber++;
    }

    /******************************************************************************************
     * Send message
     ******************************************************************************************/
    sendMessage(text) {
        if(!Controller.current){
            return Promise.reject();
        }

        return Controller.current.isPrivate
            ? this.sendPrivateMessage(Controller.current.id, text)
            : this.sendChannelMessage(Controller.current.id, text);
    }

    /******************************************************************************************
     * Send message to channel
     ******************************************************************************************/
    sendChannelMessage(channel, text) {
        if (!text || !Controller.isConnected) {
            return Promise.reject();
        }

        return Controller.connection
            .invoke("SendMessage", channel, text)
            .catch(err => {
                console.error(err.toString());
                return this.$q.reject(err);
            })
            .then(() => this.$q.resolve());
    }

    /******************************************************************************************
     * Send private message to user
     ******************************************************************************************/
    sendPrivateMessage(user, text) {
        if (!text || !Controller.isConnected) {
            return Promise.reject();
        }

        return Controller.connection
            .invoke("SendPrivateMessage", user, text)
            .catch(err => {
                console.error(err.toString());
                return this.$q.reject(err);
            })
            .then(() => this.$q.resolve());
    }

    resetCurrent() {
        Controller.current = null;
    }
}