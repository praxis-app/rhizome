import { RouteObject } from 'react-router-dom';
import EditRole from '../pages/settings/edit-role';
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
      children: [
        {
          index: true,
          element: <ServerRoles />,
        },
        {
          path: ':id/edit',
          element: <EditRole />,
        },
      ],
    },
  ],
};
