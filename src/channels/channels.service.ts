import { Repository } from 'typeorm';
import { dataSource } from '../database/data-source';
import { Channel } from './models/channel.entity';
import { ChannelMember } from './models/channel-member.entity';

class ChannelsService {
  private channelRepository: Repository<Channel>;
  private channelMemberRepository: Repository<ChannelMember>;

  constructor() {
    this.channelRepository = dataSource.getRepository(Channel);
    this.channelMemberRepository = dataSource.getRepository(ChannelMember);
  }

  getChannel(channelId: string) {
    return this.channelRepository.findOneOrFail({
      where: { id: channelId },
    });
  }

  async getGeneralChannel() {
    const generalChannel = await this.channelRepository.findOne({
      where: { name: 'general' },
    });
    if (!generalChannel) {
      return this.initializeGeneralChannel();
    }
    return generalChannel;
  }

  async getChannels() {
    const channelCount = await this.channelRepository.count();
    if (channelCount === 0) {
      await this.initializeGeneralChannel();
    }
    return this.channelRepository.find();
  }

  getChannelMembers(channelId: string) {
    return this.channelMemberRepository.find({
      where: { channelId },
    });
  }

  addMemberToGeneralChannel = async (userId: string) => {
    const generalChannel = await this.getGeneralChannel();
    await this.channelMemberRepository.save({
      channelId: generalChannel.id,
      userId,
    });
  };

  // TODO: Add constant for general channel name
  initializeGeneralChannel() {
    return this.channelRepository.save({
      name: 'general',
    });
  }
}

export const channelsService = new ChannelsService();
