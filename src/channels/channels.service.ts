import { dataSource } from '../database/data-source';
import { ChannelMember } from './models/channel-member.entity';
import { Channel } from './models/channel.entity';

const GENERAL_CHANNEL_NAME = 'general';

const channelRepository = dataSource.getRepository(Channel);
const channelMemberRepository = dataSource.getRepository(ChannelMember);

export const getChannel = (channelId: string) => {
  return channelRepository.findOneOrFail({
    where: { id: channelId },
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

export const initializeGeneralChannel = () => {
  return channelRepository.save({
    name: GENERAL_CHANNEL_NAME,
  });
};
