import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelMember } from '../channels/models/channel-member.entity';
import { Message } from '../messages/models/message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ unique: true })
  clientId: string;

  @OneToMany(() => Message, (message) => message.user, {
    cascade: true,
  })
  messages: Message[];

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.user, {
    cascade: true,
  })
  channelMembers: ChannelMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
