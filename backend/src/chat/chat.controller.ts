import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':eventId')
  async getMessages(@Param('eventId') eventId: string) {
    return this.prisma.message.findMany({
      where: { eventId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: { name: true },
        },
      },
    });
  }
}
