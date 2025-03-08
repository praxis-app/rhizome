import {
  DECISION_MAKING_MODEL,
  PROPOSA_ACTION_TYPE,
  PROPOSAL_STAGE,
} from './proposal.constants';

export type DecisionMakingModel = (typeof DECISION_MAKING_MODEL)[number];

export type ProposalActionType = (typeof PROPOSA_ACTION_TYPE)[number];

export type ProposalStage = (typeof PROPOSAL_STAGE)[number];
