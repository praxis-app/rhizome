import { sanitizeText } from '../common/common.utils';
import { dataSource } from '../database/data-source';
import { Proposal } from './models/proposal.entity';

const proposalRepository = dataSource.getRepository(Proposal);

export const createProposal = async (
  { body, closingAt, action, groupId }: any,
  userId: string,
) => {
  const sanitizedBody = sanitizeText(body);
  if (body && body.length > 8000) {
    throw new Error('Proposals must be 8000 characters or less');
  }

  // TODO: Determine how to get the config
  let config: any;

  const configClosingAt = config.votingTimeLimit
    ? new Date(Date.now() + config.votingTimeLimit * 60 * 1000)
    : undefined;

  const proposalConfig: Partial<any> = {
    decisionMakingModel: config.decisionMakingModel,
    ratificationThreshold: config.ratificationThreshold,
    reservationsLimit: config.reservationsLimit,
    standAsidesLimit: config.standAsidesLimit,
    closingAt: closingAt || configClosingAt,
  };

  const proposal = await proposalRepository.save({
    body: sanitizedBody,
    config: proposalConfig,
    userId,
    groupId,
    action,
  });

  return proposal;
};
