import express from 'express';
import { authController } from './auth.controller';
import * as authService from './auth.service';

export const authRouter = express.Router();

authRouter.post('/', authService.validateSignUp, authController.signUp);
authRouter.post('/anon', authController.createAnonSession);
authRouter.post('/logout', authController.logOut);
authRouter.put(
  '/anon',
  authService.authenticate,
  authService.validateSignUp,
  authController.upgradeAnonSession,
);
