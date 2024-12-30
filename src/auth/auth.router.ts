import express from 'express';
import { authService } from './auth.service';
import { authController } from './auth.controller';

export const authRouter = express.Router();

authRouter.post('/', authService.validateCreateAnon, authController.createAnon);
authRouter.put('/', authService.authenticate, authService.validateSignUp, authController.signUp);
