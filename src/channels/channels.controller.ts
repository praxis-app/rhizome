import { Request, Response } from 'express';
import { channelsService } from './channels.service';

class ChannelsController {
  getChannels = async (_: Request, res: Response) => {
    const channels = await channelsService.getChannels();
    res.json({ channels });
  };

  getChannel = async (req: Request, res: Response) => {
    const channelId = parseInt(req.params.channelId);
    const channel = await channelsService.getChannel(channelId);
    res.json({ channel });
  };
}

export const channelsController = new ChannelsController();
