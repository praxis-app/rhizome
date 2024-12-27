import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';
import { dataSource } from '../database/data-source';
import { User } from '../users/user.entity';
import { usersService } from '../users/users.service';

class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  registerAnon = async (clientId: string) => {
    const user = await usersService.createUser(clientId);
    const payload = { userId: user.id };

    return jwt.sign(payload, process.env.TOKEN_SECRET || '', {
      expiresIn: '30d',
    });
  };

  validateRegisterAnon = async (req: Request, res: Response, next: NextFunction) => {
    const { clientId } = req.body;
    if (!clientId || !uuidValidate(clientId)) {
      res.status(400).send('Invalid client ID');
      return;
    }
    const userExists = await this.userRepository.exist({ where: { clientId } });
    if (userExists) {
      res.status(409).send('User already exists');
      return;
    }
    next();
  };

  authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const [type, token] = authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      res.status(401).send('Unauthorized');
      return;
    }
    const user = await this.verifyToken(token);
    if (!user) {
      res.status(401).send('Unauthorized');
      return;
    }
    res.locals.user = user;
    next();
  };

  verifyToken = async (token: string) => {
    return new Promise<User | null>((resolve) => {
      const secret = process.env.TOKEN_SECRET as string;
      jwt.verify(token, secret, async (err, payload) => {
        if (err) {
          resolve(null);
          return;
        }
        const { userId } = payload as { userId: string };
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        resolve(user);
      });
    });
  };
}

export const authService = new AuthService();
