import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ChatDto } from './dto/chat.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { MessageResponse } from 'src/common/message-response';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private usersService: UsersService,
  ) {}

  async createChat(userId: string, companionId: string) {
    if (userId === companionId) {
      throw new ConflictException('You cannot create chat with yourself');
    }

    const existingChat = await this.chatsRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.users', 'user')
      .where('user.id IN (:...ids)', { ids: [userId, companionId] })
      .groupBy('chat.id')
      .having('COUNT(user.id) = 2')
      .getOne();

    console.log(existingChat);
    if (existingChat) {
      throw new ConflictException('Chat between these users already exists');
    }

    const [user, companion] = await Promise.all([
      this.usersService.findOneByIdOrFail(userId),
      this.usersService.findOneByIdOrFail(companionId),
    ]);
    const chat = await this.chatsRepository.save(
      this.chatsRepository.create({ users: [user, companion] }),
    );

    return { chatId: chat.id };
  }

  //TODO: optimize query
  async getUserChats(userId: string): Promise<ChatDto[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { chats: { messages: { viewedBy: true }, users: true } },
      order: { chats: { messages: { createdAt: 'DESC' } } },
    });

    if (!user) throw new NotFoundException('User not found');

    return user.chats.map((chat) => new ChatDto(chat, userId));
  }

  async getChatById(chatId: string, userId: string): Promise<ChatDto> {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      relations: { users: true, messages: { viewedBy: true } },
      order: { messages: { createdAt: 'DESC' } },
    });

    if (!chat) throw new NotFoundException('Chat not found');

    return new ChatDto(chat, userId);
  }

  //TODO: optimize query
  async getUserFavorites(userId: string): Promise<ChatDto[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { favorites: { messages: { viewedBy: true }, users: true } },
      order: { favorites: { messages: { createdAt: 'DESC' } } },
    });

    if (!user) throw new NotFoundException('User not found');

    return user.favorites.map((chat) => new ChatDto(chat, userId));
  }

  async deleteChat(chatId: string, userId: string): Promise<ChatEntity> {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      relations: { users: true },
    });

    if (!chat) throw new NotFoundException('Chat not found');

    if (!chat.users.some((user) => user.id === userId)) {
      throw new ForbiddenException('You are not a part of this chat');
    }

    return this.chatsRepository.remove(chat);
  }

  async addToFavorites(chatId: string, userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { favorites: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const chat = await this.chatsRepository.findOne({ where: { id: chatId } });
    if (!chat) throw new NotFoundException('Chat not found');

    user.favorites.push(chat);
    await this.usersRepository.save(user);
    return new MessageResponse('Added to favorites');
  }

  async removeFromFavorites(chatId: string, userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { favorites: true },
    });
    if (!user) throw new NotFoundException('User not found');

    user.favorites = user.favorites.filter((chat) => chat.id !== chatId);
    await this.usersRepository.save(user);
    return new MessageResponse('Removed from favorites');
  }
}
