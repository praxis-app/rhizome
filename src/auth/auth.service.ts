import { hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { normalizeText } from '../common/common.utils';
import { dataSource } from '../database/data-source';
import { User } from '../users/user.entity';
import { usersService } from '../users/users.service';

const VALID_EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const VALID_NAME_REGEX = /^[A-Za-z0-9 ]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 90;
const SALT_ROUNDS = 10;

interface SignUpReq {
  email: string;
  name?: string;
  password: string;
}

class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  signUp = async ({ email, name, password }: SignUpReq) => {
    const passwordHash = await hash(password, SALT_ROUNDS);
    const user = await usersService.signUp(email, name, passwordHash);
    const payload = { userId: user.id };

    return jwt.sign(payload, process.env.TOKEN_SECRET || '', {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  };

  upgradeAnonSession = async ({ email, password }: SignUpReq, userId: string) => {
    const passwordHash = await hash(password, SALT_ROUNDS);
    await usersService.upgradeAnonUser(email, passwordHash, userId);
  };

  validateSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body as SignUpReq;

    if (!VALID_EMAIL_REGEX.test(email)) {
      res.status(400).send('Invalid email address');
      return;
    }
    if (email.length > 254) {
      res.status(400).send('Email address cannot exceed 254 characters');
      return;
    }
    if (name && !VALID_NAME_REGEX.test(name)) {
      res.status(400).send('User names cannot contain special characters');
      return;
    }
    if (name && name.length < 2) {
      res.status(400).send('Username must be at least 2 characters');
      return;
    }
    if (name && name.length > 15) {
      res.status(400).send('Username cannot exceed 15 characters');
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

    next();
  };

  createAnonSession = async () => {
    const user = await usersService.createAnonUser();
    const payload = { userId: user.id };

    return jwt.sign(payload, process.env.TOKEN_SECRET || '', {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
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
