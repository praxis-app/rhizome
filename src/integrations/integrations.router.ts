import express from 'express';
import {
  createProposal,
  deleteProposal,
  getProposal,
} from '../proposals/proposals.controller';

export const integrationsRouter = express.Router();

integrationsRouter
  .get('/proposals', getProposal)
  .post('/proposals', createProposal)
  .delete('/proposals/:proposalId', deleteProposal);
