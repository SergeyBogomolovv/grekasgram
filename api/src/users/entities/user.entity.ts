import { ChatEntity } from '../../chats/entities/chat.entity';
import { MessageEntity } from '../../messages/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, type: 'timestamp' })
  emailConfirmed: Date;

  @ManyToMany(() => ChatEntity, (chat) => chat.users)
  chats: ChatEntity[];

  @OneToMany(() => MessageEntity, (message) => message.from)
  messages: MessageEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
