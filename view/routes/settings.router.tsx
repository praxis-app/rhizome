import { RouteObject } from 'react-router-dom';
import ServerRoles from '../pages/settings/server-roles';
import ServerSettings from '../pages/settings/server-settings';

export const settingsRouter: RouteObject = {
  path: '/settings',
  children: [
    {
      index: true,
      element: <ServerSettings />,
    },
    {
      path: 'roles',
      element: <ServerRoles />,
    },
  ],
};
