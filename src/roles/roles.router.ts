import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import { can } from './middleware/can.middleware';
import {
  addRoleMembers,
  createRole,
  deleteRole,
  deleteRoleMember,
  getRole,
  getRoles,
  getUsersEligibleForRole,
  updateRole,
  updateRolePermissions,
} from './roles.controller';

export const rolesRouter = express.Router();

rolesRouter.use(authenticate);

rolesRouter.get('/:roleId', can(['read'], 'Role'), getRole);
rolesRouter.get('/', can(['read'], 'Role'), getRoles);
rolesRouter.post('/', can(['create'], 'Role'), createRole);
rolesRouter.put('/:roleId', can(['update'], 'Role'), updateRole);
rolesRouter.delete('/:roleId', can(['delete'], 'Role'), deleteRole);

rolesRouter.post('/:roleId/members', can(['create'], 'Role'), addRoleMembers);
rolesRouter.delete(
  '/:roleId/members/:userId',
  can(['read'], 'Role'),
  deleteRoleMember,
);
rolesRouter.get(
  '/:roleId/members/eligible',
  can(['read'], 'Role'),
  getUsersEligibleForRole,
);
rolesRouter.put(
  '/:roleId/permissions',
  can(['read'], 'Role'),
  updateRolePermissions,
);
