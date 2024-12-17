import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { channelsService } from '../channels/channels.service';
import { dataSource } from '../database/data-source';
import { Image } from '../images/models/image.entity';
import { pubSubService } from '../pub-sub/pub-sub.service';
import { User } from '../users/user.entity';
import { CreateMessageDto } from './models/create-message.dto';
import { Message } from './models/message.entity';

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
          createdAt: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async createMessage(channelId: string, messageData: CreateMessageDto, user: User) {
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
      if (member.userId === user.id) {
        continue;
      }
      await pubSubService.publish(this.getNewMessageChannelKey(channelId, member.userId), {
        message: messagePayload,
      });
    }

    return messagePayload;
  }

  async createMessageImages(messageId: string, files: Express.Multer.File[]) {
    const imageFilenames = files.map((file) => file.filename);
    const images = imageFilenames.map((filename) =>
      this.imageRepository.create({ messageId, filename }),
    );
    return this.imageRepository.save(images);
  }

  getNewMessageChannelKey(channelId: string, userId: string) {
    return `new-message-${channelId}-${userId}`;
  }
}

export const messagesService = new MessagesService();
