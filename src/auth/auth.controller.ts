import { Request, Response } from 'express';
import * as authService from './auth.service';

export const signUp = async (req: Request, res: Response) => {
  const token = await authService.signUp(req.body);
  res.json({ token });
};

export const createAnonSession = async (_req: Request, res: Response) => {
  const token = await authService.createAnonSession();
  res.json({ token });
};

export const upgradeAnonSession = async (req: Request, res: Response) => {
  const { user } = res.locals;
  await authService.upgradeAnonSession(req.body, user.id);
  res.sendStatus(204);
};

export const logOut = async (_req: Request, res: Response) => {
  res.setHeader('Clear-Site-Data', '"storage"');
  res.sendStatus(204);
};
