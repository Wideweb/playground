const SERVICE_WORKER_PATH = 'service-wrokers/notifications.js';
const APP_KEY = 'BGCUkcP1P9NnIyYH4aI1BE8N8VfG-mdzBSJDaMeKxLODMUYCrknrUP7UQ7uEAVUtxk0lqp7gT0AO5yxykzdg5Tw';

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
	isSubscribed: false,
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
	}

	subscribe() {
		if (!('serviceWorker' in navigator && 'PushManager' in window)) {
			console.warn('Push messaging is not supported');
			return this.$q.reject();
		}

		const settings = {
			userVisibleOnly: true,
			applicationServerKey: urlB64ToUint8Array(APP_KEY)
		}

		return navigator.serviceWorker
			.register(SERVICE_WORKER_PATH)
			.then((reg) => reg.pushManager.subscribe(settings))
			.then((subscription) => {
				Controller.isSubscribed = true;
				console.log('Service Worker Registered');
			})
			.catch((error) => console.error('Service Worker Error', error));
	}

	updateSubscription(subscription) {
		/* server call */
	}

}