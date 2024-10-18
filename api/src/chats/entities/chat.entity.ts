import { MessageEntity } from '../../messages/entities/message.entity';
import { UserEntity } from '../../users/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'chat' })
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => UserEntity, (user) => user.chats, { onDelete: 'CASCADE' })
  users: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
