import { FindOptionsWhere } from 'typeorm';
import { sanitizeText } from '../common/common.utils';
import { dataSource } from '../database/data-source';
import { deleteImageFile } from '../images/images.utils';
import { Image } from '../images/models/image.entity';
import { User } from '../users/user.entity';
import { Vote } from '../votes/vote.entity';
import {
  sortConsensusVotesByType,
  sortMajorityVotesByType,
} from '../votes/votes.utils';
import { ProposalConfig } from './models/proposal-config.entity';
import { Proposal } from './models/proposal.entity';

const proposalRepository = dataSource.getRepository(Proposal);
const imageRepository = dataSource.getRepository(Image);

export const getProposal = (id: string, relations?: string[]) => {
  return proposalRepository.findOneOrFail({
    where: { id },
    relations,
  });
};

export const getProposals = (
  where?: FindOptionsWhere<Proposal>,
  relations?: string[],
) => {
  return proposalRepository.find({ where, relations });
};

// TODO: Implement: Return eligible voters for a given proposal
export const getProposalMembers = async () => {
  return [];
};

export const isProposalRatifiable = async (proposalId: string) => {
  const { votes, stage, config } = await getProposal(proposalId, [
    'config',
    'votes',
  ]);
  const members = await getProposalMembers();

  if (stage !== 'voting') {
    return false;
  }
  if (config.decisionMakingModel === 'consensus') {
    return hasConsensus(votes, config, members);
  }
  if (config.decisionMakingModel === 'consent') {
    return hasConsent(votes, config);
  }
  if (config.decisionMakingModel === 'majority-vote') {
    return hasMajorityVote(votes, config, members);
  }
  return false;
};

export const hasConsensus = async (
  votes: Vote[],
  {
    ratificationThreshold,
    reservationsLimit,
    standAsidesLimit,
    closingAt,
  }: ProposalConfig,
  members: User[],
) => {
  if (closingAt && Date.now() < Number(closingAt)) {
    return false;
  }

  const { agreements, reservations, standAsides, blocks } =
    sortConsensusVotesByType(votes);

  return (
    agreements.length >= members.length * (ratificationThreshold * 0.01) &&
    reservations.length <= reservationsLimit &&
    standAsides.length <= standAsidesLimit &&
    blocks.length === 0
  );
};

export const hasConsent = (votes: Vote[], proposalConfig: ProposalConfig) => {
  const { reservations, standAsides, blocks } = sortConsensusVotesByType(votes);
  const { reservationsLimit, standAsidesLimit, closingAt } = proposalConfig;

  return (
    Date.now() >= Number(closingAt) &&
    reservations.length <= reservationsLimit &&
    standAsides.length <= standAsidesLimit &&
    blocks.length === 0
  );
};

export const hasMajorityVote = (
  votes: Vote[],
  { ratificationThreshold, closingAt }: ProposalConfig,
  groupMembers: User[],
) => {
  if (closingAt && Date.now() < Number(closingAt)) {
    return false;
  }
  const { agreements } = sortMajorityVotesByType(votes);

  return (
    agreements.length >= groupMembers.length * (ratificationThreshold * 0.01)
  );
};

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

export const ratifyProposal = async (proposalId: string) => {
  await proposalRepository.update(proposalId, {
    stage: 'ratified',
  });
};

export const deleteProposal = async (proposalId: string) => {
  const images = await imageRepository.find({ where: { proposalId } });
  for (const { filename } of images) {
    if (filename) {
      await deleteImageFile(filename);
    }
  }
  return proposalRepository.delete(proposalId);
};
