const STUDY_LEVEL_CLASS_MAP = {
    0: '',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four'
}

const STUDY_LEVEL_MAX = 4;

/**********************************************************************************************
 * Training Item Model
**********************************************************************************************/
class Model {

    /******************************************************************************************
     Initialization
     ******************************************************************************************/
    constructor(
        /* Object */ data
    ) {
        this.id = data.dictionaryItem.id;
        this.word = data.dictionaryItem.term;
        this.answer = data.dictionaryItem.translation;
        this.options = data.options;
        this.studyLevel = data.studyLevel;
        this.image = data.image;

        this.studyLevelClass = this.studyLevel > STUDY_LEVEL_MAX
            ? STUDY_LEVEL_CLASS_MAP[STUDY_LEVEL_MAX]
            : STUDY_LEVEL_CLASS_MAP[this.studyLevel];

        this.isAnswered = false;
        this.isCorrect = undefined;
    }

    serialize() {
        return {
            dictionaryItemId: this.id,
            isCorrect: this.isCorrect
        }
    }
}

/**********************************************************************************************
 * Controller
 **********************************************************************************************/
const Controller = {
    list: [],
    index: 0,

    /******************************************************************************************
     * METHODS
     ******************************************************************************************
     * registration of a new instance
     ******************************************************************************************/
    register: (list = []) => {
        list.forEach(data => {
            let item = new Model(data);
            Controller.list.push(item);
        });

        return Controller.list;
    },

    /******************************************************************************************
     Clean up registered instances
     ******************************************************************************************/
    clear: () => {
        Controller.list = [];
        Controller.index = 0;
    }

};

/**********************************************************************************************
 * Access Provider
 **********************************************************************************************/
export default class {
    static get $inject() {
        return [
            'httpProxyService',
        ];
    }

    /******************************************************************************************
     * Initialization
     ******************************************************************************************/
    constructor(
        proxy
    ) {
        this.proxy = proxy;
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
     * training finish flag
     ******************************************************************************************/
    get finish() {
        return Controller.index >= Controller.list.length;
    }

    /******************************************************************************************
     A reference to current instance
     ******************************************************************************************/
    get current() {
        return Controller.list[Controller.index];
    }

    get correct() {
        return Controller.list.filter(item => item.isCorrect);
    }

    /******************************************************************************************
     Public Methods
     ******************************************************************************************
     Load training
     ******************************************************************************************/
    load() {
        return this.proxy
            .call('GetTraining')
            .then((data) => {
                Controller.clear();
                Controller.register(data);
            });
    }

    submit(answer) {
        this.current.isAnswered = true;
        this.current.isCorrect = this.current.answer === answer;
    }

    next() {
        !this.finish ? Controller.index++ : void 0;
    }

    /******************************************************************************************
     Save training results
     ******************************************************************************************/
    save() {
        return this.proxy
            .call('SaveTraining', {}, this.list.map(item => item.serialize()));
    }
}