import { MessageEntity } from '../../messages/entities/message.entity';
import { UserEntity } from '../../users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'chat' })
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => UserEntity, (user) => user.chats)
  @JoinTable({ name: 'chat_members' })
  users: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
