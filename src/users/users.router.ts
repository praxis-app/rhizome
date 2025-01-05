import express from 'express';
import { authService } from '../auth/auth.service';
import { getCurrentUser } from './users.controller';

export const usersRouter = express.Router();

usersRouter.use(authService.authenticate);
usersRouter.get('/me', getCurrentUser);
