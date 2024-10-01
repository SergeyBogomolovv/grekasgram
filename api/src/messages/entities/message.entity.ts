import { ChatEntity } from '../../chats/entities/chat.entity';
import { UserEntity } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  from: UserEntity;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  chat: ChatEntity;

  @CreateDateColumn()
  createdAt: Date;
}
