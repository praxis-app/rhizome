import express from 'express';
import { authService } from './auth.service';
import { authController } from './auth.controller';

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
