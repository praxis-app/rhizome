import express from 'express';
import {
  createInvite,
  deleteInvite,
  getInvite,
  getInvites,
} from './invites.controller';
import { authenticate } from '../auth/middleware/authenticate.middleware';

export const invitesRouter = express.Router();

invitesRouter
  .get('/', getInvites)
  .get('/:token', authenticate, getInvite)
  .post('/', authenticate, createInvite)
  .delete('/:inviteId', authenticate, deleteInvite);
