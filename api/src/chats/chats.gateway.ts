import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Socket } from 'socket.io';
import { WsUser } from 'src/common/ws-user.decorator';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Socket;
  constructor(private readonly chatsService: ChatsService) {}

  handleConnection(@WsUser('userId') userId: string) {
    console.log('connected', userId);
  }

  handleDisconnect(client: Socket) {
    console.log('user disconnected');
  }

  @SubscribeMessage('test')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
    @WsUser('userId') userId: string,
  ): WsResponse<string> {
    console.log(userId);
    console.log(payload);
    return { event: 'response', data: 'hello' };
  }
}
