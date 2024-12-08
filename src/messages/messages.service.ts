import { Repository } from 'typeorm';
import { dataSource } from '../database/data-source';
import { Message } from './message.entity';

export class MessagesService {
  private messageRepository: Repository<Message>;

  constructor() {
    this.messageRepository = dataSource.getRepository(Message);
  }

  getMessages() {
    return this.messageRepository.find();
  }
}

export const messagesService = new MessagesService();
