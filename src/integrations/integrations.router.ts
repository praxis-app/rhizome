import express from 'express';
import {
  createProposal,
  deleteProposal,
  getProposal,
} from '../proposals/proposals.controller';
import { createVote, deleteVote, updateVote } from '../votes/votes.controller';
import { authIntegration } from './auth-integration.middleware';

export const integrationsRouter = express.Router();

integrationsRouter.use(authIntegration);

integrationsRouter
  .get('/proposals', getProposal)
  .post('/proposals', createProposal)
  .delete('/proposals/:proposalId', deleteProposal);

integrationsRouter
  .post('/votes', createVote)
  .put('/votes/:voteId', updateVote)
  .delete('/votes/:voteId', deleteVote);
