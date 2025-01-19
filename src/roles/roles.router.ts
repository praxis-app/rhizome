import express from 'express';
import {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
} from './roles.controller';

export const rolesRouter = express.Router();

rolesRouter.get('/:id', getRole);
rolesRouter.get('/', getRoles);
rolesRouter.post('/', createRole);
rolesRouter.put('/:id', updateRole);
rolesRouter.delete('/:id', deleteRole);
