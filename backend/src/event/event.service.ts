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

    return event;
  }
}
