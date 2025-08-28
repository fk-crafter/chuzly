import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.decorator';
import { PlanGuard } from '../auth/plan.guard';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), PlanGuard)
  createEvent(@Body() body: CreateEventDto, @User() user: { userId: string }) {
    return this.eventService.createEvent(body, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  getMyEvents(@User() user: { userId: string }) {
    return this.eventService.getEventsByCreator(user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('overview')
  async getOverview(@User() user: { userId: string }) {
    return this.eventService.getOverviewStats(user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('upcoming')
  async getUpcoming(@User() user: { userId: string }): Promise<
    Array<{
      id: string;
      name: string;
      votingDeadline: Date;
      guestsCount: number;
      votesCount: number;
    }>
  > {
    const events = await this.eventService.getUpcomingEvents(user.userId, 5);
    return events;
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id/guest/:nickname')
  findOneWithGuest(
    @Param('id') id: string,
    @Param('nickname') nickname: string,
  ) {
    return this.eventService.findOneWithGuest(id, nickname);
  }

  @Post(':id/guest/:nickname/vote')
  submitVote(
    @Param('id') id: string,
    @Param('nickname') nickname: string,
    @Body('choice') choice: string | null,
  ) {
    return this.eventService.submitVote(id, nickname, choice);
  }

  @Get(':id/votes')
  getVotes(@Param('id') id: string) {
    return this.eventService.getVotes(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Post(':id/access')
  async checkAccessToChat(
    @Param('id') eventId: string,
    @Body() body: { guest?: string; userId?: string },
  ) {
    const { guest, userId } = body;

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { creator: true },
    });

    if (!event || !event.creator || event.creator.plan !== 'PRO') {
      return { allowed: false };
    }

    if (userId && event.creatorId === userId) {
      return { allowed: true };
    }

    if (guest) {
      const guestInDb = await this.prisma.guest.findFirst({
        where: { eventId, nickname: guest },
      });
      if (guestInDb) {
        return { allowed: true };
      }
    }

    return { allowed: false };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteEvent(@Param('id') id: string, @User() user: { userId: string }) {
    return this.eventService.deleteEvent(id, user.userId);
  }
}
