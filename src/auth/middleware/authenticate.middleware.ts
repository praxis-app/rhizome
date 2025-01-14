import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../auth.service';
import { getUserPermisions } from '../../roles/roles.service';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  const [type, token] = authorization?.split(' ') ?? [];
  if (type !== 'Bearer' || !token) {
    res.status(401).send('Unauthorized');
    return;
  }
  const user = await verifyToken(token);
  if (!user) {
    res.status(401).send('Unauthorized');
    return;
  }
  const permissions = await getUserPermisions(user.id);
  res.locals.user = { ...user, permissions };
  next();
};
