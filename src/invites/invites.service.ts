import cryptoRandomString from 'crypto-random-string';
import { dataSource } from '../database/data-source';
import { User } from '../users/user.entity';
import { Invite } from './invite.entity';

const INVITES_PAGE_SIZE = 20;

const inviteRepository = dataSource.getRepository(Invite);

export const getValidInvite = async (token: string) => {
  const invite = await inviteRepository.findOne({
    where: { token },
  });
  if (!invite) {
    throw new Error('Invite not found');
  }
  const isValid = validateInvite(invite);
  if (!isValid) {
    throw new Error('Invalid server invite');
  }
  return invite;
};

export const getValidInvites = async () => {
  const invites = await inviteRepository.find({
    order: { createdAt: 'DESC' },
  });
  const validInvites = invites.filter((invite) => validateInvite(invite));

  // TODO: Update once pagination has been implemented
  return validInvites.slice(0, INVITES_PAGE_SIZE);
};

export const createInvite = async (inviteData: any, user: User) => {
  const token = cryptoRandomString({ length: 8 });
  const invite = await inviteRepository.save({
    ...inviteData,
    userId: user.id,
    token,
  });
  return invite;
};

export const redeemInvite = async (token: string) => {
  await inviteRepository.increment({ token }, 'uses', 1);
};

export const deleteInvite = async (inviteId: string) => {
  return inviteRepository.delete(inviteId);
};

export const validateInvite = (invite: Invite) => {
  const isExpired = invite.expiresAt && Date.now() >= Number(invite.expiresAt);
  const maxUsesReached = invite.maxUses && invite.uses >= invite.maxUses;

  if (isExpired || maxUsesReached) {
    return false;
  }
  return true;
};
