// TODO: Guard routes with permission checks

import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import { uploadImage } from '../images/middleware/upload-image.middleware';
import * as messagesController from './messages.controller';
import * as messagesService from './messages.service';

const IMAGE_ROUTE = '/:messageId/images/:imageId';

export const messagesRouter = express.Router({
  mergeParams: true,
});

// Public routes
messagesRouter.get('/', messagesController.getMessages);

// Protected routes
messagesRouter.use(authenticate);
messagesRouter.post('/', messagesService.validateMessage, messagesController.createMessage);
messagesRouter.post(`${IMAGE_ROUTE}/upload`, uploadImage, messagesController.uploadMessageImage);
