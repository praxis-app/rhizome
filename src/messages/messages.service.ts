import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { channelsService } from '../channels/channels.service';
import { dataSource } from '../database/data-source';
import { pubSubService } from '../pub-sub/pub-sub.service';
import { User } from '../users/user.entity';
import { CreateMessageDto } from './models/create-message.dto';
import { Message } from './models/message.entity';

export class MessagesService {
  private messageRepository: Repository<Message>;

  constructor() {
    this.messageRepository = dataSource.getRepository(Message);
  }

  getMessages(channelId: string) {
    return this.messageRepository.find({
      where: { channelId },
      relations: ['user'],
      select: {
        id: true,
        body: true,
        createdAt: true,
        user: {
          name: true,
        },
      },
      order: { createdAt: 'ASC' },
    });
  }

  async createMessage(
    channelId: string,
    messageData: CreateMessageDto,
    user: User,
  ) {
    const errors = await validate(messageData);
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors));
    }

    const message = await this.messageRepository.save({
      ...messageData,
      userId: user.id,
      channelId,
    });
    const messagePayload = {
      ...message,
      user: { name: user.name },
    };

    const channelMembers = await channelsService.getChannelMembers(channelId);
    for (const member of channelMembers) {
      await pubSubService.publish(
        this.getNewMessageChannelKey(channelId, member.userId),
        { message: messagePayload },
      );
    }

    return messagePayload;
  }

  getNewMessageChannelKey(channelId: string, userId: string) {
    return `new-message-${channelId}-${userId}`;
  }
}

export const messagesService = new MessagesService();
