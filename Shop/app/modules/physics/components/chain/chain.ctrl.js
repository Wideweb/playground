import ChainScreen from '../../chain-screen';

export default class {
    static get $inject() {
        return [];
    }

    constructor() {}

    $onInit() {
        this.screen = new ChainScreen();
        this.screen.start();
    }

    $onDestroy() {
        this.screen.dispose();
    }
}