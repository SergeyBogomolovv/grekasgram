import { ApiProperty } from '@nestjs/swagger';

export class ChatCompanionDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID чата',
  })
  chatId: string;

  @ApiProperty({
    example: '2024-10-18T08:30:00Z',
    description: 'Время создания чата',
  })
  createdAt: Date;

  @ApiProperty({
    example: '456e7890-e12b-34c5-a456-426614174111',
    description: 'ID собеседника',
  })
  companionId: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Имя пользователя собеседника',
  })
  companionUsername: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL аватара собеседника',
    nullable: true,
  })
  companionAvatarUrl?: string;

  @ApiProperty({ example: true, description: 'Собеседник онлайн или нет' })
  companionOnline: boolean;

  @ApiProperty({
    example: '2024-10-18T08:30:00Z',
    description: 'Время последнего появления собеседника онлайн',
  })
  companionLastOnlineAt: Date;
}
