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

    const message = await messagesService.createMessage(channelId, req.body, user);
    res.json({ message });
  };

  async createMessageImages(req: Request, res: Response) {
    if (!req.files) {
      res.status(400).send('No images uploaded');
      return;
    }
    const { messageId } = req.params;
    const files = req.files as Express.Multer.File[];
    const images = await messagesService.createMessageImages(messageId, files);

    res.status(201).json({ images });
  }
}

export const messagesController = new MessagesController();
