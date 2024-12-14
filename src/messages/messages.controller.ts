import { Request, Response } from 'express';
import { messagesService } from './messages.service';

class MessagesController {
  getMessages = async (req: Request, res: Response) => {
    try {
      const { channelId } = req.params;
      const messages = await messagesService.getMessages(channelId);
      res.json({ messages });
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  };

  createMessage = async (req: Request, res: Response) => {
    const { channelId } = req.params;
    const { user } = res.locals;

    const message = await messagesService.createMessage(
      channelId,
      req.body,
      user,
    );
    res.json({ message });
  };
}

export const messagesController = new MessagesController();
