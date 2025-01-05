import express from 'express';
import { createAnonSession, logOut, signUp, upgradeAnonSession } from './auth.controller';
import * as authService from './auth.service';

export const authRouter = express.Router();

authRouter.post('/anon', createAnonSession);
authRouter.put('/anon', authService.authenticate, authService.validateSignUp, upgradeAnonSession);
authRouter.post('/', authService.validateSignUp, signUp);
authRouter.post('/logout', logOut);
