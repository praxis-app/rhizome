import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { User } from '../../users/user.entity';

@Entity()
export class ChannelMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'int' })
  lastMessageReadId: number | null;

  @ManyToOne(() => User, (user) => user.channelMembers, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Channel, (channel) => channel.members, {
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @Column()
  channelId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
