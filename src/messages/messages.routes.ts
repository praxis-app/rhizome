import express from 'express';
import { messagesController } from './messages.controller';
import { authService } from '../auth/auth.service';

export const messagesRouter = express.Router();

messagesRouter.use(authService.authenticateUser);
messagesRouter.get('/', messagesController.getMessages);
