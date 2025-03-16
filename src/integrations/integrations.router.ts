import express from 'express';
import {
  createProposal,
  deleteProposal,
  getProposal,
} from '../proposals/proposals.controller';
import { createVote, deleteVote, updateVote } from '../votes/votes.controller';
import { authIntegration } from './auth-integration.middleware';
import {
  getServerConfig,
  updateServerConfig,
} from '../server-configs/server-configs.controller';

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

integrationsRouter
  .get('/server-configs', getServerConfig)
  .put('/server-configs', updateServerConfig);
