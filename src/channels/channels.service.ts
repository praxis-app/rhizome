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
  return channelRepository.find();
};

export const getChannelMembers = (channelId: string) => {
  return channelMemberRepository.find({
    where: { channelId },
  });
};

export const addMemberToGeneralChannel = async (userId: string) => {
  const generalChannel = await getGeneralChannel();
  await channelMemberRepository.save({
    channelId: generalChannel.id,
    userId,
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

export const createChannel = (
  { name, description }: CreateChannelReq,
  currentUserId: string,
) => {
  return channelRepository.save({
    name: sanitizeText(name),
    description: sanitizeText(description),
    members: [{ userId: currentUserId }],
  });
};

export const updateChannel = async (
  channelId: string,
  { name, description }: UpdateChannelReq,
) => {
  return channelRepository.update(channelId, {
    name: sanitizeText(name),
    description: sanitizeText(description),
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
