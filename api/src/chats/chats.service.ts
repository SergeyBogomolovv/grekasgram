import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ChatDto } from './dto/chat.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserEntity } from 'src/users/entities/user.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>,
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

  async getUserChats(userId: string): Promise<ChatDto[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { chats: { messages: { viewedBy: true }, users: true } },
      order: { chats: { messages: { createdAt: 'DESC' } } },
    });

    if (!user) throw new NotFoundException('User not found');

    return user.chats.map((chat) => new ChatDto(chat, userId));
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

    await this.cache.del(chatId);

    return this.chatsRepository.remove(chat);
  }

  async findOne(chatId: string): Promise<ChatEntity> {
    const cached = await this.cache.get<ChatEntity>(chatId);
    if (cached) return cached;
    const chat = await this.chatsRepository.findOne({ where: { id: chatId } });
    if (chat) await this.cache.set(chatId, chat);
    return chat;
  }
}
