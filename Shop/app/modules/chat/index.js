import angular from 'angular';
import uiRouter from 'angular-ui-router';

import COMMON_MODULE from '../common';

import { channelsState, channelState } from './states';

import channelListComponent from './components/channel-list/channel-list.component';
import channelComponent from './components/channel/channel.component';

import chatService from './services/chat.service';

const ngModule = angular
    .module('chat', [
        uiRouter,

        COMMON_MODULE.name
    ])

    .component('channelList', channelListComponent)
    .component('channel', channelComponent)

    .service('chatService', chatService)

    .config(['$stateProvider', $stateProvider => {
        $stateProvider
            .state(channelsState.name, channelsState)
            .state(channelState.name, channelState);
    }]);

export default ngModule;