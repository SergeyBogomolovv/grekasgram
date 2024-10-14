import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';
import { ChatEntity } from '../entities/chat.entity';

export class ChatDto {
  constructor(chat: ChatEntity, userId: string) {
    this.id = chat.id;
    this.companion = new UserDto(
      chat?.users.find((user) => user.id !== userId),
    );
    this.lastActivity = chat?.messages[0]?.createdAt || chat.createdAt;
    this.lastMessage = chat?.messages[0]?.content;
    this.newMessages = chat?.messages?.filter(
      (message) => !message.viewedBy.some((user) => user.id === userId),
    ).length;
  }

  @ApiProperty({ example: 'uuid of chat' })
  id: string;

  @ApiProperty({ type: () => UserDto })
  companion: UserDto;

  @ApiProperty({ example: 'message' })
  lastMessage?: string;

  @ApiProperty({ type: Number, example: 3 })
  newMessages?: number;

  @ApiProperty({ example: 'timestamp' })
  lastActivity: Date;
}
