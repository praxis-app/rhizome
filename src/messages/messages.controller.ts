import { Request, Response } from 'express';
import { messagesService } from './messages.service';

class MessagesController {
  getMessages = async (_: Request, res: Response) => {
    const messages = await messagesService.getMessages();
    res.json({ messages });
  };
}

export const messagesController = new MessagesController();
