import express from 'express';
import { authService } from './auth.service';
import { authController } from './auth.controller';

export const authRouter = express.Router();

authRouter.post('/', authService.validateRegister, authController.register);
