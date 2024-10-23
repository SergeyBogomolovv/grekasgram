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
  ApiBearerAuth,
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
import { HttpUser } from 'src/auth/decorators/http-user.decorator';
import { MessageResponse } from 'src/common/message-response';
import { CreateChatResponse } from './dto/create-chat.response';
import { ChatPreviewDto } from './dto/chat-preview.dto';
import { ChatCompanionDto } from './dto/chat-companion.dto';

@ApiTags('chats')
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiOperation({ summary: 'Создание чата' })
  @ApiCreatedResponse({ type: CreateChatResponse })
  @ApiConflictResponse({
    description:
      'You cannot create chat with yourself and if chat already exists',
  })
  @Post('create')
  create(@Body() dto: CreateChatDto, @HttpUser('userId') userId: string) {
    return this.chatsService.createChat(userId, dto.companionId, dto.content);
  }

  @ApiOperation({ summary: 'Добавление чата в избранное' })
  @ApiCreatedResponse({ type: MessageResponse })
  @ApiNotFoundResponse({ description: 'Chat or user not found' })
  @Post('add-to-favorites/:chatId')
  async addToFavorites(
    @Param('chatId') chatId: string,
    @HttpUser('userId') userId: string,
  ) {
    return this.chatsService.addToFavorites(chatId, userId);
  }

  @ApiOperation({ summary: 'Получение чатов' })
  @ApiOkResponse({ type: [ChatPreviewDto] })
  @Get('my')
  getUserChats(@HttpUser('userId') userId: string): Promise<ChatPreviewDto[]> {
    return this.chatsService.getUserChats(userId);
  }

  @ApiOperation({ summary: 'Получение избранных чатов' })
  @ApiOkResponse({ type: [ChatPreviewDto] })
  @Get('favorites')
  getUserFavorites(
    @HttpUser('userId') userId: string,
  ): Promise<ChatPreviewDto[]> {
    return this.chatsService.getUserFavorites(userId);
  }

  @ApiOperation({ summary: 'Получение информации о собеседнике чата' })
  @ApiOkResponse({ type: ChatCompanionDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @Get('companion/:chatId')
  getChatById(
    @HttpUser('userId') userId: string,
    @Param('chatId') chatId: string,
  ): Promise<ChatCompanionDto> {
    return this.chatsService.getChatCompanion(chatId, userId);
  }

  @ApiOperation({ summary: 'Удаление чата' })
  @ApiOkResponse({ type: MessageResponse })
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
  @Delete('remove-from-favorites/:id')
  async removChatFromFavorites(
    @Param('id') chatId: string,
    @HttpUser('userId') userId: string,
  ): Promise<MessageResponse> {
    await this.chatsService.removeFromFavorites(chatId, userId);
    return new MessageResponse('Chat removed from favorites');
  }
}
