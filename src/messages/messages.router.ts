import express from 'express';
import { uploadImage } from '../images/middleware/upload-image.middleware';
import { messagesController } from './messages.controller';

const IMAGE_ROUTE = '/:messageId/images/:imageId';

export const messagesRouter = express.Router({
  mergeParams: true,
});

messagesRouter.get('/', messagesController.getMessages);
messagesRouter.post('/', messagesController.createMessage);
messagesRouter.post(`${IMAGE_ROUTE}/upload`, uploadImage, messagesController.uploadMessageImage);
