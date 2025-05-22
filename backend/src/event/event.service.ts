import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(data: CreateEventDto) {
    const event = await this.prisma.event.create({
      data: {
        name: data.eventName,
        options: {
          create: data.options.map((opt) => ({
            name: opt.name,
            price: opt.price ? parseFloat(opt.price) : null,
            datetime: opt.datetime ? new Date(opt.datetime) : null,
          })),
        },
        guests: {
          create: data.guests.map((g) => ({
            nickname: g,
          })),
        },
      },
      include: {
        options: true,
        guests: true,
      },
    });

    const links = event.guests.map((guest) => ({
      nickname: guest.nickname,
      url: `http://localhost:5001/events/${event.id}/guest/${guest.nickname}`,
    }));

    return {
      ...event,
      links,
    };
  }

  async findAll() {
    return this.prisma.event.findMany({
      include: {
        options: true,
        guests: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneWithGuest(eventId: string, nickname: string) {
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        options: true,
        guests: {
          where: { nickname },
        },
      },
    });
  }

  async submitVote(eventId: string, nickname: string, choice: string | null) {
    const guest = await this.prisma.guest.findFirst({
      where: {
        eventId,
        nickname,
      },
    });

    if (!guest) {
      throw new Error('Guest not found');
    }

    return this.prisma.guest.update({
      where: { id: guest.id },
      data: {
        vote: choice ? { connect: { id: choice } } : { disconnect: true },
      },

      include: {
        vote: true,
      },
    });
  }
}
