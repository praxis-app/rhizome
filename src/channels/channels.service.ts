import { Repository } from 'typeorm';
import { dataSource } from '../database/data-source';
import { Channel } from './models/channel.entity';

export class ChannelsService {
  private channelRepository: Repository<Channel>;

  constructor() {
    this.channelRepository = dataSource.getRepository(Channel);
  }

  getChannels() {
    return this.channelRepository.find();
  }
}

export const channelsService = new ChannelsService();
