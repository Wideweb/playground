export const channelsState = {
    parent: 'app',
    name: 'channels',
    url: '/channels',
    template: '<channel-list></channel-list>'
}

export const channelState = {
    name: 'channels.channel',
    url: '/channel',
    template: '<channel></channel>',
    data: {
        isAddWordButtonVisible: false
    }
}