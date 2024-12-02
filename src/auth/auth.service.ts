import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { dataSource } from '../database/data-source';

class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  async register() {
    const user = await this.userRepository.save({});
    const payload = { userId: user.id };

    return jwt.sign(payload, process.env.TOKEN_SECRET || '', {
      expiresIn: '30d',
    });
  }

  // TODO: Implement addTokenToLocals once more routes are added
  async addTokenToLocals(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const [type, token] = authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      throw new Error('Invalid token type');
    }

    res.locals.token = token;
    next();
  }
}

export const authService = new AuthService();
