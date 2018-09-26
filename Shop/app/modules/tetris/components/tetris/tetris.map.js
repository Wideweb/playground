class CellModel {

    constructor() {
        this.clear();
    }

    clear() {
        this.ref = null;
        this.status = 'empty';
    }
}

export default class MapModel {

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