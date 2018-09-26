class Randomizer {
	static next(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static nextLetter() {
		let letterCode = this.next("A".charCodeAt(0), "Z".charCodeAt(0));
		return String.fromCharCode(letterCode);
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

	constructor(wordManager) {
		super();

		let letters = wordManager.take(5);
		this.views = [
			[
				{ x: -2, y: 0, letter: letters[0] },
				{ x: -1, y: 0, letter: letters[1] },
				{ x: 0, y: 0, letter: letters[2] },
				{ x: 1, y: 0, letter: letters[3] },
				{ x: 2, y: 0, letter: letters[4] },
			],
			[
				{ x: 0, y: -2, letter: letters[0] },
				{ x: 0, y: -1, letter: letters[1] },
				{ x: 0, y: 0, letter: letters[2] },
				{ x: 0, y: 1, letter: letters[3] },
				{ x: 0, y: 2, letter: letters[4] },
			]
		];
	}
}

class ZFigureModel extends FigureModel {

	constructor(wordManager) {
		super();

		let letters = wordManager.take(2);
		let extra = Randomizer.nextLetter() + Randomizer.nextLetter();
		this.views = [
			[
				{ x: -1, y: 0, letter: letters[0] },
				{ x: 0, y: 0, letter: letters[1] },
				{ x: 0, y: 1, letter: extra[0] },
				{ x: 1, y: 1, letter: extra[1] },
			],
			[
				{ x: 0, y: 0, letter: letters[0] },
				{ x: 0, y: 1, letter: letters[1] },
				{ x: -1, y: 1, letter: extra[0] },
				{ x: -1, y: 2, letter: extra[1] },
			]
		];
	}
}

class LFigureModel extends FigureModel {

	constructor(wordManager) {
		super();

		let letters = wordManager.take(3);
		let extra = Randomizer.nextLetter();
		this.views = [
			[
				{ x: 0, y: 0, letter: letters[0] },
				{ x: 0, y: 1, letter: letters[1] },
				{ x: 0, y: 2, letter: letters[2] },
				{ x: 1, y: 2, letter: extra },
			],
			[
				{ x: -1, y: 2, letter: extra },
				{ x: -1, y: 1, letter: letters[0] },
				{ x: 0, y: 1, letter: letters[1] },
				{ x: 1, y: 1, letter: letters[2] },
			],
			[
				{ x: -1, y: 0, letter: extra },
				{ x: 0, y: 0, letter: letters[0] },
				{ x: 0, y: 1, letter: letters[1] },
				{ x: 0, y: 2, letter: letters[2] },
			],
			[
				{ x: -1, y: 1, letter: letters[0] },
				{ x: 0, y: 1, letter: letters[1] },
				{ x: 1, y: 1, letter: letters[2] },
				{ x: 1, y: 0, letter: extra },
			],
		];
	}
}

class TFigureModel extends FigureModel {

	constructor(wordManager) {
		super();

		let letters = wordManager.take(3);
		let extra = Randomizer.nextLetter();
		this.views = [
			[
				{ x: -1, y: 0, letter: letters[0] },
				{ x: 0, y: 0, letter: letters[1] },
				{ x: 1, y: 0, letter: letters[2] },
				{ x: 0, y: 1, letter: extra },
			],
			[
				{ x: 0, y: -1, letter: letters[0] },
				{ x: 0, y: 0, letter: letters[1] },
				{ x: 0, y: 1, letter: letters[2] },
				{ x: -1, y: 0, letter: extra },
			],
			[
				{ x: -1, y: 0, letter: letters[0] },
				{ x: 0, y: 0, letter: letters[1] },
				{ x: 1, y: 0, letter: letters[2] },
				{ x: 0, y: -1, letter: extra },
			],
			[
				{ x: 0, y: -1, letter: letters[0] },
				{ x: 0, y: 0, letter: letters[1] },
				{ x: 0, y: 1, letter: letters[2] },
				{ x: 1, y: 0, letter: extra },
			],
		];
	}
}

class BoxFigureModel extends FigureModel {

	constructor(wordManager) {
		super();

		let letters = wordManager.take(2);
		let extra = Randomizer.nextLetter() + Randomizer.nextLetter();
		this.views = [
			[
				{ x: 0, y: 0, letter: letters[0] },
				{ x: 0, y: 1, letter: letters[1] },
				{ x: 1, y: 0, letter: extra[0] },
				{ x: 1, y: 1, letter: extra[1] },
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
			let letter = figure.points[i].letter;

			this.points.push({ x, y, letter });
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

	constructor(words) {
		this.wordManager = new WordManager(words);
	}

	create(index) {
		return new FIGURE_TYPES[index](this.wordManager);
	}

	createRandom() {
		let index = Randomizer.next(0, FIGURE_TYPES.length - 1);
		return this.create(index);
	}
}

class WordManager {

	constructor(words) {
		this.words = words;
		this.index = 0;
		this.used = 0;
	}

	get current() {
		return this.words[this.index];
	}

	take(length) {
		let letters;

		if (this.used + length < this.current.length) {
			letters = this.current.substr(this.used, length);
			this.used += length;
			return letters;
		}

		if (this.used + length === this.current.length) {
			letters = this.current.substr(this.used);
			this.next();
			return letters;
		}

		if (this.used + length > this.current.length) {
			letters = this.current.substr(this.used);
			let left = length - (this.current.length - this.used);
			this.next();
			letters += this.take(left);
			return letters;
		}
	}

	next() {
		this.index++;

		if (this.index >= this.words.length) {
			this.index = 0;
			this.used = 0;
		}
	}
}