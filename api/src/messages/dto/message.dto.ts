import { ApiProperty } from '@nestjs/swagger';
import { MessageEntity } from '../entities/message.entity';

export class MessageDto {
  constructor(payload: MessageEntity, userId?: string) {
    this.id = payload.id;
    this.content = payload.content;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
    this.fromId = payload.fromId;
    this.chatId = payload.chatId;
    this.imageUrl = payload.imageUrl;
    this.isRead = payload?.viewedBy.some((user) => user.id === userId) || null;
  }

  @ApiProperty({ example: 'uuid of message' })
  id: string;

  @ApiProperty({ example: 'message' })
  content: string;

  @ApiProperty({ example: 'url', nullable: true })
  imageUrl?: string;

  @ApiProperty({ example: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'uuid of user' })
  fromId: string;

  @ApiProperty({ example: 'uuid of chat' })
  chatId: string;

  @ApiProperty({ example: true, nullable: true })
  isRead?: boolean | null;
}
