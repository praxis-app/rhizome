import { NextFunction, Request, Response } from 'express';
import { getAuthedUser, verifyToken } from '../auth.service';

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
  const userId = verifyToken(token);
  if (!userId) {
    res.status(401).send('Unauthorized');
    return;
  }
  const user = await getAuthedUser(userId);
  res.locals.user = user;
  next();
};
