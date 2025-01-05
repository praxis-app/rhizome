import express from 'express';
import * as authService from '../auth/auth.service';
import { getCurrentUser } from './users.controller';

export const usersRouter = express.Router();

usersRouter.use(authService.authenticate);
usersRouter.get('/me', getCurrentUser);
