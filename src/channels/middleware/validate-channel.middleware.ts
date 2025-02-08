import { NextFunction, Request, Response } from 'express';
import { sanitizeText } from '../../common/common.utils';
import { CreateChannelReq } from '../channels.service';

const CHANNEL_NAME_MAX = 25;
const VALID_NAME_REGEX = /^[A-Za-z0-9 ]+$/;

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
  if (!VALID_NAME_REGEX.test(sanitizedName)) {
    res.status(422).send('Channel names cannot contain special characters');
    return;
  }
  next();
};
