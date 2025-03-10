import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PROPOSA_ACTION_TYPE } from '../proposal.constants';
import { Proposal } from './proposal.entity';
import { ProposalActionType } from '../proposal.types';

@Entity()
export class ProposalAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PROPOSA_ACTION_TYPE })
  actionType: ProposalActionType;

  // TODO: Uncomment when ProposalActionRole is defined
  // @OneToOne(
  //   () => ProposalActionRole,
  //   (proposedRole) => proposedRole.proposalAction,
  //   {
  //     cascade: true,
  //     nullable: true,
  //   },
  // )
  // role?: ProposalActionRole;

  @OneToOne(() => Proposal, (proposal) => proposal.action, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  proposal: Proposal;

  @Column()
  proposalId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
