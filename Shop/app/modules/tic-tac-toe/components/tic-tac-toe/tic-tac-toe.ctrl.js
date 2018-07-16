export default class {
    static get $inject() {
        return [
            '$timeout',
            'trainingService'
        ];
    }

    constructor(
        $timeout,
        /*Service*/ training
    ) {
        this.$timeout = $timeout;
        this.training = training;

        this.wait = false;
    }

    hint() {
        this.submit(null);
    }

    submit(option) {
        if (this.wait) {
            return;
        }

        this.wait = true;
        this.training.submit(option);
        this.$timeout(() => {
            this.training.next();
            this.wait = false;
        }, 1000);
    }
}