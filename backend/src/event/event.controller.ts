import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.decorator';
import { PlanGuard } from '../auth/plan.guard';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

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
}
