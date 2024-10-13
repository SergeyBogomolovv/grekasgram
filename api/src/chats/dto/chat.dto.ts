import { ApiProperty } from '@nestjs/swagger';
import { MessageDto } from 'src/messages/dto/message.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class ChatDto {
  constructor(payload: ChatDto) {
    this.id = payload.id;
    this.companion = payload.companion;
    this.createdAt = payload.createdAt;
    this.lastMessage = payload.lastMessage;
    this.newMessages = payload.newMessages;
  }

  @ApiProperty({ example: 'uuid of chat' })
  id: string;

  @ApiProperty({ type: () => UserDto })
  companion: UserDto;

  @ApiProperty({ type: () => MessageDto })
  lastMessage?: MessageDto;

  @ApiProperty({ type: Number, example: 3 })
  newMessages?: number;

  @ApiProperty({ example: 'timestamp' })
  createdAt: Date;
}
