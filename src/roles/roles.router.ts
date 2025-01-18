import express from 'express';
import { createRole, getRoles } from './roles.controller';

export const rolesRouter = express.Router();

rolesRouter.get('/', getRoles);
rolesRouter.post('/', createRole);
