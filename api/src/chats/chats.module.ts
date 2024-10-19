import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, UserEntity]),
    UsersModule,
    MessagesModule,
  ],
  providers: [ChatsService],
  controllers: [ChatsController],
  exports: [ChatsService, TypeOrmModule],
})
export class ChatsModule {}
