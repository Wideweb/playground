const SERVICE_WORKER_PATH = 'service-wrokers/notification.js';
const APP_KEY = 'BC_CvaRNT3HMqsPKZpXwB6O4FiVnmb8Umt8yIfBf-glhU_XxPG3KJ7Cy1KA7XRNsEvyfYbKNB62iOOUTWK0muO8';

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const Controller = {
    serviceWorkerReg: null,
    isSubscribed: false,
    applicationServerKey: null
};

/**********************************************************************************************
 * Subscription Provider
 **********************************************************************************************/
export default class {

    static get $inject() {
        return [
            '$q'
        ];
    }

    constructor(
        $q
    ) {
        this.$q = $q;
        Controller.applicationServerKey = urlB64ToUint8Array(APP_KEY);
    }

    init() {
        this.registerServiceWorkder()
            .then(() => this.subscribe())
    }

    subscribe() {
        let swReg = Controller.serviceWorkerReg;

        if (!swReg) {
            return this.$q.reject();
        }

        return swReg.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey: Controller.applicationServerKey
            }).
            then((subscription) => {
                updateSubscriptionOnServer(subscription);
                Controller.isSubscribed = true;
            })
            .catch((err) => {
                console.log('Failed to subscribe the user: ', err);
            });;
    }

    registerServiceWorkder() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            return navigator.serviceWorker
                .register(SERVICE_WORKER_PATH)
                .catch((error) => console.error('Service Worker Error', error));
        }

        console.warn('Push messaging is not supported');
        return Promise.reject();
    }

    updateSubscription(subscription) {
        /* server call */
    }

}