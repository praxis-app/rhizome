import express from 'express';
import { authService } from '../auth/auth.service';
import { messagesRouter } from '../messages/messages.router';
import { channelsController } from './channels.controller';

export const channelsRouter = express.Router();

channelsRouter.use(authService.authenticateUser);
channelsRouter.get('/', channelsController.getChannels);
channelsRouter.get('/:channelId', channelsController.getChannel);
channelsRouter.use('/:channelId/messages', messagesRouter);
