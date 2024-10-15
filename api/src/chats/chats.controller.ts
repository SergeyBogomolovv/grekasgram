import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { HttpAuthGuard } from 'src/auth/guards/http-auth.guard';
import { ChatDto } from './dto/chat.dto';
import { HttpUser } from 'src/auth/decorators/http-user.decorator';
import { MessageResponse } from 'src/common/message-response';
import { CreateChatResponse } from './dto/create-chat.response';

@ApiTags('chats')
@UseGuards(HttpAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiOperation({ summary: 'Создание чата' })
  @ApiCreatedResponse({ type: CreateChatResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiConflictResponse({
    description:
      'You cannot create chat with yourself and if chat already exists',
  })
  @Post('create')
  create(@Body() dto: CreateChatDto, @HttpUser('userId') userId: string) {
    return this.chatsService.createChat(userId, dto.companionId);
  }

  @ApiOperation({ summary: 'Добавление чата в избранное' })
  @ApiCreatedResponse({ type: MessageResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Chat or user not found' })
  @Post('add-to-favorites/:chatId')
  async addToFavorites(
    @Param('chatId') chatId: string,
    @HttpUser('userId') userId: string,
  ) {
    return this.chatsService.addToFavorites(chatId, userId);
  }

  @ApiOperation({ summary: 'Получение чатов' })
  @ApiOkResponse({ type: [ChatDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('my')
  getUserChats(@HttpUser('userId') userId: string): Promise<ChatDto[]> {
    return this.chatsService.getUserChats(userId);
  }

  @ApiOperation({ summary: 'Получение избранных чатов' })
  @ApiOkResponse({ type: [ChatDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('favorites')
  getUserFavorites(@HttpUser('userId') userId: string): Promise<ChatDto[]> {
    return this.chatsService.getUserFavorites(userId);
  }

  @ApiOperation({ summary: 'Получение чата по id' })
  @ApiOkResponse({ type: ChatDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('chat/:id')
  getChatById(
    @HttpUser('userId') userId: string,
    @Param('id') chatId: string,
  ): Promise<ChatDto> {
    return this.chatsService.getChatById(chatId, userId);
  }

  @ApiOperation({ summary: 'Удаление чата' })
  @ApiOkResponse({ type: MessageResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete('delete/:id')
  async deleteChat(
    @Param('id') chatId: string,
    @HttpUser('userId') userId: string,
  ): Promise<MessageResponse> {
    await this.chatsService.deleteChat(chatId, userId);
    return new MessageResponse('chat deleted successfully');
  }

  @ApiOperation({ summary: 'Удаление чата из избранного' })
  @ApiOkResponse({ type: MessageResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete('remove-from-favorites/:id')
  async removChatFromFavorites(
    @Param('id') chatId: string,
    @HttpUser('userId') userId: string,
  ): Promise<MessageResponse> {
    await this.chatsService.removeFromFavorites(chatId, userId);
    return new MessageResponse('Chat removed from favorites');
  }
}
