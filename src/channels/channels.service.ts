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

  getChannel(channelId: number) {
    return this.channelRepository.findOneOrFail({
      where: { id: channelId },
    });
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

  initializeGeneralChannel() {
    return this.channelRepository.insert({
      name: 'general',
    });
  }
}

export const channelsService = new ChannelsService();
