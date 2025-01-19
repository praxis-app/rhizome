import express from 'express';
import { createRole, getRole, getRoles } from './roles.controller';

export const rolesRouter = express.Router();

rolesRouter.get('/:id', getRole);
rolesRouter.get('/', getRoles);
rolesRouter.post('/', createRole);
