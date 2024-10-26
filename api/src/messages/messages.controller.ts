import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
  @ApiQuery({ name: 'cursor', type: Date })
  @ApiQuery({ name: 'count', type: Number })
  @Get(':chatId')
  getChatMessages(
    @Param('chatId') chatId: string,
    @HttpUser('userId') userId: string,
    @Query('cursor') cursor: Date,
    @Query('count') count: number,
  ): Promise<MessageDto[]> {
    return this.messagesService.getChatMessages(chatId, userId, cursor, count);
  }
}
