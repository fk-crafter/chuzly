import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private prisma: PrismaService) {}

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { eventId: string },
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(data.eventId);
    console.log(`Client ${client.id} joined room ${data.eventId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: {
      eventId: string;
      content: string;
      nickname: string;
      authorId?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.prisma.message.create({
      data: {
        eventId: data.eventId,
        content: data.content,
        nickname: data.nickname,
        authorId: data.authorId,
      },
    });

    client.to(data.eventId).emit('newMessage', message);
    client.emit('newMessage', message);
  }
}
