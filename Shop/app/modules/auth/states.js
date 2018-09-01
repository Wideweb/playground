export const loginState = {
    name: 'login',
    url: '/login',
    template: '<login></login>',
    data: {
        requireAuthorization: false
    }
}

export const registerState = {
    name: 'register',
    url: '/register',
    template: '<register></register>',
    data: {
        requireAuthorization: false
    }
}

export const profileState = {
	parent: 'app',
    name: 'profile',
    url: '/profile',
    template: '<profile></profile>',
    data: {
        requireAuthorization: true
    }
}