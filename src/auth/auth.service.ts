import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import {
  colors,
  NumberDictionary,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { validate as uuidValidate } from 'uuid';
import { dataSource } from '../database/data-source';
import { NATURE_DICTIONARY, SPACE_DICTIONARY } from '../users/user.constants';
import { User } from '../users/user.entity';

class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  register = async (clientId: string) => {
    const numberDictionary = NumberDictionary.generate({
      min: 10,
      max: 99,
    });
    const nounDictionary =
      Math.random() >= 0.5 ? SPACE_DICTIONARY : NATURE_DICTIONARY;
    const name = uniqueNamesGenerator({
      dictionaries: [colors, nounDictionary, numberDictionary],
      separator: '-',
    });
    const user = await this.userRepository.save({
      clientId,
      name,
    });
    const payload = { userId: user.id };
    return jwt.sign(payload, process.env.TOKEN_SECRET || '', {
      expiresIn: '30d',
    });
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
    if (userExists) {
      res.status(409).send('User already exists');
      return;
    }
    next();
  };

  authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const [type, token] = authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      res.status(401).send('Unauthorized');
      return;
    }

    jwt.verify(
      token,
      process.env.TOKEN_SECRET as string,
      async (err, payload) => {
        if (err) {
          res.status(401).send('Unauthorized');
          return;
        }

        const { userId } = payload as { userId: number };
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        res.locals.user = user;
        next();
      },
    );
  };
}

export const authService = new AuthService();
