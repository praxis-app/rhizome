import { NextFunction, Request, Response } from 'express';
import { sanitizeText } from '../../common/common.utils';
import { CreateChannelReq } from '../channels.service';

const CHANNEL_NAME_MAX = 25;

export const validateChannel = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const channel = req.body as CreateChannelReq;
  if (typeof channel.name !== 'string') {
    res.status(400).send('Channel name must be a string');
    return;
  }
  const sanitizedName = sanitizeText(channel.name);
  if (sanitizedName.length > CHANNEL_NAME_MAX) {
    const message = `Channel name cannot exceed ${CHANNEL_NAME_MAX} characters`;
    res.status(400).send(message);
    return;
  }
  next();
};
