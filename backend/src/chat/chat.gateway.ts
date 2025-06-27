import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

type JoinPayload = {
  eventId: string;
  nickname?: string;
  userId?: string;
};

type MessagePayload = JoinPayload & {
  content: string;
};

@WebSocketGateway({
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://chuzly.app']
        : ['http://localhost:3000'],
    credentials: false,
  },
})
export class ChatGateway {
  constructor(private readonly prisma: PrismaService) {}

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('joinRoom')
  public async handleJoinRoom(
    @MessageBody() payload: JoinPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { eventId, nickname, userId } = payload;
    const allowed = await this.isAllowedToChat(eventId, nickname, userId);

    if (!allowed) {
      client.emit('error', 'Access denied');
      return;
    }

    await client.join(eventId);
    client.emit('joinedRoom', { eventId });
  }

  @SubscribeMessage('sendMessage')
  public async handleSendMessage(
    @MessageBody() data: MessagePayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { eventId, nickname, userId, content } = data;
    const allowed = await this.isAllowedToChat(eventId, nickname, userId);

    if (!allowed) {
      client.emit('error', 'Access denied');
      return;
    }

    const newMessage = await this.prisma.message.create({
      data: { eventId, content, nickname, userId },
    });

    this.server.to(eventId).emit('newMessage', newMessage);
  }

  private async isAllowedToChat(
    eventId: string,
    nickname?: string,
    userId?: string,
  ): Promise<boolean> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { creator: true },
    });

    if (!event) return false;

    const isCreatorPro = event.creator?.plan === 'PRO';

    if (userId && event.creatorId === userId && isCreatorPro) {
      return true;
    }

    if (nickname && isCreatorPro) {
      const guest = await this.prisma.guest.findFirst({
        where: { eventId, nickname },
      });
      if (guest) return true;
    }

    return false;
  }
}
