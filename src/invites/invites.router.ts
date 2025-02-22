import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import {
  createInvite,
  deleteInvite,
  getInvite,
  getInvites,
} from './invites.controller';

export const invitesRouter = express.Router();

invitesRouter
  .get('/:token', getInvite)
  .get('/', authenticate, getInvites)
  .post('/', authenticate, createInvite)
  .delete('/:inviteId', authenticate, deleteInvite);
