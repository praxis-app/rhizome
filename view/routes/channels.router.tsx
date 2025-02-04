import { RouteObject } from 'react-router-dom';
import { ChannelPage } from '../pages/chat/channel-page';

export const channelsRouter: RouteObject = {
  path: '/channels',
  children: [
    {
      path: ':channelId',
      element: <ChannelPage />,
    },
  ],
};
