import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
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
import { HttpUser } from 'src/auth/decorators/http-user.decorator';

@ApiTags('messages')
@UseGuards(HttpAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Получение сообщений для чата' })
  @ApiOkResponse({ type: [MessageDto] })
  @ApiParam({ name: 'chatId', type: String })
  @Get(':chatId')
  getChatMessages(
    @Param('chatId') chatId: string,
    @HttpUser('userId') userId: string,
  ): Promise<MessageDto[]> {
    return this.messagesService.getChatMessages(chatId, userId);
  }

  @ApiOperation({ summary: 'Пометка сообщения как прочитанное' })
  @ApiOkResponse({ type: MessageDto })
  @ApiParam({ name: 'messageId', type: String })
  @ApiForbiddenResponse({ description: 'not allowed' })
  @ApiNotFoundResponse({ description: 'Message not found' })
  @Patch('view/:messageId')
  viewMessage(
    @Param('messageId') messageId: string,
    @HttpUser('userId') userId: string,
  ) {
    return this.messagesService.viewMessage(messageId, userId);
  }
}
