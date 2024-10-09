import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateSessionDto } from './dto/create-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SessionDto } from './dto/session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async generateSession(dto: CreateSessionDto): Promise<string> {
    const session = await this.createSession(dto);
    return this.jwtService.sign({ sessionId: session.id });
  }

  async getUserSessions(userId: string): Promise<SessionDto[]> {
    const sessions = await this.sessionsRepository.find({
      where: { userId },
    });
    return sessions.map((session) => new SessionDto(session));
  }

  verifySession(token: string): Promise<SessionEntity | null> {
    try {
      const { sessionId } = this.jwtService.verify(token);
      if (!sessionId) return null;

      return this.getSession(sessionId);
    } catch (error) {
      return null;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.cache.del(this.sessionKey(sessionId));
    await this.sessionsRepository.delete({ id: sessionId });
  }

  async renewSession(sessionId: string): Promise<string> {
    const session = await this.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException('Invalid token');
    }

    const newSession = await this.sessionsRepository.save({
      ...session,
      expiresAt: new Date(Date.now() + this.sessionLifetime),
    });

    return this.jwtService.sign({ sessionId: newSession.id });
  }

  private async createSession(dto: CreateSessionDto) {
    const session = await this.sessionsRepository.save({
      ...this.sessionsRepository.create(dto),
      expiresAt: new Date(Date.now() + this.sessionLifetime),
    });
    await this.cache.set(
      this.sessionKey(session.id),
      session,
      this.sessionLifetime,
    );
    return session;
  }

  private async getSession(sessionId: string): Promise<SessionEntity | null> {
    const cachedSession = await this.cache.get<SessionEntity>(
      this.sessionKey(sessionId),
    );
    if (cachedSession) return cachedSession;

    const session = await this.sessionsRepository.findOneBy({ id: sessionId });

    if (!session) return null;

    await this.cache.set(
      this.sessionKey(sessionId),
      session,
      this.sessionLifetime,
    );

    if (session.expiresAt < new Date()) {
      await this.deleteSession(sessionId);
      return null;
    }

    return session;
  }

  private sessionLifetime = 1000 * 60 * 60 * 24 * 30;

  private sessionKey(id: string) {
    return `session:${id}`;
  }
}
