import { ApiProperty } from '@nestjs/swagger';

export class ChatPreviewDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID чата',
  })
  chatId: string;

  @ApiProperty({
    example: '2024-10-18T08:30:00Z',
    description: 'Дата создания чата',
  })
  createdAt: Date;

  @ApiProperty({
    example: '456e7890-e12b-34c5-a456-426614174111',
    description: 'ID компаньона по чату',
  })
  companionId: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Имя пользователя компаньона',
  })
  companionUsername: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL аватара компаньона',
    nullable: true,
  })
  companionAvatarUrl?: string;

  @ApiProperty({ example: true, description: 'Компаньон онлайн или нет' })
  companionOnline: boolean;

  @ApiProperty({
    example: '2024-10-18T08:30:00Z',
    description: 'Время последнего появления компаньона онлайн',
  })
  companionLastOnlineAt: Date;

  @ApiProperty({
    example: 'Последнее сообщение в чате',
    description: 'Контент последнего сообщения',
    nullable: true,
  })
  lastMessage?: string;

  @ApiProperty({
    example: '2024-10-18T08:30:00Z',
    description: 'Время отправки последнего сообщения',
  })
  lastMessageAt: Date;

  @ApiProperty({ example: 5, description: 'Количество новых сообщений' })
  newMessages: number;
}
