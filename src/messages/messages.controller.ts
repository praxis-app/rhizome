import { Request, Response } from 'express';
import { messagesService } from './messages.service';

class MessagesController {
  getMessages = async (req: Request, res: Response) => {
    try {
      const channelId = parseInt(req.params.channelId as string);
      const messages = await messagesService.getMessages(channelId);
      res.json({ messages });
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  };

  createMessage = async (req: Request, res: Response) => {
    try {
      const channelId = parseInt(req.params.channelId as string);
      const message = await messagesService.createMessage(
        res.locals.user.id,
        channelId,
        req.body,
      );
      res.json({ message });
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  };
}

export const messagesController = new MessagesController();
