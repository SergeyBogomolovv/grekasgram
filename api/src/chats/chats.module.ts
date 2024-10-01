import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
    UsersModule,
    MessagesModule,
  ],
  providers: [ChatsGateway, ChatsService],
  controllers: [ChatsController],
  exports: [ChatsService, TypeOrmModule],
})
export class ChatsModule {}
