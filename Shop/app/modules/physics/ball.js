export default class {

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.speedX = 0;
        this.speedY = 0;
    }

    get speed() {
        return this.speedX * this.speedX + this.speedY * this.speedY;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw(context) {
        context.save();

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.stroke();

        context.restore();
    }
}