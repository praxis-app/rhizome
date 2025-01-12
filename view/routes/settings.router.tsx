import { RouteObject } from 'react-router-dom';
import ServerSettings from '../pages/settings/server-settings';

export const settingsRouter: RouteObject = {
  path: '/settings',
  children: [
    {
      index: true,
      element: <ServerSettings />,
    },
  ],
};
