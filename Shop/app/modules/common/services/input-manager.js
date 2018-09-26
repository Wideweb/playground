const INPUT_EVENTS = {
    SWIPED_LEFT: 'SWIPED_LEFT',
    SWIPED_RIGHT: 'SWIPED_RIGHT',
    SWIPED_UP: 'SWIPED_UP',
    SWIPED_DOWN: 'SWIPED_DOWN',
    CLICK: 'CLICK',
};

export default class {

    constructor() {
        this._observers = [];

        this.initialX = null;
        this.initialY = null;

        document.addEventListener("click", this.clickProxy.bind(this), false);
        document.addEventListener("keydown", this.keydownProxy.bind(this), false);
        document.addEventListener("touchstart", this.touchstartProxy.bind(this), false);
        document.addEventListener("touchmove", this.touchmoveProxy.bind(this), false);
    }

    clickProxy(e) {
        this.notify(INPUT_EVENTS.CLICK);
    }

    keydownProxy(e) {
        switch (e.keyCode) {
            case 37:
            this.notify(INPUT_EVENTS.SWIPED_LEFT);
                break;
            case 39:
            this.notify(INPUT_EVENTS.SWIPED_RIGHT);
                break;
            case 40:
                this.notify(INPUT_EVENTS.SWIPED_DOWN);
                break;
            case 32:
                this.notify(INPUT_EVENTS.CLICK);
                break;
        }
    }

    touchstartProxy(e) {
        this.initialX = e.touches[0].clientX;
        this.initialY = e.touches[0].clientY;
    }

    touchmoveProxy(e) {
        if (this.initialX === null) {
            return;
        }

        if (this.initialY === null) {
            return;
        }

        var currentX = e.touches[0].clientX;
        var currentY = e.touches[0].clientY;

        var diffX = this.initialX - currentX;
        var diffY = this.initialY - currentY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                this.notify(INPUT_EVENTS.SWIPED_LEFT);
            } else {
                this.notify(INPUT_EVENTS.SWIPED_RIGHT);
            }
        } else {
            if (diffY > 0) {
                this.notify(INPUT_EVENTS.SWIPED_UP);
            } else {
                this.notify(INPUT_EVENTS.SWIPED_DOWN);
            }
        }

        this.initialX = null;
        this.initialY = null;
    }

    onMoveLeft(callback) {
        this._observers.push({ event: INPUT_EVENTS.SWIPED_LEFT, callback: callback });
    }

    onMoveRight(callback) {
        this._observers.push({ event: INPUT_EVENTS.SWIPED_RIGHT, callback: callback });
    }

    onMoveUp(callback) {
        this._observers.push({ event: INPUT_EVENTS.SWIPED_UP, callback: callback });
    }

    onMoveDown(callback) {
        this._observers.push({ event: INPUT_EVENTS.SWIPED_DOWN, callback: callback });
    }

    onClick(callback) {
        this._observers.push({ event: INPUT_EVENTS.CLICK, callback: callback });
    }

    notify(event, args) {
        for (let observer of this._observers) {
            if (observer.event == event) {
                observer.callback(args);
            }
        }
    }
}