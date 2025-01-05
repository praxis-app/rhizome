import { NextFunction, Request, Response } from 'express';
import { sanitizeText } from '../../common/common.utils';
import { CreateMessageReq } from '../messages.service';

const MESSAGE_BODY_MAX = 6000;
const MESSAGE_IMAGE_COUNT_MAX = 5;

export const validateMessage = (req: Request, res: Response, next: NextFunction) => {
  const message = req.body as CreateMessageReq;
  if (typeof message.channelId !== 'string') {
    res.status(400).send('Channel ID must be a string');
    return;
  }
  if (typeof message.imageCount !== 'number') {
    res.status(400).send('Image count must be a number');
    return;
  }
  if (message.imageCount < 0 || message.imageCount > MESSAGE_IMAGE_COUNT_MAX) {
    res.status(400).send(`Image count must be between 0 and ${MESSAGE_IMAGE_COUNT_MAX}`);
    return;
  }
  if (message.body && typeof message.body !== 'string') {
    res.status(400).send('Message body must be a string');
    return;
  }
  const sanitizedBody = sanitizeText(message.body);
  if (message.body && sanitizedBody.length > MESSAGE_BODY_MAX) {
    res.status(400).send(`Message body cannot exceed ${MESSAGE_BODY_MAX} characters`);
    return;
  }
  if (!sanitizedBody && !message.imageCount) {
    res.status(400).send('Message body or images are required');
    return;
  }
  next();
};
