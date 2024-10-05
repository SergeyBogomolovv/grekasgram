import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { SessionPayload } from '../entities/session';

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = request.cookies.session;

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const user = this.jwtService.verify<SessionPayload>(token);
      if (!user) throw new UnauthorizedException('Unauthorized');

      request['user'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
