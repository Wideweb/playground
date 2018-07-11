export const appState = {
    name: 'app',
    url: '',
    abstract: true,
    template: '<layout></layout>'
}

export const homeState = {
    parent: 'app',
    name: 'home',
    url: '/home',
    template: '<home></home>'
}