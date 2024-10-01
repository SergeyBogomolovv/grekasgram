import { MessageEntity } from 'src/messages/entities/message.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToMany(() => UserEntity, (user) => user.chats)
  @JoinTable({ name: 'Users_Chats' })
  users: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
