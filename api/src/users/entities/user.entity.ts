import { SessionEntity } from '../../sessions/entities/session.entity';
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

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  about?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  online: boolean;

  @Column({ default: new Date(), type: 'timestamp' })
  lastOnlineAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  emailConfirmed?: Date;

  @ManyToMany(() => ChatEntity, (chat) => chat.users)
  chats: ChatEntity[];

  @OneToMany(() => MessageEntity, (message) => message.from)
  messages: MessageEntity[];

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];
}
