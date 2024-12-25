import { Request, Response } from 'express';
import { messagesService } from './messages.service';

class MessagesController {
  async getMessages(req: Request, res: Response) {
    try {
      const { channelId } = req.params;
      const offset = req.query.offset ? Number(req.query.offset) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const messages = await messagesService.getMessages(channelId, offset, limit);
      res.json({ messages });
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  }

  async createMessage(req: Request, res: Response) {
    const message = await messagesService.createMessage(req.body, res.locals.user);
    res.json({ message });
  }

  async uploadMessageImage(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).send('No image uploaded');
      return;
    }
    const { user } = res.locals;
    const { messageId, imageId } = req.params;
    const { filename } = req.file as Express.Multer.File;
    const image = await messagesService.saveMessageImage(messageId, imageId, filename, user);

    res.status(201).json({ image });
  }
}

export const messagesController = new MessagesController();
