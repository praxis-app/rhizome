import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { channelsService } from '../channels/channels.service';
import { dataSource } from '../database/data-source';
import { Image } from '../images/models/image.entity';
import { pubSubService } from '../pub-sub/pub-sub.service';
import { User } from '../users/user.entity';
import { CreateMessageDto } from './models/create-message.dto';
import { Message } from './models/message.entity';

enum MessageType {
  MESSAGE = 'message',
  IMAGE = 'image',
}

export class MessagesService {
  private messageRepository: Repository<Message>;
  private imageRepository: Repository<Image>;

  constructor() {
    this.messageRepository = dataSource.getRepository(Message);
    this.imageRepository = dataSource.getRepository(Image);
  }

  getMessages(channelId: string) {
    return this.messageRepository.find({
      where: { channelId },
      relations: ['user', 'images'],
      select: {
        id: true,
        body: true,
        createdAt: true,
        user: {
          name: true,
        },
        images: {
          id: true,
          filename: true,
          createdAt: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: 20,
    });
  }

  async createMessage({ imageCount, ...messageData }: CreateMessageDto, user: User) {
    const errors = await validate(messageData);
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors));
    }
    const message = await this.messageRepository.save({ ...messageData, userId: user.id });
    let images: Image[] = [];

    if (imageCount) {
      const imagePlaceholders = Array.from({ length: imageCount }).map(() => {
        return this.imageRepository.create({ messageId: message.id });
      });
      images = await this.imageRepository.save(imagePlaceholders);
    }
    const messagePayload = {
      ...message,
      user: { name: user.name },
      images,
    };

    const { channelId } = messageData;
    const channelMembers = await channelsService.getChannelMembers(channelId);
    for (const member of channelMembers) {
      if (member.userId === user.id) {
        continue;
      }
      await pubSubService.publish(this.getChannelKey(channelId, member.userId), {
        type: MessageType.MESSAGE,
        message: messagePayload,
      });
    }

    return messagePayload;
  }

  async saveMessageImage(messageId: string, imageId: string, filename: string, user: User) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });
    if (!message) {
      throw new Error('Message not found');
    }

    const image = await this.imageRepository.save({ id: imageId, filename });
    const channelMembers = await channelsService.getChannelMembers(message.channelId);
    for (const member of channelMembers) {
      if (member.userId === user.id) {
        continue;
      }
      const channelKey = this.getChannelKey(message.channelId, member.userId);
      await pubSubService.publish(channelKey, {
        type: MessageType.IMAGE,
        messageId,
        imageId,
        filename,
      });
    }
    return image;
  }

  getChannelKey(channelId: string, userId: string) {
    return `channel-${channelId}-${userId}`;
  }
}

export const messagesService = new MessagesService();
