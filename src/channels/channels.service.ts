import { Repository } from 'typeorm';
import { dataSource } from '../database/data-source';
import { Channel } from './models/channel.entity';
import { ChannelMember } from './models/channel-member.entity';

export class ChannelsService {
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

  getChannels() {
    return this.channelRepository.find();
  }

  getChannelMembers(channelId: number) {
    return this.channelMemberRepository.find({
      where: { channelId },
    });
  }
}

export const channelsService = new ChannelsService();
