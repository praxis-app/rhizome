import express from 'express';
import { ChatService, chatService } from './chat.service';

export const chatRouter = express.Router();

chatRouter.get('/', (_, res) => {
  res.json({
    isChatService: chatService instanceof ChatService,
  });
});
