import express from 'express';
import { authRouter } from './auth/auth.router';
import { channelsRouter } from './channels/channels.router';
import { healthRouter } from './health/health.router';
import { imagesRouter } from './images/images.router';
import { invitesRouter } from './invites/invites.router';
import { messagesRouter } from './messages/messages.router';
import { rolesRouter } from './roles/roles.router';
import { usersRouter } from './users/users.router';

export const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/users', usersRouter);
appRouter.use('/roles', rolesRouter);
appRouter.use('/channels', channelsRouter);
appRouter.use('/messages', messagesRouter);
appRouter.use('/images', imagesRouter);
appRouter.use('/invites', invitesRouter);
appRouter.use('/health', healthRouter);
