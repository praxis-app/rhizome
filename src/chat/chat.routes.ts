import express from 'express';
import chatService, { ChatService } from './chat.service';

const chatRouter = express.Router();

chatRouter.get('/', (_, res) => {
  res.json({
    isChatService: chatService instanceof ChatService,
  });
});

export default chatRouter;
