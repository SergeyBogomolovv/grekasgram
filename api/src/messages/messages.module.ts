import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  providers: [MessagesService],
  exports: [MessagesService, TypeOrmModule],
})
export class MessagesModule {}
