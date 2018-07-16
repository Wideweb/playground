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
        this.init(data);   
    }

    init(data) {
        this.id = data.rid;
        this.turn = data.turn ? data.firstPlayer : data.secondPlayer;
        this.map = data.map;
        this.firstPlayer = data.firstPlayer;
        this.secondPlayer = data.secondPlayer;
        this.winner = data.winner;
    }
}

/**********************************************************************************************
 * Controller
 **********************************************************************************************/
const Controller = {
    connection: null,
    isConnected: false,
    current: null,

    /******************************************************************************************
     * METHODS
     ******************************************************************************************
     * registration of a new instance
     ******************************************************************************************/
    register: (data) => {
        Controller.current
            ? Controller.current.init(data)
            : Controller.current = new Model(data);
    },

    /******************************************************************************************
     Clean up registered instances
     ******************************************************************************************/
    clear: () => {
        Controller.connection = null;
        Controller.isConnected = false;
        Controller.current = null;
    }
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
     A reference to current instance
     ******************************************************************************************/
    get current() {
        return Controller.current;
    }

    /******************************************************************************************
     A reference to current instance map
     ******************************************************************************************/
    get map() {
        return Controller.current.map;
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
            state.map = state.map.map(item => {
                if (item === this.me.name) {
                    return 'mine';
                }
                if (!!item) {
                    return 'enemy';
                }
                return 'empty';
            });
            this.$rootScope.$apply(() => Controller.register(state));
        });

        connection.on("Start", (state) => {
            state.map = state.map.map(item => {
                if (item === this.me.name) {
                    return 'mine';
                }
                if (!!item) {
                    return 'enemy';
                }
                return 'empty';
            });
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
    selectSlot(index) {
        if (!this.isMyTurn || !Controller.isConnected) {
            return Promise.reject();
        }

        return Controller.connection
            .invoke("SelectSlot", Controller.current.id, index)
            .catch(err => {
                console.error(err.toString());
                return this.$q.reject(err);
            })
            .then(() => this.$q.resolve());
    }
}