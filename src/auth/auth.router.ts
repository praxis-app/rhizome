import express from 'express';
import { createAnonSession, logOut, signUp, upgradeAnonSession } from './auth.controller';
import * as authService from './auth.service';
import { authenticate } from './middleware/authenticate.middleware';

export const authRouter = express.Router();

authRouter.post('/anon', createAnonSession);
authRouter.put('/anon', authenticate, authService.validateSignUp, upgradeAnonSession);
authRouter.post('/', authService.validateSignUp, signUp);
authRouter.post('/logout', logOut);
