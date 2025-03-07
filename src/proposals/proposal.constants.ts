export enum DecisionMakingModel {
  Consent = 'consent',
  Consensus = 'consensus',
  MajorityVote = 'majority-vote',
}

export enum ProposalActionType {
  ChangeRole = 'change-role',
  ChangeSettings = 'change-settings',
  CreateRole = 'create-role',
  PlanEvent = 'plan-event',
  Test = 'test',
}

export const PROPOSAL_STAGE = [
  'voting',
  'ratified',
  'revision',
  'closed',
] as const;
