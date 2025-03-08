// Used for reference: https://github.com/forrestwilkins/anrcho/blob/master/app/models/proposal.rb

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

@Entity()
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  body: string | null;

  @Column({ type: 'enum', default: 'voting', enum: PROPOSAL_STAGE })
  stage: ProposalStage;

  @OneToOne(() => ProposalAction, (action) => action.proposal, {
    cascade: true,
  })
  action: ProposalAction;

  // TODO: Uncomment when ProposalConfig is defined
  // @OneToOne(() => ProposalConfig, (proposalConfig) => proposalConfig.proposal, {
  //   cascade: true,
  // })
  // config: ProposalConfig;

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
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
