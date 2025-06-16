import {
  Controller,
  Delete,
  Get,
  UseGuards,
  Param,
  Patch,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from './admin.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Patch('users/:id/promote')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async promoteUser(@Param('id') id: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isAdmin: true },
    });

    return { message: 'User promoted to admin', user };
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('users/:id/demote')
  async demoteUser(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isAdmin) {
      throw new BadRequestException('User is not an admin');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        isAdmin: false,
      },
    });

    return {
      message: 'User demoted to regular user',
      user: await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          createdAt: true,
          trialEndsAt: true,
          isAdmin: true,
        },
      }),
    };
  }
}
