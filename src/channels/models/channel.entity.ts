import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from '../../messages/message.entity';
import { ChannelMember } from './channel-member.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];

  @OneToMany(() => ChannelMember, (member) => member.channel, {
    cascade: true,
  })
  members: ChannelMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
