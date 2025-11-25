import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFeedbackDto, userId: string) {
    return this.prisma.feedback.create({
      data: {
        title: dto.title,
        description: dto.description,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    const list = await this.prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
      },
    });

    return list.map((f) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      votes: f.votes,
      liked: f.likedBy.includes(userId),
      mine: f.userId === userId,
      user: { name: f.user.name },
      createdAt: f.createdAt,
    }));
  }

  async toggleLike(id: string, userId: string) {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new NotFoundException('Feedback not found');

    const alreadyLiked = feedback.likedBy.includes(userId);

    const updatedLikes = alreadyLiked
      ? feedback.likedBy.filter((u) => u !== userId)
      : [...feedback.likedBy, userId];

    return this.prisma.feedback.update({
      where: { id },
      data: {
        likedBy: updatedLikes,
        votes: updatedLikes.length,
      },
    });
  }

  async delete(id: string, userId: string) {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });

    if (!feedback) throw new NotFoundException('Feedback not found');
    if (feedback.userId !== userId)
      throw new ForbiddenException('You can only delete your own feedback');

    await this.prisma.feedback.delete({ where: { id } });

    return { success: true };
  }
}
