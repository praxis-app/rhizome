import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import { can } from './middleware/can.middleware';
import { roleMembersRouter } from './role-members.router';
import { rolePermissionsRouter } from './role-permissions.router';
import {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
} from './roles.controller';

export const rolesRouter = express.Router();

rolesRouter.use(authenticate);

rolesRouter.get('/:roleId', can('read', 'Role'), getRole);
rolesRouter.get('/', can('read', 'Role'), getRoles);
rolesRouter.post('/', can('create', 'Role'), createRole);
rolesRouter.put('/:roleId', can('update', 'Role'), updateRole);
rolesRouter.delete('/:roleId', can('delete', 'Role'), deleteRole);

rolesRouter.use('/:roleId/permissions', rolePermissionsRouter);
rolesRouter.use('/:roleId/members', roleMembersRouter);
