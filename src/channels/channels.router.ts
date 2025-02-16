// TODO: Add channel specific permissions

import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import { isRegistered } from '../auth/middleware/is-registered.middleware';
import { messagesRouter } from '../messages/messages.router';
import { can } from '../roles/middleware/can.middleware';
import {
  createChannel,
  deleteChannel,
  getChannel,
  getChannels,
  getGeneralChannel,
  getGeneralChannelMessages,
  updateChannel,
} from './channels.controller';
import { validateChannel } from './middleware/validate-channel.middleware';

export const channelsRouter = express.Router();

// Public routes
channelsRouter
  .get('/general', getGeneralChannel)
  .get('/general/messages', getGeneralChannelMessages);

// Protected routes
channelsRouter
  .use(authenticate)
  .get('/', isRegistered, getChannels)
  .get('/:channelId', isRegistered, getChannel)
  .post('/', can('create', 'Channel'), validateChannel, createChannel)
  .put('/:channelId', can('update', 'Channel'), validateChannel, updateChannel)
  .delete('/:channelId', can('delete', 'Channel'), deleteChannel)
  .use('/:channelId/messages', messagesRouter);
