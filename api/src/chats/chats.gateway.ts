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

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Socket;
  constructor(private readonly chatsService: ChatsService) {}

  handleConnection() {
    console.log('connected');
  }

  handleDisconnect() {
    console.log('user disconnected');
  }

  @SubscribeMessage('test')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ): WsResponse<string> {
    console.log(payload);
    return { event: 'response', data: 'hello' };
  }
}
