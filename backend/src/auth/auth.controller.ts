import {
  Body,
  Controller,
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

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req: Request) {
    const user = req.user as { userId: string };
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        name: true,
        plan: true,
      },
    });

    return dbUser;
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
}
