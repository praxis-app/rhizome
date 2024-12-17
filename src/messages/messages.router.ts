import express from 'express';
import { authService } from '../auth/auth.service';
import { messagesController } from './messages.controller';

export const messagesRouter = express.Router({
  mergeParams: true,
});

// TODO: Determine if this is needed
messagesRouter.use(authService.authenticateUser);

messagesRouter.get('/', messagesController.getMessages);
messagesRouter.post('/', messagesController.createMessage);
messagesRouter.post('/:messageId/images', messagesController.createMessageImages);
