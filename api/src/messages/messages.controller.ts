import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpAuthGuard } from 'src/auth/guards/http-auth.guard';
import { MessageDto } from './dto/message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { HttpUser } from 'src/auth/decorators/http-user.decorator';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageResponse } from 'src/common/message-response';

@ApiTags('messages')
@UseGuards(HttpAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Создание сообщения' })
  @ApiCreatedResponse({ type: MessageDto })
  @Post('create')
  createMessage(
    @Body() dto: CreateMessageDto,
    @HttpUser('userId') userId: string,
  ) {
    return this.messagesService.create(dto, userId);
  }

  @ApiOperation({ summary: 'Получение сообщений для чата' })
  @ApiOkResponse({ type: [MessageDto] })
  @ApiParam({ name: 'chatId', type: String })
  @Get(':chatId')
  getChatMessages(@Param('chatId') chatId: string): Promise<MessageDto[]> {
    return this.messagesService.getChatMessages(chatId);
  }

  @ApiOperation({ summary: 'Изменение сообщения' })
  @ApiOkResponse({ type: MessageResponse })
  @ApiParam({ name: 'messageId', type: String })
  @ApiForbiddenResponse({ description: 'not allowed to edit' })
  @ApiNotFoundResponse({ description: 'Message not found' })
  @Put('edit/:messageId')
  editMessage(
    @Body() dto: UpdateMessageDto,
    @Param('messageId') messageId: string,
    @HttpUser('userId') userId: string,
  ) {
    return this.messagesService.editMessage(messageId, dto, userId);
  }

  @ApiOperation({ summary: 'Удаление сообщения' })
  @ApiOkResponse({ type: MessageResponse })
  @ApiParam({ name: 'messageId', type: String })
  @ApiForbiddenResponse({ description: 'not allowed to delete' })
  @ApiNotFoundResponse({ description: 'Message not found' })
  @Delete('delete/:messageId')
  deleteMessage(
    @Param('messageId') messageId: string,
    @HttpUser('userId') userId: string,
  ) {
    return this.messagesService.deleteMessage(messageId, userId);
  }
}
