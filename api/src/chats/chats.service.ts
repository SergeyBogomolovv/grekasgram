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
import { ChatCompanionDto } from './dto/chat-companion.dto';
import { MessageResponse } from 'src/common/message-response';
import { MessageEntity } from 'src/messages/entities/message.entity';
import { ChatPreviewDto } from './dto/chat-preview.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    private usersService: UsersService,
  ) {}

  async createChat(userId: string, companionId: string) {
    if (userId === companionId) {
      throw new ConflictException('You cannot create chat with yourself');
    }

    const existingChat = await this.chatsRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.users', 'user1', 'user1.id = :userId', { userId })
      .innerJoin('chat.users', 'user2', 'user2.id = :companionId', {
        companionId,
      })
      .getExists();

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

  async getUserChats(userId: string): Promise<ChatPreviewDto[]> {
    const chats = await this.chatsRepository
      .createQueryBuilder('chat')
      .select([
        'chat.id AS "chatId"',
        'chat.createdAt AS "createdAt"',
        'companion.id AS "companionId"',
        'companion.username AS "companionUsername"',
        'companion.avatarUrl AS "companionAvatarUrl"',
        'companion.online AS "companionOnline"',
        'companion.lastOnlineAt AS "companionLastOnlineAt"',
      ])
      .innerJoin('chat.users', 'user', 'user.id = :userId')
      .innerJoin('chat.users', 'companion', 'companion.id != :userId')
      .addSelect((qb) => {
        return qb
          .select('message.content', 'lastMessage')
          .from(MessageEntity, 'message')
          .where('message.chatId = chat.id')
          .orderBy('message.createdAt', 'DESC')
          .limit(1);
      }, 'lastMessage')
      .addSelect((qb) => {
        return qb
          .select('MAX(message.createdAt)', 'lastMessageAt')
          .from(MessageEntity, 'message')
          .where('message.chatId = chat.id');
      }, 'lastMessageAt')
      .addSelect((qb) => {
        return qb
          .select('COUNT(message.id)', 'newMessages')
          .from(MessageEntity, 'message')
          .leftJoin(
            'message_viewed_by',
            'viewedBy',
            'viewedBy.messageId = message.id AND viewedBy.userId = :userId',
          )
          .where('message.chatId = chat.id')
          .andWhere('message.fromId != :userId');
      }, 'newMessages')
      .orderBy('"lastMessageAt"', 'DESC', 'NULLS LAST')
      .addOrderBy('chat.createdAt', 'DESC')
      .setParameter('userId', userId)
      .getRawMany<ChatPreviewDto>();

    return chats;
  }

  async getChatCompanion(
    chatId: string,
    userId: string,
  ): Promise<ChatCompanionDto> {
    const chat = await this.chatsRepository
      .createQueryBuilder('chat')
      .select([
        'chat.id AS "chatId"',
        'chat.createdAt AS "createdAt"',
        'companion.id AS "companionId"',
        'companion.username AS "companionUsername"',
        'companion.avatarUrl AS "companionAvatarUrl"',
        'companion.online AS "companionOnline"',
        'companion.lastOnlineAt AS "companionLastOnlineAt"',
      ])
      .innerJoin('chat.users', 'user', 'user.id = :userId')
      .innerJoin('chat.users', 'companion', 'companion.id != :userId')
      .where('chat.id = :chatId', { chatId })
      .setParameter('userId', userId)
      .getRawOne<ChatCompanionDto>();

    if (!chat) throw new NotFoundException('Chat not found');

    return chat;
  }

  async getUserFavorites(userId: string): Promise<ChatPreviewDto[]> {
    const chats = await this.chatsRepository
      .createQueryBuilder('chat')
      .select([
        'chat.id AS "chatId"',
        'chat.createdAt AS "createdAt"',
        'companion.id AS "companionId"',
        'companion.username AS "companionUsername"',
        'companion.avatarUrl AS "companionAvatarUrl"',
        'companion.online AS "companionOnline"',
        'companion.lastOnlineAt AS "companionLastOnlineAt"',
      ])
      .innerJoin('chat.users', 'user', 'user.id = :userId')
      .innerJoin('chat.users', 'companion', 'companion.id != :userId')
      .innerJoin(
        'user_favorites',
        'favorite',
        'favorite.chatId = chat.id AND favorite.userId = :userId',
      )
      .addSelect((qb) => {
        return qb
          .select('message.content', 'lastMessage')
          .from(MessageEntity, 'message')
          .where('message.chatId = chat.id')
          .orderBy('message.createdAt', 'DESC')
          .limit(1);
      }, 'lastMessage')
      .addSelect((qb) => {
        return qb
          .select('MAX(message.createdAt)', 'lastMessageAt')
          .from(MessageEntity, 'message')
          .where('message.chatId = chat.id');
      }, 'lastMessageAt')
      .addSelect((qb) => {
        return qb
          .select('COUNT(message.id)', 'newMessages')
          .from(MessageEntity, 'message')
          .leftJoin(
            'message_viewed_by',
            'viewedBy',
            'viewedBy.messageId = message.id AND viewedBy.userId = :userId',
          )
          .where('message.chatId = chat.id')
          .andWhere('message.fromId != :userId');
      }, 'newMessages')
      .orderBy('"lastMessageAt"', 'DESC', 'NULLS LAST')
      .addOrderBy('chat.createdAt', 'DESC')
      .setParameter('userId', userId)
      .getRawMany<ChatPreviewDto>();

    return chats;
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
    const chat = await this.chatsRepository.findOne({ where: { id: chatId } });
    if (!chat) throw new NotFoundException('Chat not found');
    await this.usersService.addToFavorites(userId, chat);
    return new MessageResponse('Added to favorites');
  }

  async removeFromFavorites(chatId: string, userId: string) {
    await this.usersService.removeFromFavorites(userId, chatId);
    return new MessageResponse('Removed from favorites');
  }
}
