import express from 'express';
import { authRouter } from './auth/auth.router';
import { channelsRouter } from './channels/channels.router';
import { healthRouter } from './health/health.router';
import { messagesRouter } from './messages/messages.router';
import { usersRouter } from './users/users.router';
import { imagesRouter } from './images/images.router';

export const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/users', usersRouter);
appRouter.use('/channels', channelsRouter);
appRouter.use('/messages', messagesRouter);
appRouter.use('/images', imagesRouter);
appRouter.use('/health', healthRouter);
