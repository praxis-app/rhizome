import { NextFunction, Request, Response } from 'express';
import { getAuthedUser } from '../auth/auth.service';
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

  const userId = req.headers['x-user-id'];
  if (typeof userId === 'string') {
    const user = await getAuthedUser(userId);

    // If user ID is provided, but user is not found, return 401
    if (!user) {
      res.status(401).send('Unauthorized');
      return;
    }
    res.locals.user = user;
  }

  next();
};
