class CellModel {

    constructor() {
        this.clear();
    }

    clear() {
        this.ref = null;
        this.status = 'empty';
    }
}

class MapModel {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [];

        for (let y = 0; y < height; y++) {
            this.cells.push([]);
            for (let x = 0; x < width; x++) {
                this.cells[y].push(new CellModel());
            }
        }
    }

    draw(figure) {
        for (let i = 0; i < figure.points.length; i++) {
            let dotX = figure.position.x + figure.points[i].x;
            let dotY = figure.position.y + figure.points[i].y;

            this.cells[dotY][dotX].status = 'busy';
            this.cells[dotY][dotX].ref = figure;
        }
    }

    clear() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.cells[y][x].clear();
            }
        }
    }

    isCellEmpty(x, y) {
        return this.cells[y][x].status === 'empty';
    }

    isCellFilled(x, y) {
        return this.cells[y][x].status === 'busy';
    }

    isCellMine(x, y, figure) {
        return this.cells[y][x].ref === figure;
    }

    clearCell(x, y) {
        this.cells[y][x].ref.removePart(x, y);
        this.cells[y][x].ref = null;
        this.cells[y][x].status === 'empty';
    }
}

class FigureModel {

    constructor() {
        this.position = { x: 4, y: 0 };

        this.views = []
        this.viewIndex = 0;
    }

    get points() {
        return this.views[this.viewIndex];
    }

    nextView() {
        this.viewIndex++;

        if (this.views.length <= this.viewIndex) {
            this.viewIndex = 0;
        }
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
                { x: -1, y: 0 },
                { x: -1, y: 1 },
                { x: -1, y: 2 },
                { x: 0, y: 2 },
            ],
            [
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: -1 },
            ]
        ];
    }
}

class BoxFigureModel extends FigureModel {

    constructor() {
        super();

        this.views = [
            [
                { x: -1, y: 0 },
                { x: -1, y: 1 },
                { x: 0, y: 0 },
                { x: 0, y: 1 },
            ]
        ];
    }
}

class DotsBagModel extends FigureModel {

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

export default class {
    static get $inject() {
        return [
            '$timeout'
        ];
    }

    constructor($timeout) {
        this.$timeout = $timeout;

        this.map = new MapModel(10, 20);
        this.bag = new DotsBagModel();
        this.v = { x: 0, y: 0 };

        this.next();
        this.update();

        document.onkeydown = (e) => {
            let v = { x: 0, y: 1 };

            switch (e.keyCode) {
                case 37:
                    v = { x: -1, y: 1 };
                    break;
                case 39:
                    v = { x: 1, y: 1 };
                    break;
                case 32:
                    this.current.nextView();
                    break;
            }

            if (this.current.canMove(this.map, v)) {
                this.v = v;
            }
        };
    }

    update() {
        if (this.current.canMove(this.map, this.v)) {
            this.current.move(this.v);
        } else {
            this.checkLines();
            this.next();
        }

        this.map.clear();

        this.map.draw(this.bag);
        this.map.draw(this.current);

        this.v = { x: 0, y: 1 };
        this.$timeout(() => this.update(), 200);
    }

    next() {
        let max = 0;
        let min = 3;
        let figureIndex = Math.floor(Math.random() * (max - min + 1)) + min;
        let figure = null;

        if (figureIndex === 0) {
            figure = new LineFigureModel();
        }

        if (figureIndex === 1) {
            figure = new ZFigureModel();
        }

        if (figureIndex === 2) {
            figure = new LFigureModel();
        }

        if (figureIndex === 3) {
            figure = new BoxFigureModel();
        }

        this.current && this.bag.addFigureDots(this.current);
        this.current = figure;
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
}