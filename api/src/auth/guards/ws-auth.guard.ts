import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private sessionService: SessionsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();

    const token = parse(client.handshake.headers.cookie).session;

    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const session = await this.sessionService.verifySession(token);
      if (!session) {
        client.disconnect();
        throw new WsException('Unauthorized');
      }

      client.request['session'] = session;
      return true;
    } catch (error) {
      throw new WsException('Unauthorized');
    }
  }
}
