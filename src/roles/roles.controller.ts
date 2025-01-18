import { Request, Response } from 'express';
import * as rolesService from './roles.service';

export const getRoles = async (_req: Request, res: Response) => {
  const roles = await rolesService.getRoles();
  res.json({ roles });
};

export const createRole = async (req: Request, res: Response) => {
  const payload = await rolesService.createRole(req.body);
  res.json(payload);
};
