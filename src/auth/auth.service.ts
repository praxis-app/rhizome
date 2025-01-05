import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
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

export const signUp = async ({ email, name, password }: SignUpReq) => {
  const passwordHash = await hash(password, SALT_ROUNDS);
  const user = await usersService.signUp(email, name, passwordHash);
  const payload = { userId: user.id };

  return jwt.sign(payload, process.env.TOKEN_SECRET || '', {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const upgradeAnonSession = async ({ email, password }: SignUpReq, userId: string) => {
  const passwordHash = await hash(password, SALT_ROUNDS);
  await usersService.upgradeAnonUser(userId, email, passwordHash);
};

export const createAnonSession = async () => {
  const user = await usersService.createAnonUser();
  const payload = { userId: user.id };

  return jwt.sign(payload, process.env.TOKEN_SECRET || '', {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const verifyToken = async (token: string) => {
  return new Promise<User | null>((resolve) => {
    const secret = process.env.TOKEN_SECRET as string;
    jwt.verify(token, secret, async (err, payload) => {
      if (err) {
        resolve(null);
        return;
      }
      const { userId } = payload as { userId: string };
      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: userId },
      });
      resolve(user);
    });
  });
};
