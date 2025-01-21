import express from 'express';
import { can } from './middleware/can.middleware';
import * as rolesController from './roles.controller';

export const roleMembersRouter = express.Router();

roleMembersRouter.post(
  '/',
  can(['update'], 'Role'),
  rolesController.addRoleMembers,
);

roleMembersRouter.delete(
  '/:userId',
  can(['update'], 'Role'),
  rolesController.removeRoleMember,
);

roleMembersRouter.get(
  '/eligible',
  can(['read'], 'Role'),
  rolesController.getUsersEligibleForRole,
);
