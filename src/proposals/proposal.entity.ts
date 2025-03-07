// Used for reference: https://github.com/forrestwilkins/anrcho/blob/master/app/models/proposal.rb

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from '../images/models/image.entity';
import { User } from '../users/user.entity';
import { ProposalStage } from './proposals.constants';

@Entity()
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  body: string | null;

  @Column({ type: 'varchar', default: ProposalStage.Voting })
  stage: ProposalStage;

  // TODO: Uncomment when ProposalAction is defined
  // @OneToOne(() => ProposalAction, (action) => action.proposal, {
  //   cascade: true,
  // })
  // action: ProposalAction;

  // TODO: Uncomment when ProposalConfig is defined
  // @OneToOne(() => ProposalConfig, (proposalConfig) => proposalConfig.proposal, {
  //   cascade: true,
  // })
  // config: ProposalConfig;

  // TODO: Uncomment when Vote is defined
  // @OneToMany(() => Vote, (vote) => vote.proposal, {
  //   cascade: true,
  // })
  // votes: Vote[];

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
