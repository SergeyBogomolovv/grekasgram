import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { UpdateMessageDto } from 'src/messages/dto/update-message.dto';
import { MessagesService } from 'src/messages/messages.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private messagesService: MessagesService,
  ) {}

  async getUserChatIds(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { chats: true },
    });

    return user.chats.map((chat) => chat.id);
  }

  async setOnline(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    user.online = true;
    await this.usersRepository.save(user);
  }

  async setOffline(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    user.online = false;
    user.lastOnlineAt = new Date();
    await this.usersRepository.save(user);
  }

  sendMessage(dto: CreateMessageDto, userId: string) {
    return this.messagesService.create(dto, userId);
  }

  updateMessage(dto: UpdateMessageDto, userId: string) {
    return this.messagesService.editMessage(dto, userId);
  }

  deleteMessage(messageId: string, userId: string) {
    return this.messagesService.deleteMessage(messageId, userId);
  }
}
