const CELL_STATUS = {
    EMPTY: 'cell-empty',
    MINE: 'cell-mine',
    ENEMY: 'cell-enemy',
    WRONG: 'cell-wrong',
    ENEMY_WRONG: 'cell-enemy-wrong',
    WINNER: 'cell-mine cell-winner',
    ENEMY_WINNER: 'cell-enemy cell-winner'
}

/**********************************************************************************************
 * Cell Model
**********************************************************************************************/
class Model {

    /******************************************************************************************
     Initialization
     ******************************************************************************************/
    constructor(
        /* Object */ data = {}
    ) {
        this.word = data.dictionaryItem.term;
        this.answer = data.dictionaryItem.translation;
        this.options = data.options;
        this.user = data.user;
        this.status = data.status;

        this.isAnswered = !!this.user;
    }
}

/**********************************************************************************************
 * Controller
 **********************************************************************************************/
const Controller = {
    index: null,
    list: [],

    /******************************************************************************************
     * METHODS
     ******************************************************************************************
     * registration of a new instance
     ******************************************************************************************/
    register: (data) => {
        let item = new Model(data);
        Controller.list.push(item);
    },

    /******************************************************************************************
     Clean up registered instances
     ******************************************************************************************/
    clear: () => {
        Controller.index = null;
        Controller.list = [];
    }

};

/**********************************************************************************************
 * Access Provider
 **********************************************************************************************/
export default class {
    static get $inject() {
        return [
            'userService'
        ];
    }

    /******************************************************************************************
     * Initialization
     ******************************************************************************************/
    constructor(
        /* Service */ me
    ) {
        this.me = me;
    }

    /******************************************************************************************
     References to private resources
     ******************************************************************************************
     * registered instances reference
     ******************************************************************************************/
    get list() {
        return Controller.list;
    }

    /******************************************************************************************
     A reference to current instance
     ******************************************************************************************/
    get current() {
        return Controller.list[Controller.index];
    }

    /******************************************************************************************
     A reference to current instance
     ******************************************************************************************/
    get index() {
        return Controller.index;
    }

    /******************************************************************************************
     Public Methods
     ******************************************************************************************
     Load training
     ******************************************************************************************/
    register({
        /* Array */ map,
        /* Array */ questions,
        /* Array */ path,
        /* String */ winner
    }) {
        Controller.list = [];

        for (let i = 0; i < map.length; i++) {
            let user = map[i];
            let question = questions[i];
            let status = CELL_STATUS.EMPTY;

            if (user === this.me.name) {
                status = CELL_STATUS.MINE;
            } else if (!!user) {
                status = CELL_STATUS.ENEMY;
            }

            question.status = status;
            question.user = user;

            Controller.register(question);
        }

        if (winner) {
            for (let index of path) {
                if (this.list[index].user === this.me.name) {
                    this.list[index].status = CELL_STATUS.WINNER;
                } else {
                    this.list[index].status = CELL_STATUS.ENEMY_WINNER;
                }
            }

            this.list.forEach(item => item.isAnswered = true);
        }
    }

    /******************************************************************************************
     Set current cell
     ******************************************************************************************/
    select(index) {
        Controller.index = index;
    }

    /******************************************************************************************
     Clear service data
     ******************************************************************************************/
    clear() {
        Controller.clear();
    }
}