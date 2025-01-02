// TODO: Guard routes with permission checks

import express from 'express';
import { messagesRouter } from '../messages/messages.router';
import { channelsController } from './channels.controller';

export const channelsRouter = express.Router();

channelsRouter.get('/', channelsController.getChannels);
channelsRouter.get('/:channelId', channelsController.getChannel);
channelsRouter.use('/:channelId/messages', messagesRouter);
