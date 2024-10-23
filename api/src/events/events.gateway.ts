import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { EventsService } from './events.service';
import { Socket } from 'socket.io';
import { TokensService } from 'src/tokens/tokens.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Socket;
  constructor(
    private readonly eventsService: EventsService,
    private readonly tokensService: TokensService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.accessToken;

      client.data.user = await this.tokensService.verifyAccessToken(token);

      const chatIds = await this.eventsService.getUserChatIds(
        client.data.user.userId,
      );

      client.join(chatIds);

      await this.eventsService.setOnline(client.data.user.userId);
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    await this.eventsService.setOffline(client.data.user.userId);
  }

  @SubscribeMessage('test')
  handleMessage(): WsResponse<string> {
    this.wss.emit('receiveMessage', { message: 'hello' });
    return { event: 'response', data: 'hello' };
  }
}
