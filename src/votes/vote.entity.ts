import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Proposal } from '../proposals/models/proposal.entity';
import { User } from '../users/user.entity';
import { VOTE_TYPES } from './vote.constants';
import { VoteType } from './vote.types';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: VOTE_TYPES })
  voteType: VoteType;

  @ManyToOne(() => Proposal, (proposal) => proposal.votes, {
    onDelete: 'CASCADE',
  })
  proposal?: Proposal;

  @Column({ type: 'varchar', nullable: true })
  proposalId: string | null;

  // TODO: Uncomment when QuestionnaireTicket is defined
  // @ManyToOne(
  //   () => QuestionnaireTicket,
  //   (questionnaireTicket) => questionnaireTicket.votes,
  //   {
  //     onDelete: 'CASCADE',
  //   },
  // )
  // questionnaireTicket?: QuestionnaireTicket;

  // TODO: Uncomment when QuestionnaireTicket is defined
  // @Column({ type: 'varchar', nullable: true })
  // questionnaireTicketId: string | null;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  // TODO: Uncomment when Notification is defined
  // @OneToMany(() => Notification, (notification) => notification.vote)
  // notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
