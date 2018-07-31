export default class {
    static get $inject() {
        return [];
    }

    constructor() {
        this.arms = [];
        this.last = null;

        let parent = null;
        for (let i = 0; i < 30; i++) {
            let arm = new Arm(0, 0, 10);
            arm.parent = this.last;
            this.arms.push(arm);
            this.last = arm;
        }

        this.last.last = true;

        for (let arm of this.arms) {
            arm.update(0);
        }

        document.getElementById('physics-chain').addEventListener('mousemove', (event) => {
            let position = this.getScreenPosition(event);
            this.last.drag(position.x, position.y);
            this.arms.forEach(arm => arm.update())
        });
    }

    getScreenPosition(e) {
        let canvas = document.getElementById('physics-chain');

        let x;
        let y;

        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }
        else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        var canvarOffset = $(canvas).offset();

        x -= canvarOffset.left;
        y -= canvarOffset.top;

        return { x, y };
    }

    $onInit() {

        let canvas = document.getElementById('physics-chain');
        let context = canvas.getContext('2d');

        this.stop = false;
        let lastTime = performance.now();

        let update = () => {
            if (this.stop) {
                return;
            }

            setTimeout(update, 30);

            let currentTime = performance.now();
            let elapsed = currentTime - lastTime;

            this.update(elapsed);

            context.clearRect(0, 0, 1000, 1000);
            this.draw(context);

            lastTime = currentTime;
        };

        update();
    }

    update(elapsed) {
        for (let i = this.arms.length - 1; i >= 0; i--) {
            let arm = this.arms[i];
            arm.pointAt(arm.endX, arm.endY + 1);
            //arm.drag(arm.x, arm.y - 1);
        }
        for (let arm of this.arms) {
            arm.update(elapsed);
        }
    }

    draw(context) {
        for (let arm of this.arms) {
            arm.draw(context);
        }
    }

    $onDestroy() {
        this.stop = true
    }
}

class Arm {

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
        if (this.parent) {
            this.x = this.parent.endX;
            this.y = this.parent.endY;
        } else {
            this.x = this.initX;
            this.y = this.initY;
        }

        if (this.last) {
            this.y = 0;
            this.x = 100;
        }
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