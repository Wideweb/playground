import * as signalR from "@aspnet/signalr";

/**********************************************************************************************
 * Game Model
**********************************************************************************************/
class Model {

    /******************************************************************************************
     Initialization
     ******************************************************************************************/
    constructor(
        /* Object */ data
    ) {
        this.id = data.rid;
        this.turn = data.turn ? data.firstPlayer : data.secondPlayer;
        this.map = data.map;
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
     * registered users
     ******************************************************************************************/
    get users() {
        return Controller.list.filter(item => item.isPrivate && item.connected);
    }

    /******************************************************************************************
     * My turn flag
     ******************************************************************************************/
    get isMyTurn() {
        return Controller.current ? Controller.current.turn === this.me.name : false;
    }

    /******************************************************************************************
     * Is connection with Chant hub established
     ******************************************************************************************/
    get isConnected() {
        return Controller.isConnected;
    }

    /******************************************************************************************
     * Establish a connection with the Chat Hub And Start searching the room
     ******************************************************************************************/
    search() {
        if (this.isConnected) {
            return;
        }

        this.channel = 'All';

        let connection = new signalR.HubConnectionBuilder()
            .withUrl("/ticTacToeHub")
            .build();

        connection.start()
            .then(() => Controller.isConnected = true)
            .catch(err => {
                console.error(err.toString());
                throw err;
            });

        connection.on("SelectSlot", (state) => {
            this.$rootScope.$apply(() => Controller.register(state));
        });

        connection.on("Start", (state) => {
            this.$rootScope.$apply(() => Controller.register(state));
        });

        connection.on("UserDisconnected", (user) => {
            this.$rootScope.$apply(() => console.log('UserDisconnected'));
        });

        Controller.connection = connection;
    }

    /******************************************************************************************
     * Break connection with the Hub
     ******************************************************************************************/
    disconnect() {
        Controller.connection.stop().then(() => {
            Controller.isConnected = false;
            Controller.connection = null;
            Controller.clear();
        });
    }

    /******************************************************************************************
     * Send message to channel
     ******************************************************************************************/
    SelectSlot(index) {
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
}