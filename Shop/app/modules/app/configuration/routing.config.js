function removeHashPrefix($locationProvider) {
    $locationProvider.hashPrefix('');
}
removeHashPrefix.$inject = ['$locationProvider'];

function setRoutes($urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
}
setRoutes.$inject = ['$urlRouterProvider'];

function setEvents($transitions, $state, auth, spinner) {
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
    }

    function onTransitionError(transition) {
        let toState = transition.$to();
        toState.data && toState.data.showSpinner && spinner.hide();
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
setEvents.$inject = ['$transitions', '$state', 'authService', 'spinnerService'];

export default function (appModule) {
    appModule
        .config(removeHashPrefix)
        .config(setRoutes)
        .run(setEvents);
}