// TODO: Guard routes with permission checks

import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import { uploadImage } from '../images/middleware/upload-image.middleware';
import { createMessage, getMessages, uploadMessageImage } from './messages.controller';
import { validateMessage } from './middleware/validate-message.middleware';

const IMAGE_ROUTE = '/:messageId/images/:imageId';

export const messagesRouter = express.Router({
  mergeParams: true,
});

// Public routes
messagesRouter.get('/', getMessages);

// Protected routes
messagesRouter.use(authenticate);
messagesRouter.post('/', validateMessage, createMessage);
messagesRouter.post(`${IMAGE_ROUTE}/upload`, uploadImage, uploadMessageImage);
