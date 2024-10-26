import { ChatEntity } from '../../chats/entities/chat.entity';
import { UserEntity } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'message' })
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'message_viewed_by' })
  viewedBy: UserEntity[];

  @ManyToOne(() => UserEntity, (user) => user.messages)
  from: UserEntity;

  @Column()
  fromId: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages, {
    onDelete: 'CASCADE',
  })
  chat: ChatEntity;

  @Column()
  chatId: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
