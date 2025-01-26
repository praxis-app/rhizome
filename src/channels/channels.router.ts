// TODO: Ensure all routes are protected by the appropriate permissions

import express from 'express';
import { messagesRouter } from '../messages/messages.router';
import { can } from '../roles/middleware/can.middleware';
import {
  createChannel,
  getChannel,
  getChannels,
  updateChannel,
} from './channels.controller';
import { validateChannel } from './middleware/validate-channel.middleware';

export const channelsRouter = express.Router();

channelsRouter
  .get('/', getChannels)
  .get('/:channelId', getChannel)
  .post('/', can('create', 'Channel'), validateChannel, createChannel)
  .put('/:channelId', can('update', 'Channel'), validateChannel, updateChannel)
  .use('/:channelId/messages', messagesRouter);
