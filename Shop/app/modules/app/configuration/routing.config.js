function removeHashPrefix($locationProvider) {
    $locationProvider.hashPrefix('');
}
removeHashPrefix.$inject = ['$locationProvider'];

function setRoutes($urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
}
setRoutes.$inject = ['$urlRouterProvider'];

function setEvents($transitions, $state, auth) {
    $transitions.onStart({}, onTransitionStart);
    $transitions.onSuccess({}, onTransitionSuccess);
    $transitions.onError({}, onTransitionError);


    function onTransitionStart(transition) {
        let toState = transition.$to();
        //toState.data && toState.data.showSpinner && spinner.show();
        handleUnauthenticatedUsers(transition);
    }

    function onTransitionSuccess(transition) {
        let toState = transition.$to();
        //toState.data && toState.data.showSpinner && spinner.hide();
    }

    function onTransitionError(transition) {
        let toState = transition.$to();
        //toState.data && toState.data.showSpinner && spinner.hide();
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
            $state.go('home', {}, { location: 'replace' });
            transition.abort();
        }
    }
}
setEvents.$inject = ['$transitions', '$state', 'authService'];

export default function (appModule) {
    appModule
        .config(removeHashPrefix)
        .config(setRoutes)
        .run(setEvents);
}