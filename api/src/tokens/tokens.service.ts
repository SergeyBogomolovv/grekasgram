import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AccessTokenPayload } from './dto/access-token.payload';

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokensRepository: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
  ) {}

  signAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign({ ...payload }, { expiresIn: '15m' });
  }

  async resignAccessToken(refreshToken: string): Promise<string> {
    const token = await this.verifyRefreshToken(refreshToken);
    if (!token) throw new UnauthorizedException('Invalid token');
    return this.signAccessToken({ userId: token.userId });
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  async signRefreshToken(dto: CreateRefreshTokenDto): Promise<string> {
    const token = await this.createRefreshToken(dto);
    this.logger.debug(
      `Refresh token ${token.id} for user ${dto.userId} created`,
    );
    return this.jwtService.sign({ tokenId: token.id }, { expiresIn: '30d' });
  }

  async resignRefreshToken(tokenId: string): Promise<string> {
    const token = await this.getRefreshToken(tokenId);

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    const newToken = await this.refreshTokensRepository.save({
      ...token,
      expiresAt: new Date(Date.now() + this.tokenLifetime),
    });

    await this.cache.del(this.refreshTokenKey(tokenId));
    await this.cache.set(
      this.refreshTokenKey(newToken.id),
      newToken,
      this.tokenLifetime,
    );

    return this.jwtService.sign({ tokenId: newToken.id }, { expiresIn: '30d' });
  }

  async getUserRefreshTokens(userId: string): Promise<RefreshTokenDto[]> {
    const tokens = await this.refreshTokensRepository.find({
      where: { userId },
    });
    return tokens.map((token) => new RefreshTokenDto(token));
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenDto | null> {
    const { tokenId } = this.jwtService.verify(token);
    if (!tokenId) throw new UnauthorizedException('Invalid token');

    const refreshToken = await this.getRefreshToken(tokenId);
    if (!refreshToken) throw new UnauthorizedException('Invalid token');

    return new RefreshTokenDto(refreshToken);
  }

  async logoutFromOtherDevices(refreshToken: string): Promise<void> {
    const { id } = await this.verifyRefreshToken(refreshToken);
    const currentRefreshToken = await this.getRefreshToken(id);
    const userTokens = await this.refreshTokensRepository.find({
      where: { userId: currentRefreshToken.userId },
    });

    for (const token of userTokens) {
      if (token.id !== id) {
        await this.deleteRefreshToken(token.id);
      }
    }
  }

  async logout(refreshToken: string): Promise<void> {
    const { id } = await this.verifyRefreshToken(refreshToken);
    await this.deleteRefreshToken(id);
  }

  async deleteRefreshToken(tokenId: string): Promise<void> {
    await this.cache.del(this.refreshTokenKey(tokenId));
    await this.refreshTokensRepository.delete({ id: tokenId });
    this.logger.debug(`Refresh token ${tokenId} deleted`);
  }

  private async createRefreshToken(dto: CreateRefreshTokenDto) {
    const token = await this.refreshTokensRepository.save(
      this.refreshTokensRepository.create({
        ...dto,
        expiresAt: new Date(Date.now() + this.tokenLifetime),
      }),
    );

    await this.cache.set(
      this.refreshTokenKey(token.id),
      token,
      this.tokenLifetime,
    );

    return token;
  }

  private async getRefreshToken(
    tokenId: string,
  ): Promise<RefreshTokenEntity | null> {
    const cached = await this.cache.get<RefreshTokenEntity>(
      this.refreshTokenKey(tokenId),
    );
    if (cached) return cached;

    const token = await this.refreshTokensRepository.findOneBy({
      id: tokenId,
    });

    if (!token) return null;

    if (token.expiresAt < new Date()) {
      await this.deleteRefreshToken(tokenId);
      return null;
    }

    await this.cache.set(
      this.refreshTokenKey(tokenId),
      token,
      this.tokenLifetime,
    );

    return token;
  }

  private tokenLifetime = 1000 * 60 * 60 * 24 * 30;

  private refreshTokenKey(id: string) {
    return `refreshToken:${id}`;
  }
}
