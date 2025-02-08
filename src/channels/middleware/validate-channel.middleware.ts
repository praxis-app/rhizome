import { NextFunction, Request, Response } from 'express';
import { sanitizeText } from '../../common/common.utils';
import { CreateChannelReq } from '../channels.service';

/** Channel names can only contain letters, numbers, and hyphens */
const VALID_CHANNEL_NAME_REGEX = /^[A-Za-z0-9-]+$/;

const CHANNEL_NAME_MAX = 25;

export const validateChannel = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const channel = req.body as CreateChannelReq;
  if (typeof channel.name !== 'string') {
    res.status(422).send('Channel name must be a string');
    return;
  }
  const sanitizedName = sanitizeText(channel.name);
  if (sanitizedName.length > CHANNEL_NAME_MAX) {
    const message = `Channel name cannot exceed ${CHANNEL_NAME_MAX} characters`;
    res.status(422).send(message);
    return;
  }
  if (!VALID_CHANNEL_NAME_REGEX.test(sanitizedName)) {
    const message = `Channel names can only contain letters, numbers, and hyphens`;
    res.status(422).send(message);
    return;
  }
  next();
};
