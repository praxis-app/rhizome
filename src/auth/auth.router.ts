import express from 'express';
import { authService } from './auth.service';
import { authController } from './auth.controller';

export const authRouter = express.Router();

authRouter.post('/', authService.validateSignUp, authController.signUp);
authRouter.post('/anon', authController.createAnonSession);
authRouter.put(
  '/anon',
  authService.authenticate,
  authService.validateSignUp,
  authController.upgradeAnonSession,
);
