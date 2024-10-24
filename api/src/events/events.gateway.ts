import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EventsService } from './events.service';
import { Socket } from 'socket.io';
import { TokensService } from 'src/tokens/tokens.service';
import { Logger } from '@nestjs/common';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { UpdateMessageDto } from 'src/messages/dto/update-message.dto';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsGateway.name);

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

      this.logger.debug(`User ${userId} connected`);
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const chatIds = await this.eventsService.getUserChatIds(client.data.userId);
    await this.eventsService.setOffline(client.data.userId);
    this.wss.to(chatIds).emit('userOffline', { userId: client.data.userId });

    this.logger.debug(`User ${client.data.userId} disconnected`);
  }

  @SubscribeMessage('send_message')
  async sendMessage(client: Socket, dto: CreateMessageDto) {
    const message = await this.eventsService.sendMessage(
      dto,
      client.data.userId,
    );
    this.wss.to(message.chatId).emit('receiveMessage', message);
  }

  @SubscribeMessage('edit_message')
  async editMessage(client: Socket, dto: UpdateMessageDto) {
    const message = await this.eventsService.updateMessage(
      dto,
      client.data.userId,
    );
    this.wss.to(message.chatId).emit('updateMessage', message);
  }

  @SubscribeMessage('delete_message')
  async deleteMessage(client: Socket, messageId: string) {
    const message = await this.eventsService.deleteMessage(
      messageId,
      client.data.userId,
    );
    this.wss.to(message.chatId).emit('removeMessage', message);
  }
}
