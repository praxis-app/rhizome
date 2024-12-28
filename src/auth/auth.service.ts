import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';
import { dataSource } from '../database/data-source';
import { User } from '../users/user.entity';
import { usersService } from '../users/users.service';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  SALT_ROUNDS,
  VALID_EMAIL_REGEX,
  VALID_NAME_REGEX,
} from './auth.constants';
import { normalizeText } from '../common/common.utils';
import { hash } from 'bcrypt';

interface UpgradeReq {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  upgrade = async (userId: string, { name, email, password }: UpgradeReq) => {
    const passwordHash = await hash(password, SALT_ROUNDS);
    await usersService.upgradeUser(userId, name, email, passwordHash);
  };

  validateUpgrade = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!VALID_EMAIL_REGEX.test(email)) {
      res.status(400).send('Invalid email address');
      return;
    }
    if (email.length > 254) {
      res.status(400).send('Email address cannot exceed 254 characters');
      return;
    }
    if (!VALID_NAME_REGEX.test(name)) {
      res.status(400).send('User names cannot contain special characters');
      return;
    }
    if (name.length < 2) {
      res.status(400).send('Username must be at least 2 characters');
      return;
    }
    if (name.length > 15) {
      res.status(400).send('Username cannot exceed 15 characters');
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).send('Passwords do not match');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      res.status(400).send(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return;
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      res.status(400).send(`Password must be at most ${MAX_PASSWORD_LENGTH} characters long`);
      return;
    }

    const usersWithEmailCount = await this.userRepository.count({
      where: { email: normalizeText(email) },
    });
    if (usersWithEmailCount > 0) {
      res.status(409).send('Email address is already in use');
      return;
    }

    const usersWithNameCount = await this.userRepository.count({
      where: { name },
    });
    if (usersWithNameCount > 0) {
      res.status(409).send('Username is already in use');
      return;
    }

    next();
  };

  registerAnon = async (clientId: string) => {
    const user = await usersService.createAnonUser(clientId);
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

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
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
