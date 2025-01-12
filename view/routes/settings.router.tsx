import { RouteObject } from 'react-router-dom';
import RolesPage from '../pages/settings/roles-page';
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
      element: <RolesPage />,
    },
  ],
};
