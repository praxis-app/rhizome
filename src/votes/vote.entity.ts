import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Proposal } from '../proposals/proposal.entity';
import { User } from '../users/user.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: Convert to PG enum
  @Column()
  voteType: string;

  @ManyToOne(() => Proposal, (proposal) => proposal.votes, {
    onDelete: 'CASCADE',
  })
  proposal?: Proposal;

  @Column({ nullable: true })
  proposalId?: number;

  // TODO: Uncomment when QuestionnaireTicket is defined
  // @ManyToOne(
  //   () => QuestionnaireTicket,
  //   (questionnaireTicket) => questionnaireTicket.votes,
  //   {
  //     onDelete: 'CASCADE',
  //   },
  // )
  // questionnaireTicket?: QuestionnaireTicket;

  @Column({ nullable: true })
  questionnaireTicketId?: number;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  // TODO: Uncomment when Notification is defined
  // @OneToMany(() => Notification, (notification) => notification.vote)
  // notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
