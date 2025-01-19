import { Request, Response } from 'express';
import * as rolesService from './roles.service';

export const getRole = async (req: Request, res: Response) => {
  const role = await rolesService.getRole(req.params.id);
  res.json({ role });
};

export const getRoles = async (_req: Request, res: Response) => {
  const roles = await rolesService.getRoles();
  res.json({ roles });
};

export const createRole = async (req: Request, res: Response) => {
  const role = await rolesService.createRole(req.body);
  res.json({ role });
};

export const updateRole = async (req: Request, res: Response) => {
  const result = await rolesService.updateRole(req.params.id, req.body);
  res.json(result);
};

export const deleteRole = async (req: Request, res: Response) => {
  const result = await rolesService.deleteRole(req.params.id);
  res.json(result);
};
