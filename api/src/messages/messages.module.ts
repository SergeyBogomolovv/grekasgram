import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { EventsModule } from 'src/events/events.module';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    EventsModule,
    FilesModule,
    UsersModule,
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService, TypeOrmModule],
})
export class MessagesModule {}
