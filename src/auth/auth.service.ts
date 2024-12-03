import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { dataSource } from '../database/data-source';
import { User } from '../users/user.entity';

class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
    this.authenticateUser = this.authenticateUser.bind(this);
  }

  async register(res: Response) {
    if (res.locals.user) {
      return res.sendStatus(409);
    }
    const user = await this.userRepository.save({});
    const payload = { userId: user.id };

    return jwt.sign(payload, process.env.TOKEN_SECRET || '', {
      expiresIn: '30d',
    });
  }

  authenticateUser(req: Request, res: Response, next: NextFunction) {
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
  }
}

export const authService = new AuthService();
