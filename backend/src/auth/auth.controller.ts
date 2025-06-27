import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { RequestWithUser } from './types/request-user';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json({ message: 'Logged out' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req: Request) {
    const user = req.user as { userId: string };
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        name: true,
        email: true,
        plan: true,
        trialEndsAt: true,
        isAdmin: true,
        cancelAt: true,
        createdAt: true,
        avatarColor: true,
      },
    });

    return dbUser;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteAccount(@Req() req: RequestWithUser) {
    await this.authService.deleteAccount(req.user.userId);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  googleAuth() {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as { token: string };
    const token = user.token;

    res.redirect(`${process.env.FRONT_URL}/auth/callback?token=${token}`);
  }

  @UseGuards(AuthGuard('github'))
  @Get('github')
  githubAuth() {}

  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as { token: string };
    const token = user.token;

    res.redirect(`${process.env.FRONT_URL}/auth/callback?token=${token}`);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.authService.sendPasswordReset(email);
    return { success: true };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('avatar-color')
  async updateAvatarColor(
    @Req() req: Request,
    @Body() body: { color: string },
  ) {
    const user = req.user as { userId: string };
    const { color } = body;

    await this.prisma.user.update({
      where: { id: user.userId },
      data: { avatarColor: color },
    });

    return { success: true };
  }
}
