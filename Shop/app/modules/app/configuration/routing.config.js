function removeHashPrefix($locationProvider) {
    $locationProvider.hashPrefix('');
}
removeHashPrefix.$inject = ['$locationProvider'];

function setRoutes($urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
}
setRoutes.$inject = ['$urlRouterProvider'];

function setEvents($transitions, $state, auth, spinner, controls, errorHandler) {
    $transitions.onStart({}, onTransitionStart);
    $transitions.onSuccess({}, onTransitionSuccess);
    $transitions.onError({}, onTransitionError);


    function onTransitionStart(transition) {
        let toState = transition.$to();
        toState.data && toState.data.showSpinner && spinner.show();
        handleUnauthenticatedUsers(transition);
    }

    function onTransitionSuccess(transition) {
        let toState = transition.$to();

        toState.data && toState.data.showSpinner && spinner.hide();

        if (toState.data && angular.isDefined(toState.data.isAddWordButtonVisible)) {
            controls.isAddWordButtonVisible = toState.data.isAddWordButtonVisible;
        } else {
            controls.isAddWordButtonVisible = true;
        }
    }

    function onTransitionError(transition) {
        let toState = transition.$to();
        toState.data && toState.data.showSpinner && spinner.hide();
        errorHandler.handle(transition.error().detail);
    }

    function handleUnauthenticatedUsers(transition) {
        let toState = transition.$to();

        if (auth.isLoggedIn() === false) {
            if (toState.data && toState.data.requireAuthorization === false) {
                return;
            } else {
                $state.go('login', { returnState: toState.name, params: transition.params('to') });
                transition.abort();
            }
        } else if (toState.name === 'login') {
            transition.abort();
            $state.go('home', {}, { location: 'replace' });
        }
    }
}
setEvents.$inject = ['$transitions', '$state', 'authService', 'spinnerService', 'controlsService', 'errorHandler'];

export default function (appModule) {
    appModule
        .config(removeHashPrefix)
        .config(setRoutes)
        .run(setEvents);
}