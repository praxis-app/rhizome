import { compare } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { normalizeText } from '../../common/common.utils';
import { dataSource } from '../../database/data-source';
import { User } from '../../users/user.entity';
import { LoginReq } from '../auth.service';

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as LoginReq;
  const userRepository = dataSource.getRepository(User);

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
  if (!user) {
    throw new Error('Incorrect username or password');
  }

  const passwordMatch = await compare(password, user.password!);
  if (!passwordMatch) {
    throw new Error('Incorrect username or password');
  }

  res.locals.user = user;
  next();
};
