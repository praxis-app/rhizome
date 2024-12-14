import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from '../../channels/models/channel.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  body: string | null;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Channel, (channel) => channel.messages, {
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
