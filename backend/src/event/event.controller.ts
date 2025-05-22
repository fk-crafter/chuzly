import { Controller, Post, Body, Get } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  createEvent(@Body() body: CreateEventDto) {
    return this.eventService.createEvent(body);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }
}
