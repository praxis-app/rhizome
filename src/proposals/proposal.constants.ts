export const DECISION_MAKING_MODEL = [
  'consent',
  'consensus',
  'majority-vote',
] as const;

export const PROPOSA_ACTION_TYPE = [
  'change-role',
  'change-settings',
  'create-role',
  'plan-event',
  'test',
] as const;

export const PROPOSAL_STAGE = [
  'voting',
  'ratified',
  'revision',
  'closed',
] as const;
