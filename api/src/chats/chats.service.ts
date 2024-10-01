import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    private usersService: UsersService,
  ) {}

  async createChat(title: string, userId: string, currentUserId: string) {
    if (userId === currentUserId) {
      throw new ConflictException('You can not create chat with yourself');
    }

    const [user, currentUser] = await Promise.all([
      this.usersService.findOneByIdOrFail(userId),
      this.usersService.findOneByIdOrFail(currentUserId),
    ]);

    const chat = new ChatEntity();
    chat.title = title;
    chat.users = [user, currentUser];
    return this.chatsRepository.save(chat);
  }

  async updateChatTitle(id: string, title: string) {
    const chat = await this.chatsRepository.findOne({ where: { id } });
    chat.title = title;
    return this.chatsRepository.save(chat);
  }

  getUserChatIds(userId: string) {
    return this.usersService.findOneById(userId);
  }
}
