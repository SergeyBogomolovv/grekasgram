import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateSessionDto } from './dto/create-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SessionsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async generateSession(dto: CreateSessionDto): Promise<string> {
    const session = await this.sessionsRepository.save({
      ...this.sessionsRepository.create(dto),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    await this.cache.set(session.id, session);
    return this.jwtService.sign({ sessionId: session.id });
  }

  getUserSessions(userId: string): Promise<SessionEntity[]> {
    return this.sessionsRepository.find({
      where: { userId },
    });
  }

  async getSession(sessionId: string): Promise<SessionEntity | null> {
    const cachedSession = await this.cache.get<SessionEntity>(sessionId);
    if (cachedSession) return cachedSession;

    const session = await this.sessionsRepository.findOneBy({ id: sessionId });

    if (!session) return null;

    await this.cache.set(sessionId, session);

    if (session.expiresAt < new Date()) {
      await this.deleteSession(sessionId);
      return null;
    }

    return session;
  }

  verifySession(token: string): Promise<SessionEntity | null> {
    const { sessionId } = this.jwtService.verify(token);
    return this.getSession(sessionId);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.cache.del(sessionId);
    await this.sessionsRepository.delete({ id: sessionId });
  }

  async updateSession(session: SessionEntity): Promise<string> {
    await this.cache.set(session.id, session);
    const newSession = await this.sessionsRepository.save(session);

    return this.jwtService.sign({ sessionId: newSession.id });
  }
}
