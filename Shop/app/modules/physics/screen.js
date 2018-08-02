export default class {

    constructor(id) {
        this.id = id;
        this.canvas = document.getElementById(this.id);
        this.context = this.canvas.getContext('2d');
    }

    start() {
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

            this.context.clearRect(0, 0, 1000, 1000);
            this.draw(this.context);

            lastTime = currentTime;
        };

        update();
    }

    getScreenPosition(e) {
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

        var canvarOffset = $(this.canvas).offset();

        x -= canvarOffset.left;
        y -= canvarOffset.top;

        return { x, y };
    }

    update(elapsed) { }

    draw(context) { }

    dispose() {
        this.stop = true;
    }
}