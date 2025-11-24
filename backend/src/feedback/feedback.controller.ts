import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.decorator';

@Controller('feedback')
@UseGuards(AuthGuard('jwt'))
export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  @Post()
  create(@Body() dto: CreateFeedbackDto, @User() user: { userId: string }) {
    return this.service.create(dto, user.userId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/like')
  toggle(@Param('id') id: string, @User() user: { userId: string }) {
    return this.service.toggleLike(id, user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @User() user: { userId: string }) {
    return this.service.delete(id, user.userId);
  }
}
