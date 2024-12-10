import express from 'express';
import { messagesController } from './messages.controller';
import { authService } from '../auth/auth.service';

export const messagesRouter = express.Router({
  mergeParams: true,
});

messagesRouter.use(authService.authenticateUser);
messagesRouter.get('/', messagesController.getMessages);
messagesRouter.post('/', messagesController.createMessage);
