import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from '../../messages/models/message.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  filename: string | null;

  @Column({ nullable: true, type: 'varchar' })
  imageType: string | null;

  @ManyToOne(() => Message, (message) => message.images, {
    onDelete: 'CASCADE',
  })
  message?: Message;

  @Column({ nullable: true, type: 'varchar' })
  messageId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
