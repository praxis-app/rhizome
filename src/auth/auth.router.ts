import express from 'express';
import { createAnonSession, login, logOut, signUp, upgradeAnonSession } from './auth.controller';
import { authenticate } from './middleware/authenticate.middleware';
import { validateSignUp } from './middleware/validate-sign-up.middleware';

export const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.delete('/logout', logOut);
authRouter.post('/signup', validateSignUp, signUp);

authRouter.post('/anon', createAnonSession);
authRouter.put('/anon', authenticate, validateSignUp, upgradeAnonSession);
