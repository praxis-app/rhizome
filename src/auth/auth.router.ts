import express from 'express';
import { createAnonSession, logOut, signUp, upgradeAnonSession } from './auth.controller';
import { authenticate } from './middleware/authenticate.middleware';
import { validateSignUp } from './middleware/validate-sign-up.middleware';

export const authRouter = express.Router();

authRouter.post('/anon', createAnonSession);
authRouter.put('/anon', authenticate, validateSignUp, upgradeAnonSession);
authRouter.post('/', validateSignUp, signUp);
authRouter.post('/logout', logOut);
