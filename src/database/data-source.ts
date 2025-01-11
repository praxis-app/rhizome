import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { ChannelMember } from '../channels/models/channel-member.entity';
import { Channel } from '../channels/models/channel.entity';
import { Image } from '../images/models/image.entity';
import { Message } from '../messages/message.entity';
import { Role } from '../roles/role.entity';
import { User } from '../users/user.entity';
import { AddUserTable1733010289874 } from './migrations/1733010289874-AddUserTable';

dotenv.config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_SCHEMA,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT as string),
  synchronize: process.env.NODE_ENV === 'development',
  entities: [User, Message, Channel, ChannelMember, Image, Role],
  migrations: [AddUserTable1733010289874],
});
