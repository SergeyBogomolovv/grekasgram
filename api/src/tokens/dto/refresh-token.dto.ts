import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  constructor(payload: RefreshTokenDto) {
    this.id = payload.id;
    this.userId = payload.userId;
    this.device = payload.device;
    this.ip = payload.ip;
    this.loginedAt = payload.loginedAt;
  }
  @ApiProperty({ description: 'ID', example: 'uuid of session' })
  id: string;

  @ApiProperty({ description: 'UserId', example: 'uuid of user' })
  userId: string;

  @ApiProperty({ description: 'Device', example: 'browser' })
  device: string;

  @ApiProperty({ description: 'Ip', example: '127.0.0.1' })
  ip: string;

  @ApiProperty({ description: 'LoginedAt', example: 'timestamp' })
  loginedAt: Date;
}
