import { NextFunction, Request, Response } from 'express';

export const authIntegration = async (
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

  // TODO: Verify integration token here

  next();
};
