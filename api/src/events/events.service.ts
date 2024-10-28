import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMessageDto } from 'src/messages/dto/update-message.dto';
import { MessagesService } from 'src/messages/messages.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => MessagesService))
    private messagesService: MessagesService,
  ) {}

  async getUserChatIds(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { chats: true },
    });

    return user?.chats?.map((chat) => chat.id);
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

  updateMessage(dto: UpdateMessageDto, userId: string) {
    return this.messagesService.editMessage(dto, userId);
  }

  deleteMessage(messageId: string, userId: string) {
    return this.messagesService.deleteMessage(messageId, userId);
  }

  viewMessage(messageId: string, userId: string) {
    return this.messagesService.viewMessage(messageId, userId);
  }
}
