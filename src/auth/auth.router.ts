import express from 'express';
import { createAnonSession, login, logOut, signUp, upgradeAnonSession } from './auth.controller';
import { authenticate } from './middleware/authenticate.middleware';
import { validateSignUp } from './middleware/validate-sign-up.middleware';
import { validateLogin } from './middleware/validate-login.middleware';

export const authRouter = express.Router();

authRouter.post('/anon', createAnonSession);
authRouter.put('/anon', authenticate, validateSignUp, upgradeAnonSession);
authRouter.post('/signup', validateSignUp, signUp);
authRouter.post('/login', validateLogin, login);
authRouter.delete('/logout', logOut);
