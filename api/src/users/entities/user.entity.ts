import { RefreshTokenEntity } from '../../tokens/entities/refresh-token.entity';
import { ChatEntity } from '../../chats/entities/chat.entity';
import { MessageEntity } from '../../messages/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
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

  @OneToMany(() => MessageEntity, (message) => message.from)
  messages: MessageEntity[];

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokenEntity[];

  @ManyToMany(() => ChatEntity, (chat) => chat.users)
  @JoinTable({ name: 'chat_members' })
  chats: ChatEntity[];

  @ManyToMany(() => ChatEntity)
  @JoinTable({ name: 'user_favorites' })
  favorites: ChatEntity[];
}
