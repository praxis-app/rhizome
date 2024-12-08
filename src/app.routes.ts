import express from 'express';
import { authRouter } from './auth/auth.routes';
import { channelsRouter } from './channels/channels.routes';
import { healthRouter } from './health/health.routes';
import { messagesRouter } from './messages/messages.routes';

export const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/health', healthRouter);
appRouter.use('/channels', channelsRouter);
appRouter.use('/messages', messagesRouter);
