import { ApiProperty } from '@nestjs/swagger';
import { MessageEntity } from '../entities/message.entity';

export class MessageDto {
  constructor(payload: MessageEntity) {
    this.id = payload.id;
    this.content = payload.content;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
    this.fromId = payload.fromId;
    this.chatId = payload.chatId;
    this.viewedBy = payload.viewedBy.map((user) => user.id);
  }

  @ApiProperty({ example: 'uuid of message' })
  id: string;

  @ApiProperty({ example: 'message' })
  content: string;

  @ApiProperty({ example: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'uuid of user' })
  fromId: string;

  @ApiProperty({ example: 'uuid of chat' })
  chatId: string;

  @ApiProperty({ type: () => [String] })
  viewedBy: string[];
}
