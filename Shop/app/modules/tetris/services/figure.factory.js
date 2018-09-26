class FigureModel {

    constructor() {
        this.position = { x: 4, y: 0 };

        this.views = []
        this.viewIndex = 0;
    }

    get points() {
        return this.views[this.viewIndex];
    }

    get nextViewIndex() {
        let next = this.viewIndex + 1;
        if (this.views.length <= next) {
            next = 0;
        }

        return next;
    }

    changeView() {
        this.viewIndex = this.nextViewIndex;
    }

    canChangeView(map) {
        let points = this.views[this.nextViewIndex]

        for (let i = 0; i < points.length; i++) {
            let dotX = this.position.x + points[i].x;
            let dotY = this.position.y + points[i].y;

            if (dotX >= map.width || dotX < 0 || dotY < 0 || dotY >= map.height) {
                return false;
            }

            if (!map.isCellEmpty(dotX, dotY) && !map.isCellMine(dotX, dotY, this)) {
                return false;
            }
        }

        return true;
    }

    move(vector) {
        this.position.x += vector.x;
        this.position.y += vector.y;
    }

    canMove(map, vector) {
        for (let i = 0; i < this.points.length; i++) {
            let dotX = this.position.x + this.points[i].x + vector.x;
            let dotY = this.position.y + this.points[i].y + vector.y;

            if (dotX >= map.width || dotX < 0 || dotY < 0 || dotY >= map.height) {
                return false;
            }

            if (!map.isCellEmpty(dotX, dotY) && !map.isCellMine(dotX, dotY, this)) {
                return false;
            }
        }

        return true;
    }

    removePart(x, y) {
        for (let i = 0; i < this.points.length; i++) {
            let dotX = this.position.x + this.points[i].x;
            let dotY = this.position.y + this.points[i].y;

            if (x === dotX && y === dotY) {
                this.points.splice(i, 1);
            }
        }
    }
}

class LineFigureModel extends FigureModel {

    constructor() {
        super();

        this.views = [
            [
                { x: -2, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
            ],
            [
                { x: 0, y: -2 },
                { x: 0, y: -1 },
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: 2 },
            ]
        ];
    }
}

class ZFigureModel extends FigureModel {

    constructor() {
        super();

        this.views = [
            [
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
            ],
            [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: -1, y: 1 },
                { x: -1, y: 2 },
            ]
        ];
    }
}

class LFigureModel extends FigureModel {

    constructor() {
        super();

        this.views = [
            [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: 2 },
                { x: 1, y: 2 },
            ],
            [
                { x: -1, y: 2 },
                { x: -1, y: 1 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
            ],
            [
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: 2 },
            ],
            [
                { x: -1, y: 1 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 1, y: 0 },
            ],
        ];
    }
}

class TFigureModel extends FigureModel {

    constructor() {
        super();

        this.views = [
            [
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
            ],
            [
                { x: 0, y: -1 },
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: -1, y: 0 },
            ],
            [
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: -1 },
            ],
            [
                { x: 0, y: -1 },
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 0 },
            ],
        ];
    }
}

class BoxFigureModel extends FigureModel {

    constructor() {
        super();

        this.views = [
            [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
            ]
        ];
    }
}

export class DotsBagModel extends FigureModel {

    constructor() {
        super();

        this.position = { x: 0, y: 0 };
        this.views = [[]];
    }

    addFigureDots(figure) {
        for (let i = 0; i < figure.points.length; i++) {
            let x = figure.position.x + figure.points[i].x;
            let y = figure.position.y + figure.points[i].y;

            this.points.push({ x, y });
        }
    }

    shiftDotsBelow(y) {
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].y < y) {
                this.points[i].y++
            }
        }
    }
}

const FIGURE_TYPES = [LineFigureModel, ZFigureModel, LFigureModel, BoxFigureModel, TFigureModel]

export default class FigureFactory {
    static create(index) {
        return new FIGURE_TYPES[index]();
    }

    static createRandom() {
        let max = FIGURE_TYPES.length - 1;
        let min = 0;
        let index = Math.floor(Math.random() * (max - min + 1)) + min;

        return FigureFactory.create(index);
    }
}