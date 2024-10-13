import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ChatDto } from './dto/chat.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    private usersService: UsersService,
  ) {}

  async createChat(userId: string, companionId: string): Promise<ChatDto> {
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

    return new ChatDto({
      createdAt: chat.createdAt,
      id: chat.id,
      companion: new UserDto(companion),
    });
  }

  async getUserChats(userId: string): Promise<ChatDto[]> {
    const userChats = await this.chatsRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['users'],
    });

    const chats = await Promise.all(
      userChats.map((chat) =>
        this.chatsRepository.findOne({
          where: { id: chat.id },
          relations: ['users'],
        }),
      ),
    );

    return chats.map(
      (chat) =>
        new ChatDto({
          createdAt: chat.createdAt,
          id: chat.id,
          companion: chat.users.find((user) => user.id !== userId),
        }),
    );
  }

  async deleteChat(chatId: string, userId: string): Promise<ChatEntity> {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId, users: { id: userId } },
    });
    if (!chat) throw new NotFoundException('Chat not found');

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
