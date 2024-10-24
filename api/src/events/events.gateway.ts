import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EventsService } from './events.service';
import { Socket } from 'socket.io';
import { TokensService } from 'src/tokens/tokens.service';
import { MessageDto } from 'src/messages/dto/message.dto';

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
      const { userId } = await this.tokensService.verifyAccessToken(token);

      client.data.userId = userId;

      const chatIds = await this.eventsService.getUserChatIds(
        client.data.userId,
      );

      client.join(chatIds);

      await this.eventsService.setOnline(client.data.userId);

      this.wss.to(chatIds).emit('userOnline', { userId: client.data.userId });
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const chatIds = await this.eventsService.getUserChatIds(client.data.userId);
    await this.eventsService.setOffline(client.data.user.userId);
    this.wss.to(chatIds).emit('userOffline', { userId: client.data.userId });
  }

  async notifyMessage(chatId: string, message: MessageDto) {
    this.wss.to(chatId).emit('receiveMessage', message);
  }
}
