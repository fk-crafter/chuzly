import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, Guest } from '@prisma/client';

interface EventWithRelations extends Event {
  options: Array<{
    id: string;
    name: string;
    price: number | null;
    datetime: Date | null;
  }>;
  guests: Array<Guest>;
}

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(data: CreateEventDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const event = (await this.prisma.event.create({
      data: {
        name: data.eventName,
        creatorId: userId,
        options: {
          create: data.options.map((opt) => ({
            name: opt.name,
            price: opt.price ? parseFloat(opt.price) : null,
            datetime: opt.datetime ? new Date(opt.datetime) : null,
          })),
        },
        guests: {
          create: [
            ...data.guests.map((nickname) => ({ nickname })),
            { nickname: user?.name || 'Creator' },
          ],
        },
      },
      include: {
        options: true,
        guests: true,
      },
    })) as EventWithRelations;

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
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        options: {
          where: {
            NOT: {
              name: 'Not available',
            },
          },
        },
        guests: {
          include: { vote: true },
        },
      },
    });

    if (!event) throw new Error('Event not found');

    return {
      id: event.id,
      name: event.name,
      options: event.options,
      guests: event.guests,
      currentGuest: nickname,
    };
  }

  async submitVote(eventId: string, nickname: string, choice: string | null) {
    const guest = await this.prisma.guest.findFirst({
      where: { eventId, nickname },
    });

    if (!guest) throw new Error('Guest not found');

    if (choice === 'unavailable') {
      const notAvailableOption = await this.prisma.option.upsert({
        where: {
          id: `${eventId}_not_available`,
        },
        update: {},
        create: {
          id: `${eventId}_not_available`,
          eventId,
          name: 'Not available',
        },
      });

      return this.prisma.guest.update({
        where: { id: guest.id },
        data: {
          vote: { connect: { id: notAvailableOption.id } },
        },
        include: { vote: true },
      });
    }

    if (!choice) {
      return this.prisma.guest.update({
        where: { id: guest.id },
        data: {
          vote: { disconnect: true },
        },
        include: { vote: true },
      });
    }

    return this.prisma.guest.update({
      where: { id: guest.id },
      data: {
        vote: { connect: { id: choice } },
      },
      include: { vote: true },
    });
  }

  async getVotes(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        guests: {
          include: {
            vote: true,
          },
        },
      },
    });

    if (!event) throw new Error('Event not found');

    return {
      eventName: event.name,
      votes: event.guests.map(
        (guest: {
          nickname: string;
          vote: { name: string; id: string } | null;
        }) => {
          if (!guest.vote) {
            return { nickname: guest.nickname, vote: null };
          }

          if (guest.vote.name === 'Not available') {
            return { nickname: guest.nickname, vote: 'Not available' };
          }

          return {
            nickname: guest.nickname,
            vote: {
              optionName: guest.vote.name,
              optionId: guest.vote.id,
            },
          };
        },
      ),
    };
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        options: true,
        guests: true,
      },
    });
  }

  async getEventsByCreator(userId: string) {
    const events = await this.prisma.event.findMany({
      where: { creatorId: userId },
      include: {
        guests: {
          include: {
            vote: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return events.map((event) => ({
      id: event.id,
      name: event.name,
      createdAt: event.createdAt,
      guestsCount: event.guests.length,
      votesCount: event.guests.filter((g) => g.vote !== null).length,
    }));
  }
}
