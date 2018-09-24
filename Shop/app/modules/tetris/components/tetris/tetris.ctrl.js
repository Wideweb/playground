class CellModel {

}

class FigureModel {

    constructor() {
        this.points = [];
        this.position = { x: 0, y: 0 };
    }
}

class LineFigureModel extends FigureModel {

    constructor() {
        super();

        this.points = [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
        ];
    }

    move(vector) {
        this.position.x += vector.x;
        this.position.y += vector.y;

        for (let i = 0; i < this.points.length; i++) {
            this.points[i].x += vector.x;
            this.points[i].y += vector.y;
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
        this.$timeout;

        this.map = [
            [
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
            ],
            [
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
            ],
            [
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
            ],
            [
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
            ],
            [
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
            ],
            [
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
            ],
            [
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
            ],
            [
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
            ],
            [
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
            ],
            [
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
                new CellModel(),
            ],
        ]

        this.figure = new LineFigureModel();

        this.$timeout(() => this.update(), 1000);
    }

    update() {
        this.figure.move({ x: 0, y: -1 });
    }
}