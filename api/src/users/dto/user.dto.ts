import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  constructor(payload: UserDto) {
    this.id = payload.id;
    this.username = payload.username;
    this.email = payload.email;
    this.avatarUrl = payload.avatarUrl;
    this.about = payload.about;
    this.createdAt = payload.createdAt;
    this.online = payload.online;
    this.lastOnlineAt = payload.lastOnlineAt;
  }

  @ApiProperty({ description: 'ID', example: 'uuid of user' })
  id: string;

  @ApiProperty({ description: 'Username', example: 'griffit' })
  username: string;

  @ApiProperty({ description: 'Email', example: 'email@email.com' })
  email: string;

  @ApiProperty({ description: 'AvatarUrl', example: 'http://', nullable: true })
  avatarUrl?: string;

  @ApiProperty({ description: 'About', example: '123', nullable: true })
  about?: string;

  @ApiProperty({ description: 'CreatedAt', example: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'online', example: false })
  online: boolean;

  @ApiProperty({ description: 'lastOnlineAt', example: 'timestamp' })
  lastOnlineAt: Date;
}
