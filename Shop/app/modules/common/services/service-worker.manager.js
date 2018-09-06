/**********************************************************************************************
 * Service Workder Provider
 **********************************************************************************************/
export default class {

    static get $inject() {
        return [
            '$q',
        ];
    }

    constructor(
        $q
    ) {
        this.$q = $q;
    }

    /******************************************************************************************
     PUBLIC METHODS
     ******************************************************************************************
     register service worker
     ******************************************************************************************/
    register(path) {
        const deferred = this.$q.defer();

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register(path)
                .then(swReg => deferred.resolve(swReg))
                .catch((error) => {
                    console.error('Service Worker Error', error);
                    deferred.reject();
                });
        } else {
            console.warn('Push messaging is not supported');
            return deferred.reject();
        }

        return deferred;
    }

}