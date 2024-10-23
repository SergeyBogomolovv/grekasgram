import { UserEntity } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
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
