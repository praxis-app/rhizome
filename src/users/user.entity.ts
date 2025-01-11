import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelMember } from '../channels/models/channel-member.entity';
import { Message } from '../messages/message.entity';

export enum UserStatus {
  ANONYMOUS = 'anonymous',
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
  BANNED = 'banned',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  displayName: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ type: 'varchar', nullable: true })
  bio: string | null;

  // TODO: Replace with dedicated boolean columns
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ANONYMOUS,
  })
  status: UserStatus;

  @Column({ default: false })
  locked: boolean;

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
