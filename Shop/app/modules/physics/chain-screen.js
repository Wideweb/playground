import Screen from './screen';
import Arm from './arm';
import Ball from './ball';

export default class extends Screen {

    constructor(id = 'physics-chain') {
        super(id);

        this.arms = [];
        this.last = null;

        let parent = null;
        for (let i = 0; i < 50; i++) {
            let arm = new Arm(500, 0, 10);
            arm.parent = this.last;
            this.arms.push(arm);
            this.last = arm;
        }

        document.getElementById(this.id).addEventListener('mousemove', (event) => {
            //let position = this.getScreenPosition(event);
            //this.last.drag(position.x, position.y);
            //this.arms.forEach(arm => arm.update())
        });

        this.ball = new Ball(100, 100, 10);
    }

    update(elapsed) {
        this.ball.update();
        this.last.drag(this.ball.x, this.ball.y)
        for (let arm of this.arms) {
            arm.update(elapsed);
        }

        let arm = this.arms[0];
        let g = 0.1;

        let dx = arm.x - this.ball.x;
        let dy = arm.y - this.ball.y;
        let distance = dx * dx + dy * dy; 
        let length = this.arms.length * 10;

        if (length * length < distance) {
            let ac = this.ball.speed / length;
            let ax = ac * Math.cos(this.last.angle + Math.PI);
            let ay = ac * Math.sin(this.last.angle + Math.PI);
            //console.log(ay);
            //ay = 0;
            this.ball.speedX += ax;
            this.ball.speedY += ay;
        } else {
            this.ball.speedY += g;
        }
    }

    draw(context) {
        this.ball.draw(context);
        for (let arm of this.arms) {
            arm.draw(context);
        }
    }
}