import {
  Controller,
  Delete,
  Get,
  UseGuards,
  Param,
  Patch,
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
}
