import { Request, Response } from 'express';

export const getCurrentUser = async (_req: Request, res: Response) => {
  const { id, name, status } = res.locals.user;
  res.json({ user: { id, name, status } });
};
