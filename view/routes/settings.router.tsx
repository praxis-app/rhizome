import { RouteObject } from 'react-router-dom';
import EditRolePage from '../pages/settings/edit-role-page';
import InvitesPage from '../pages/settings/invites-page';
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
          path: ':roleId/edit',
          element: <EditRolePage />,
        },
      ],
    },
    {
      path: 'invites',
      children: [
        {
          index: true,
          element: <InvitesPage />,
        },
      ],
    },
  ],
};
