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
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: true, type: 'int' })
  lastMessageReadId: number | null;

  @ManyToOne(() => User, (user) => user.channelMembers, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Channel, (channel) => channel.members, {
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @Column()
  channelId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
