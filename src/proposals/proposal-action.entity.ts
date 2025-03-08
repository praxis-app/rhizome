import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Proposal } from './proposal.entity';

@Entity()
export class ProposalAction {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: Uncomment and implement with PG enum type
  // @Column({ type: 'varchar' })
  // actionType: ProposalActionType;

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
  proposalId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
