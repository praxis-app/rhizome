import { NextFunction, Request, Response } from 'express';
import { getServerConfig } from '../server-configs/server-configs.service';

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

  const serverConfig = await getServerConfig();
  if (token !== serverConfig.botApiKey) {
    res.status(401).send('Unauthorized');
    return;
  }

  // TODO: Determine how to set res.locals.user for integration

  next();
};
