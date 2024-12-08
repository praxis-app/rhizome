import { Request, Response } from 'express';
import { channelsService } from './channels.service';

class ChannelsController {
  getChannels = async (_: Request, res: Response) => {
    const channels = await channelsService.getChannels();
    res.json({ channels });
  };
}

export const channelsController = new ChannelsController();
