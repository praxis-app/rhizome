import express from 'express';
import {
  addRoleMembers,
  createRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
  updateRolePermissions,
} from './roles.controller';

export const rolesRouter = express.Router();

rolesRouter.get('/:roleId', getRole);
rolesRouter.get('/', getRoles);
rolesRouter.post('/', createRole);
rolesRouter.put('/:roleId', updateRole);
rolesRouter.delete('/:roleId', deleteRole);

rolesRouter.put('/:roleId/permissions', updateRolePermissions);
rolesRouter.post('/:roleId/members', addRoleMembers);
