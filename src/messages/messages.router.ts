// TODO: Guard routes with permission checks

import express from 'express';
import * as authService from '../auth/auth.service';
import { uploadImage } from '../images/middleware/upload-image.middleware';
import { messagesController } from './messages.controller';
import { messagesService } from './messages.service';

const IMAGE_ROUTE = '/:messageId/images/:imageId';

export const messagesRouter = express.Router({
  mergeParams: true,
});

// Public routes
messagesRouter.get('/', messagesController.getMessages);

// Protected routes
messagesRouter.use(authService.authenticate);
messagesRouter.post('/', messagesService.validateMessage, messagesController.createMessage);
messagesRouter.post(`${IMAGE_ROUTE}/upload`, uploadImage, messagesController.uploadMessageImage);
