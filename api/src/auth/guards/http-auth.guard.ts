import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(private sessionService: SessionsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const token = request.cookies.session;

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const session = await this.sessionService.verifySession(token);
      if (!session) {
        response.clearCookie('session');
        throw new UnauthorizedException('Unauthorized');
      }
      request['session'] = session;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
