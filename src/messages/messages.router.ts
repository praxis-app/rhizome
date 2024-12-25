import express from 'express';
import { uploadImage } from '../images/middleware/upload-image.middleware';
import { messagesController } from './messages.controller';
import { messagesService } from './messages.service';

const IMAGE_ROUTE = '/:messageId/images/:imageId';

export const messagesRouter = express.Router({
  mergeParams: true,
});

messagesRouter.get('/', messagesController.getMessages);
messagesRouter.post('/', messagesService.validateMessage, messagesController.createMessage);
messagesRouter.post(`${IMAGE_ROUTE}/upload`, uploadImage, messagesController.uploadMessageImage);
