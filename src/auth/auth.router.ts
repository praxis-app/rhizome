import express from 'express';
import { authService } from './auth.service';
import { authController } from './auth.controller';

export const authRouter = express.Router();

authRouter.post('/', authService.validateRegisterAnon, authController.registerAnon);
authRouter.put('/', authService.authenticate, authService.validateUpgrade, authController.upgrade);
