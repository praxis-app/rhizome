import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import { getCurrentUser } from './users.controller';

export const usersRouter = express.Router();

usersRouter.use(authenticate);
usersRouter.get('/me', getCurrentUser);
