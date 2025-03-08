import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelMember } from '../channels/models/channel-member.entity';
import { Invite } from '../invites/invite.entity';
import { Message } from '../messages/message.entity';
import { Proposal } from '../proposals/models/proposal.entity';
import { Role } from '../roles/models/role.entity';
import { Vote } from '../votes/vote.entity';

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

  @Column({ default: false })
  anonymous: boolean;

  @Column({ default: false })
  locked: boolean;

  @OneToMany(() => Proposal, (proposal) => proposal.user, {
    cascade: true,
  })
  proposals: Proposal[];

  @OneToMany(() => Vote, (vote) => vote.user, {
    cascade: true,
  })
  votes: Vote[];

  @OneToMany(() => Message, (message) => message.user, {
    cascade: true,
  })
  messages: Message[];

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.user, {
    cascade: true,
  })
  channelMembers: ChannelMember[];

  @ManyToMany(() => Role, (role) => role.members, {
    onDelete: 'CASCADE',
  })
  roles: Role[];

  @OneToMany(() => Invite, (invite) => invite.user, {
    cascade: true,
  })
  invites: Invite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
