import express from 'express';
import { uploadImages } from '../images/middleware/upload-images.middleware';
import { messagesController } from './messages.controller';

export const messagesRouter = express.Router({
  mergeParams: true,
});

messagesRouter.get('/', messagesController.getMessages);
messagesRouter.post('/', messagesController.createMessage);
messagesRouter.post('/:messageId/images', uploadImages, messagesController.createMessageImages);
