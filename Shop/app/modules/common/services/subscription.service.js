const Controller = {
    counter: 0
};

/**********************************************************************************************
 * Subscription Provider
 **********************************************************************************************/
export default class {

    static get $inject() {
        return [
            'serviceWorker',
        ];
    }

    constructor(
        serviceWorker
    ) {
        this.serviceWorker = serviceWorker;
    }

    /******************************************************************************************
     PUBLIC METHODS
     ******************************************************************************************
     show spinner
     ******************************************************************************************/
    subscribe() {
        const applicationServerKey = urlB64ToUint8Array('BC_CvaRNT3HMqsPKZpXwB6O4FiVnmb8Umt8yIfBf-glhU_XxPG3KJ7Cy1KA7XRNsEvyfYbKNB62iOOUTWK0muO8');

        this.serviceWorker
            .register('sw.js')
            .then(swReg => swReg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            }))
            .then((subscription) => {
                //updateSubscriptionOnServer(subscription);
                isSubscribed = true;
            })
            .catch(function (err) {
                console.log('Failed to subscribe the user: ', err);
            });
    }

    urlB64ToUint8Array(base64String) {
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

}