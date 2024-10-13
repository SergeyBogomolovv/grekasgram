import { ApiProperty } from '@nestjs/swagger';
import { RefreshTokenDto } from 'src/tokens/dto/refresh-token.dto';

export class SessionsResponse {
  @ApiProperty({ type: () => RefreshTokenDto })
  current: RefreshTokenDto;

  @ApiProperty({ type: () => [RefreshTokenDto] })
  other: RefreshTokenDto[];
}
