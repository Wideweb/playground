import FigureFactory, { DotsBagModel } from '../../services/figure.factory';
import MapModel from './tetris.map';

const DEFAULT_DELAY = 400;
const ACCELERATED_DELAY = 25;

export default class {
    static get $inject() {
        return [
            '$timeout',
            '$state',
			'inputManager',
			'dictionaryService'
        ];
    }

    constructor(
        $timeout,
        $state,
		inputManager,
		dictionary
    ) {
        this.$timeout = $timeout;
        this.$state = $state;
		this.inputManager = inputManager;
		this.dictionary = dictionary;

        this.isOver = false;

		this.figureFactory = new FigureFactory(this.dictionary.list.map(item => item.term));
        this.map = new MapModel(10, 20);
        this.bag = new DotsBagModel();
        this.v = { x: 0, y: 0 };
        this.delay = DEFAULT_DELAY;

        this.next();
        this.update();

        this.inputManager.onMoveLeft(() => {
            let v = { x: -1, y: 1 };

            if (this.current.canMove(this.map, v)) {
                this.v = v;
            }
        });

        this.inputManager.onMoveRight(() => {
            let v = { x: 1, y: 1 };

            if (this.current.canMove(this.map, v)) {
                this.v = v;
            }
        });

        this.inputManager.onClick(() => {
            if (this.current.canChangeView(this.map)) {
                this.current.changeView();
            }
        });

        this.inputManager.onMoveDown(() => {
            this.delay = ACCELERATED_DELAY;
        });
    }

    update() {
        if (this.current.canMove(this.map, this.v)) {
            this.current.move(this.v);
        } else {
            this.next();
            this.checkLines();
            this.delay = DEFAULT_DELAY;
        }

        this.map.clear();

        this.map.draw(this.bag);
        this.map.draw(this.current);

        this.v = { x: 0, y: 1 };
        !this.isOver && this.$timeout(() => this.update(), this.delay);
    }

    next() {
        this.current && this.bag.addFigureDots(this.current);
        this.current = this.figureFactory.createRandom();
        if (!this.current.canMove(this.map, { x: 0, y: 0 })) {
            this.finish();
        }
    }

    checkLines() {
        for (let y = 0; y < this.map.height; y++) {
            let isFull = true;
            for (let x = 0; x < this.map.width; x++) {
                isFull = isFull && this.map.isCellFilled(x, y);
            }

            if (isFull) {
                for (let x = 0; x < this.map.width; x++) {
                    this.map.clearCell(x, y);
                }

                this.bag.shiftDotsBelow(y);
            }
        }
    }

    finish() {
        this.isOver = true;
        this.$state.go('tetris-results');
    }
}