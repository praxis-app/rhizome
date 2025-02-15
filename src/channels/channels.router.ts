// TODO: Ensure all routes are protected by the appropriate permissions

import express from 'express';
import { messagesRouter } from '../messages/messages.router';
import { can } from '../roles/middleware/can.middleware';
import {
  createChannel,
  deleteChannel,
  getChannel,
  getChannels,
  getGeneralChannel,
  updateChannel,
} from './channels.controller';
import { validateChannel } from './middleware/validate-channel.middleware';
import { authenticate } from '../auth/middleware/authenticate.middleware';

export const channelsRouter = express.Router();

channelsRouter
  .get('/', getChannels)
  .get('/general', getGeneralChannel)
  .get('/:channelId', getChannel)
  .use('/:channelId/messages', messagesRouter);

channelsRouter
  .use(authenticate)
  .post('/', can('create', 'Channel'), validateChannel, createChannel)
  .put('/:channelId', can('update', 'Channel'), validateChannel, updateChannel)
  .delete('/:channelId', can('delete', 'Channel'), deleteChannel);
