import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { normalizeText } from '../common/common.utils';
import { dataSource } from '../database/data-source';
import { User } from '../users/user.entity';
import * as usersService from '../users/users.service';

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 90;
const SALT_ROUNDS = 10;

export interface SignUpReq {
  email: string;
  name?: string;
  password: string;
}

export interface LoginReq {
  email: string;
  password: string;
}

const userRepository = dataSource.getRepository(User);

export const login = async ({ email, password }: LoginReq) => {
  if (!email) {
    throw new Error('Email is required');
  }
  if (!password) {
    throw new Error('Password is required');
  }

  const normalizedEmail = normalizeText(email);
  const user = await userRepository.findOne({
    where: { email: normalizedEmail },
  });
  if (!user || user.locked) {
    throw new Error('Incorrect username or password');
  }

  const passwordMatch = await compare(password, user.password!);
  if (!passwordMatch) {
    throw new Error('Incorrect username or password');
  }

  return generateAccessToken(user.id);
};

export const signUp = async ({ email, name, password }: SignUpReq) => {
  const passwordHash = await hash(password, SALT_ROUNDS);
  const user = await usersService.signUp(email, name, passwordHash);
  return generateAccessToken(user.id);
};

export const upgradeAnonSession = async ({ email, password }: SignUpReq, userId: string) => {
  const passwordHash = await hash(password, SALT_ROUNDS);
  await usersService.upgradeAnonUser(userId, email, passwordHash);
};

export const createAnonSession = async () => {
  const user = await usersService.createAnonUser();
  return generateAccessToken(user.id);
};

export const verifyToken = async (token: string) => {
  return new Promise<User | null>((resolve) => {
    const secret = process.env.TOKEN_SECRET as string;
    jwt.verify(token, secret, async (err, payload) => {
      if (err) {
        resolve(null);
        return;
      }
      const { sub } = payload as { sub: string };
      const user = await userRepository.findOne({
        where: { id: sub },
      });
      resolve(user);
    });
  });
};

export const generateAccessToken = (userId: string) => {
  const payload = { sub: userId };
  return jwt.sign(payload, process.env.TOKEN_SECRET || '', {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};
