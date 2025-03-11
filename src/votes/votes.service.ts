import { FindOptionsWhere } from 'typeorm';
import { dataSource } from '../database/data-source';
import * as proposalsService from '../proposals/proposals.service';
import { Vote } from './vote.entity';

const voteRepository = dataSource.getRepository(Vote);

export const getVote = async (id: string, relations?: string[]) => {
  return voteRepository.findOneOrFail({ where: { id }, relations });
};

export const getVotes = async (where?: FindOptionsWhere<Vote>) => {
  return voteRepository.find({ where });
};

export const getVoteCount = async () => {
  return voteRepository.count();
};

export const createVote = async (voteData: any, userId: string) => {
  const vote = await voteRepository.save({
    ...voteData,
    userId,
  });

  const isProposalRatifiable = await proposalsService.isProposalRatifiable(
    vote.proposalId,
  );
  if (isProposalRatifiable) {
    await proposalsService.ratifyProposal(vote.proposalId);
    // TODO: Implement proposal here (implementProposal)
  }

  return vote;
};

export const updateVote = async (voteId: string, voteData: any) => {
  const result = await voteRepository.update(voteId, voteData);
  const vote = await getVote(voteId, ['proposal']);

  if (vote.proposalId) {
    const isProposalRatifiable = await proposalsService.isProposalRatifiable(
      vote.proposalId,
    );
    if (isProposalRatifiable) {
      await proposalsService.ratifyProposal(vote.proposalId);
      // TODO: Implement proposal here (implementProposal)
    }
  }

  return result;
};

export const deleteVote = async (voteId: string) => {
  return voteRepository.delete(voteId);
};
