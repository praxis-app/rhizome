/**
 * Used for reference:
 * - https://github.com/forrestwilkins/anrcho/blob/master/app/models/proposal.rb
 * - https://github.com/praxis-app/praxis/blob/main/src/proposals/models/proposal.model.ts
 */

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from '../../images/models/image.entity';
import { User } from '../../users/user.entity';
import { Vote } from '../../votes/vote.entity';
import { PROPOSAL_STAGE } from '../proposal.constants';
import { ProposalStage } from '../proposal.types';
import { ProposalAction } from './proposal-action.entity';
import { ProposalConfig } from './proposal-config.entity';

@Entity()
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  body: string | null;

  @Column({ type: 'enum', default: 'voting', enum: PROPOSAL_STAGE })
  stage: ProposalStage;

  @OneToOne(() => ProposalAction, (action) => action.proposal, {
    cascade: true,
  })
  action: ProposalAction;

  @OneToOne(() => ProposalConfig, (proposalConfig) => proposalConfig.proposal, {
    cascade: true,
  })
  config: ProposalConfig;

  @OneToMany(() => Vote, (vote) => vote.proposal, {
    cascade: true,
  })
  votes: Vote[];

  @OneToMany(() => Image, (image) => image.proposal, {
    cascade: true,
  })
  images: Image[];

  @ManyToOne(() => User, (user) => user.proposals, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
