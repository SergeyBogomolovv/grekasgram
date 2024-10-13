import { IsIP, IsString, IsUUID } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsUUID()
  userId: string;

  @IsString()
  device: string;

  @IsIP(4)
  ip: string;
}
