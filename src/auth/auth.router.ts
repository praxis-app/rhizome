import express from 'express';
import {
  createAnonSession,
  login,
  logOut,
  signUp,
  upgradeAnonSession,
} from './auth.controller';
import { authenticate } from './middleware/authenticate.middleware';
import { loginRateLimiter } from './middleware/login-rate-limiter.middleware';
import { validateSignUp } from './middleware/validate-sign-up.middleware';

export const authRouter = express.Router();

authRouter.post('/signup', validateSignUp, signUp);
authRouter.post('/login', loginRateLimiter, login);
authRouter.delete('/logout', logOut);

authRouter.post('/anon', createAnonSession);
authRouter.put('/anon', authenticate, validateSignUp, upgradeAnonSession);
