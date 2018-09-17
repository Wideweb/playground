﻿import * as signalR from "@aspnet/signalr";

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
		this.won = this.winner === data.me;
		this.draw = this.winner === 'Draw';
		this.isEnemyConnected = true;
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
			'ticTacToeCellService',
			'errorHandler'
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
		map,
		errorHandler
	) {
		this.$rootScope = $rootScope;
		this.$q = $q;
		this.proxy = proxy;
		this.me = me;
		this.map = map;
		this.errorHandler = errorHandler;

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
     Enemy user name
     ******************************************************************************************/
	get enemy() {
		if (!this.current) {
			return null;
		}

		return this.me.name !== this.current.firstPlayer
			? this.current.firstPlayer
			: this.current.secondPlayer;
	}

    /******************************************************************************************
     * Establish a connection with the Hub and Start searching the room
     ******************************************************************************************/
	connect() {
		if (this.isConnected) {
			return;
		}

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
				state.me = this.me.name;
				Controller.register(state);
				this.map.register(state);
			});
		});

		connection.on("SelectSlotFailed", (state, index, option, user) => {
			this.$rootScope.$apply(() => {
				state.me = this.me.name;
				Controller.register(state);
				this.map.register(state);

				if (this.me.name === user) {
					this.map.list[index].status = 'cell-wrong';
				} else {
					this.map.list[index].status = 'cell-enemy-wrong';
				}
			});
		});

		connection.on("Start", (state) => {
			this.$rootScope.$apply(() => {
				state.me = this.me.name;
				Controller.register(state);
				this.map.register(state);
			});
		});

		connection.on("UserDisconnected", (rid, user) => {
			this.$rootScope.$apply(() => this.current.isEnemyConnected = false);
		});

		connection.on("Error", (error) => {
			this.$rootScope.$apply(() => this.errorHandler.handle(error));
		});

		Controller.connection = connection;
	}

    /******************************************************************************************
     * Start searching the room
     ******************************************************************************************/
	search() {
		if (!this.isConnected) {
			return;
		}

		return Controller.connection
			.invoke("Search")
			.catch(err => {
				console.error(err.toString());
				return this.$q.reject(err);
			})
			.then(() => this.$q.resolve());
	}

    /******************************************************************************************
     * Break connection with the Hub
     ******************************************************************************************/
	disconnect() {
		return Controller.connection.stop().then(() => {
			const deferred = this.$q.defer();

			this.$rootScope.$apply(() => {
				Controller.clear();
				deferred.resolve();
			});

			return deferred.promise;
		});
	}

    /******************************************************************************************
     * Select slot
     ******************************************************************************************/
	select(index) {
		this.map.select(index);
	}

    /******************************************************************************************
     * Submit selected slot
     ******************************************************************************************/
	submit(option) {
		if (!this.isMyTurn || !Controller.isConnected || !this.map.current) {
			return Promise.reject();
		}

		if (this.map.current.status === 'cell-wrong' || this.map.current.status === 'cell-enemy-wrong') {
			this.map.current.status = 'cell-empty';
		}

		return Controller.connection
			.invoke("SelectSlot", Controller.current.id, this.map.index, option)
			.catch(err => {
				console.error(err.toString());
				return this.$q.reject(err);
			})
			.then(() => this.$q.resolve());
	}

    /******************************************************************************************
     * Leave the room. User will not be able to reconnect to the left room.
     ******************************************************************************************/
	leave() {
		if (!Controller.isConnected) {
			return Promise.reject();
		}

		return Controller.connection
			.invoke("LeaveRoom", Controller.current.id)
			.catch(err => {
				console.error(err.toString());
				return this.$q.reject(err);
			})
			.then(() => {
				Controller.current = null;
				this.map.clear();
				return this.$q.resolve();
			});
	}

    /******************************************************************************************
     * Clear service data
     ******************************************************************************************/
	clear() {
		Controller.clear();
		this.map.clear();
	}
}