import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DECISION_MAKING_MODEL } from '../proposals/proposal.constants';
import { DecisionMakingModel } from '../proposals/proposal.types';
import { VotingTimeLimit } from '../votes/vote.constants';

@Entity()
export class ServerConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: DECISION_MAKING_MODEL, default: 'consensus' })
  decisionMakingModel: DecisionMakingModel;

  @Column({ default: 2 })
  standAsidesLimit: number;

  @Column({ default: 2 })
  reservationsLimit: number;

  @Column({ default: 51 })
  ratificationThreshold: number;

  @Column({ default: 51 })
  verificationThreshold: number;

  @Column({ default: VotingTimeLimit.Unlimited })
  votingTimeLimit: number;

  /**
   * The base URL for the Discord bot's API endpoints
   */
  @Column({ type: 'varchar', nullable: true })
  botApiUrl: string | null;

  /**
   * The client ID for the Discord bot
   */
  @Column({ type: 'varchar', nullable: true })
  botClientId: string | null;

  /**
   * The API key used by the bot when making requests to the Praxis instance
   */
  @Column({ type: 'varchar', nullable: true })
  botApiKey: string | null;

  /**
   * The API key used by Praxis to authenticate its calls to the bots endpoints
   */
  @Column({ type: 'varchar', nullable: true })
  appApiKey: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
