import express from 'express';
import {
  addRoleMembers,
  createRole,
  deleteRole,
  deleteRoleMember,
  getUsersEligibleForRole,
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

rolesRouter.post('/:roleId/members', addRoleMembers);
rolesRouter.delete('/:roleId/members/:userId', deleteRoleMember);
rolesRouter.get('/:roleId/members/eligible', getUsersEligibleForRole);
rolesRouter.put('/:roleId/permissions', updateRolePermissions);
