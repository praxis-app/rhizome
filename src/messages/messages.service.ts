import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import * as channelsService from '../channels/channels.service';
import { sanitizeText } from '../common/common.utils';
import { dataSource } from '../database/data-source';
import { Image } from '../images/models/image.entity';
import { pubSubService } from '../pub-sub/pub-sub.service';
import { User } from '../users/user.entity';
import { Message } from './message.entity';

const MESSAGE_BODY_MAX = 6000;
const MESSAGE_IMAGE_COUNT_MAX = 5;

enum MessageType {
  MESSAGE = 'message',
  IMAGE = 'image',
}

interface CreateMessageReq {
  body?: string;
  channelId: string;
  imageCount: number;
}

class MessagesService {
  private messageRepository: Repository<Message>;
  private imageRepository: Repository<Image>;

  constructor() {
    this.messageRepository = dataSource.getRepository(Message);
    this.imageRepository = dataSource.getRepository(Image);
  }

  async getMessages(channelId: string, offset?: number, limit?: number) {
    const messages = await this.messageRepository.find({
      where: { channelId },
      relations: ['user', 'images'],
      select: {
        id: true,
        body: true,
        user: {
          id: true,
          name: true,
        },
        images: {
          id: true,
          filename: true,
          createdAt: true,
        },
        createdAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: offset,
      take: limit,
    });

    return messages.map((message) => ({
      ...message,
      images: message.images.map((image) => {
        return {
          id: image.id,
          isPlaceholder: !image.filename,
          createdAt: image.createdAt,
        };
      }),
    }));
  }

  async createMessage({ body, imageCount, ...messageData }: CreateMessageReq, user: User) {
    const message = await this.messageRepository.save({
      body: sanitizeText(body),
      userId: user.id,
      ...messageData,
    });
    let images: Image[] = [];

    if (imageCount) {
      const imagePlaceholders = Array.from({ length: imageCount }).map(() => {
        return this.imageRepository.create({ messageId: message.id });
      });
      images = await this.imageRepository.save(imagePlaceholders);
    }
    const shapedImages = images.map((image) => ({
      id: image.id,
      isPlaceholder: true,
      createdAt: image.createdAt,
    }));
    const messagePayload = {
      ...message,
      images: shapedImages,
      user: { id: user.id, name: user.name },
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

  validateMessage(req: Request, res: Response, next: NextFunction) {
    const message = req.body as CreateMessageReq;
    if (typeof message.channelId !== 'string') {
      res.status(400).send('Channel ID must be a string');
      return;
    }
    if (typeof message.imageCount !== 'number') {
      res.status(400).send('Image count must be a number');
      return;
    }
    if (message.imageCount < 0 || message.imageCount > MESSAGE_IMAGE_COUNT_MAX) {
      res.status(400).send(`Image count must be between 0 and ${MESSAGE_IMAGE_COUNT_MAX}`);
      return;
    }
    if (message.body && typeof message.body !== 'string') {
      res.status(400).send('Message body must be a string');
      return;
    }
    const sanitizedBody = sanitizeText(message.body);
    if (message.body && sanitizedBody.length > MESSAGE_BODY_MAX) {
      res.status(400).send(`Message body cannot exceed ${MESSAGE_BODY_MAX} characters`);
      return;
    }
    if (!sanitizedBody && !message.imageCount) {
      res.status(400).send('Message body or images are required');
      return;
    }
    next();
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
        isPlaceholder: false,
        messageId,
        imageId,
      });
    }
    return image;
  }

  getChannelKey(channelId: string, userId: string) {
    return `channel-${channelId}-${userId}`;
  }
}

export const messagesService = new MessagesService();
