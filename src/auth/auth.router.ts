import express from 'express';
import { createAnonSession, login, logOut, signUp, upgradeAnonSession } from './auth.controller';
import { authenticate } from './middleware/authenticate.middleware';
import { validateSignUp } from './middleware/validate-sign-up.middleware';
import { rateLimit } from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 60 * 1000 * 10,
  limit: 5,
});

export const authRouter = express.Router();

authRouter.post('/signup', validateSignUp, signUp);
authRouter.post('/login', rateLimiter, login);
authRouter.delete('/logout', logOut);

authRouter.post('/anon', createAnonSession);
authRouter.put('/anon', authenticate, validateSignUp, upgradeAnonSession);
