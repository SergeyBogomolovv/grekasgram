import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { SessionPayload } from '../entities/session';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const token = request.cookies.session;

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const { sessionId } = this.jwtService.verify(token);
      //TODO: from session service
      const user = await this.cache.get<SessionPayload>(sessionId);
      if (!user) {
        response.clearCookie('session');
        throw new UnauthorizedException('Unauthorized');
      }
      request['user'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
