import { validate as uuidValidate } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { dataSource } from '../database/data-source';
import { User } from '../users/user.entity';

class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  register = async (clientId: string) => {
    const user = await this.userRepository.save({ clientId });
    const payload = { userId: user.id };

    return jwt.sign(payload, process.env.TOKEN_SECRET || '', {
      expiresIn: '30d',
    });
  };

  authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const [type, token] = authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      return next();
    }

    jwt.verify(
      token,
      process.env.TOKEN_SECRET as string,
      async (err, payload) => {
        if (err) {
          return;
        }

        const { userId } = payload as { userId: number };
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        res.locals.user = user;
      },
    );
    next();
  };

  validateRegister = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { clientId } = req.body;
    if (!clientId || !uuidValidate(clientId)) {
      res.status(400).send('Invalid client ID');
      return;
    }
    const userExists = await this.userRepository.exist({ where: { clientId } });
    if (userExists || res.locals.user) {
      res.status(409).send('User already exists');
      return;
    }
    next();
  };
}

export const authService = new AuthService();
