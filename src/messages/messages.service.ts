import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { dataSource } from '../database/data-source';
import { MessageDto } from './models/message.dto';
import { Message } from './models/message.entity';

export class MessagesService {
  private messageRepository: Repository<Message>;

  constructor() {
    this.messageRepository = dataSource.getRepository(Message);
  }

  getMessages(channelId: number) {
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
    });
  }

  async createMessage(userId: number, channelId: number, message: MessageDto) {
    const errors = await validate(message);
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors));
    }
    return this.messageRepository.save({
      ...message,
      channelId,
      userId,
    });
  }
}

export const messagesService = new MessagesService();
