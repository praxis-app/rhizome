import { Request, Response } from 'express';
import * as channelsService from './channels.service';

export const getChannels = async (_: Request, res: Response) => {
  const channels = await channelsService.getChannels();
  res.json({ channels });
};

export const getChannel = async (req: Request, res: Response) => {
  const channel = await channelsService.getChannel(req.params.channelId);
  res.json({ channel });
};

export const createChannel = async (req: Request, res: Response) => {
  const channel = await channelsService.createChannel(
    req.body,
    res.locals.user.id,
  );
  res.json({ channel });
};

export const updateChannel = async (req: Request, res: Response) => {
  const result = await channelsService.updateChannel(
    req.params.channelId,
    req.body,
  );
  res.json(result);
};
