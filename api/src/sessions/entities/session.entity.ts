import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column()
  userId: string;

  @Column()
  device: string;

  @Column()
  ip: string;

  @CreateDateColumn()
  loginedAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
