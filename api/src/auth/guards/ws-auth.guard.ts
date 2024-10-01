import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { Observable } from 'rxjs';
import { WsException } from '@nestjs/websockets';
import { SessionPayload } from '../entities/session';
import { parse } from 'cookie';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient();

    const token = parse(client.handshake.headers.cookie).session;

    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const user = this.jwtService.verify<SessionPayload>(token);
      if (!user) {
        throw new WsException('Unauthorized');
      }

      client.request['user'] = user;
      return true;
    } catch (error) {
      throw new WsException('Unauthorized');
    }
  }
}
