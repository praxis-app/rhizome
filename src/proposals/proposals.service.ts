import { FindOptionsWhere } from 'typeorm';
import { sanitizeText } from '../common/common.utils';
import { dataSource } from '../database/data-source';
import { deleteImageFile } from '../images/images.utils';
import { Image } from '../images/models/image.entity';
import { getServerConfig } from '../server-configs/server-configs.service';
import { User } from '../users/user.entity';
import { Vote } from '../votes/vote.entity';
import {
  sortConsensusVotesByType,
  sortMajorityVotesByType,
} from '../votes/votes.utils';
import { ProposalAction } from './models/proposal-action.entity';
import { ProposalConfig } from './models/proposal-config.entity';
import { Proposal } from './models/proposal.entity';

interface CreateProposalReq {
  body: string;
  closingAt?: Date;
  action: Partial<ProposalAction>;
}

const proposalRepository = dataSource.getRepository(Proposal);
const imageRepository = dataSource.getRepository(Image);
const userRepository = dataSource.getRepository(User);

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

// TODO: Account for instances with multiple servers / guilds
export const getProposalMembers = async () => {
  return userRepository.find({
    where: {
      anonymous: false,
      locked: false,
    },
  });
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
  members: User[],
) => {
  if (closingAt && Date.now() < Number(closingAt)) {
    return false;
  }
  const { agreements } = sortMajorityVotesByType(votes);

  return agreements.length >= members.length * (ratificationThreshold * 0.01);
};

export const createProposal = async (
  { body, closingAt, action }: CreateProposalReq,
  userId: string,
) => {
  const sanitizedBody = sanitizeText(body);
  if (body && body.length > 8000) {
    throw new Error('Proposals must be 8000 characters or less');
  }

  const serverConfig = await getServerConfig();
  const configClosingAt = serverConfig.votingTimeLimit
    ? new Date(Date.now() + serverConfig.votingTimeLimit * 60 * 1000)
    : undefined;

  const proposalConfig: Partial<ProposalConfig> = {
    decisionMakingModel: serverConfig.decisionMakingModel,
    ratificationThreshold: serverConfig.ratificationThreshold,
    reservationsLimit: serverConfig.reservationsLimit,
    standAsidesLimit: serverConfig.standAsidesLimit,
    closingAt: closingAt || configClosingAt,
  };

  const proposal = await proposalRepository.save({
    body: sanitizedBody,
    config: proposalConfig,
    userId,
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
