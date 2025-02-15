import { sanitizeText } from '../common/common.utils';
import { dataSource } from '../database/data-source';
import { ChannelMember } from './models/channel-member.entity';
import { Channel } from './models/channel.entity';

export interface CreateChannelReq {
  name: string;
  description?: string;
}

export interface UpdateChannelReq {
  name: string;
  description?: string;
}

const GENERAL_CHANNEL_NAME = 'general';

const channelRepository = dataSource.getRepository(Channel);
const channelMemberRepository = dataSource.getRepository(ChannelMember);

export const getChannel = (channelId: string) => {
  return channelRepository.findOneOrFail({
    where: { id: channelId },
  });
};

export const getChannels = async () => {
  const channelCount = await channelRepository.count();
  if (channelCount === 0) {
    await initializeGeneralChannel();
  }
  return channelRepository.find({
    order: { createdAt: 'ASC' },
  });
};

export const getChannelMembers = (channelId: string) => {
  return channelMemberRepository.find({
    where: { channelId },
  });
};

export const getGeneralChannel = async () => {
  const generalChannel = await channelRepository.findOne({
    where: { name: GENERAL_CHANNEL_NAME },
  });
  if (!generalChannel) {
    return initializeGeneralChannel();
  }
  return generalChannel;
};

export const addMemberToGeneralChannel = async (userId: string) => {
  const generalChannel = await getGeneralChannel();
  await channelMemberRepository.save({
    channelId: generalChannel.id,
    userId,
  });
};

export const createChannel = (
  { name, description }: CreateChannelReq,
  currentUserId: string,
) => {
  const sanitizedName = sanitizeText(name);
  const normalizedName = sanitizedName.toLocaleLowerCase();
  const sanitizedDescription = sanitizeText(description);

  return channelRepository.save({
    name: normalizedName,
    description: sanitizedDescription,
    members: [{ userId: currentUserId }],
  });
};

export const updateChannel = async (
  channelId: string,
  { name, description }: UpdateChannelReq,
) => {
  const sanitizedName = sanitizeText(name);
  const normalizedName = sanitizedName.toLocaleLowerCase();
  const sanitizedDescription = sanitizeText(description);

  return channelRepository.update(channelId, {
    name: normalizedName,
    description: sanitizedDescription,
  });
};

export const deleteChannel = async (channelId: string) => {
  return channelRepository.delete(channelId);
};

const initializeGeneralChannel = () => {
  return channelRepository.save({
    name: GENERAL_CHANNEL_NAME,
  });
};
