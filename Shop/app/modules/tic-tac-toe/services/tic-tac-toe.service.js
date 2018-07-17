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
            'userService',
            'ticTacToeCellService'
        ];
    }

    /******************************************************************************************
     * Initialization
     ******************************************************************************************/
    constructor(
        $rootScope,
        $q,
        proxy,
        me,
        map
    ) {
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.proxy = proxy;
        this.me = me;
        this.map = map;

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
            this.$rootScope.$apply(() => {
                Controller.register(state);
                this.map.register(state);
            });
        });

        connection.on("Start", (state) => {
            this.$rootScope.$apply(() => {
                Controller.register(state);
                this.map.register(state);
            });
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
     * Select slot
     ******************************************************************************************/
    select(index) {
        this.map.select(index);
    }

    /******************************************************************************************
     * Submit selected slod
     ******************************************************************************************/
    submit(option) {
        if (!this.isMyTurn || !Controller.isConnected || !this.map.current) {
            return Promise.reject();
        }

        return Controller.connection
            .invoke("SelectSlot", Controller.current.id, this.map.index, option)
            .catch(err => {
                console.error(err.toString());
                return this.$q.reject(err);
            })
            .then(() => this.$q.resolve());
    }
}