export default class {

    constructor(x, y, length) {
        this.initX = x;
        this.initY = y;
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = 0;
        this.parent;
    }

    get endX() {
        return this.x + Math.cos(this.angle) * this.length;
    }

    get endY() {
        return this.y + Math.sin(this.angle) * this.length;
    }

    pointAt(x, y) {
        let dx = x - this.x;
        let dy = y - this.y;
        this.angle = Math.atan2(dy, dx);
    }

    drag(x, y) {
        this.pointAt(x, y);

        this.x = x - Math.cos(this.angle) * this.length;
        this.y = y - Math.sin(this.angle) * this.length;

        this.parent && this.parent.drag(this.x, this.y);
    }

    update() {
        let targetX, targetY;

        if (this.parent) {
            targetX = this.parent.endX;
            targetY = this.parent.endY;
        } else {
            targetX = this.initX;
            targetY = this.initY;
        }

        this.x = targetX;
        this.y = targetY;
    }

    draw(context) {
        context.save();

        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.endX, this.endY);
        context.stroke();

        context.restore();
    }
}