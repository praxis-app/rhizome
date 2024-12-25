import express from 'express';
import { usersController } from './users.controller';
import { authService } from '../auth/auth.service';

export const usersRouter = express.Router();

usersRouter.use(authService.authenticateUser);
usersRouter.get('/me', usersController.getCurrentUser);
