import express from 'express';
import { messagesController } from './messages.controller';

export const messagesRouter = express.Router();

messagesRouter.get('/', messagesController.getMessages);
