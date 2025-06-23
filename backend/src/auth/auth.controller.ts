import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResendService } from '../resend/resend.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from './types/request-user';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
    private readonly resend: ResendService,
    private readonly jwt: JwtService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    await this.auth.register(dto);
    await this.sendMagic(dto.email);
    return { message: 'Check your mailbox to activate the account.' };
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('send-magic-link')
  async sendMagicLink(@Body('email') email: string) {
    await this.sendMagic(email);
    return { message: 'If the email exists, a magic link has been sent.' };
  }

  @Get('magic-callback')
  async magicCallback(@Query('token') token: string, @Res() res: Response) {
    try {
      const { userId } = this.jwt.verify<{ userId: string }>(token);

      await this.prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      });

      const session = this.auth.loginFromMagicLink(userId);
      return res.redirect(
        `${process.env.FRONT_URL}/auth/callback?token=${session}`,
      );
    } catch {
      return res.status(400).send('Link invalid / expired');
    }
  }

  private async sendMagic(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return;

    const token = this.auth.generateMagicLinkToken(user.id);
    const url = `${process.env.API_URL ?? process.env.BACK_URL}/auth/magic-callback?token=${token}`;

    console.log('📩 sending magic-link =>', email, url);
    await this.resend.sendMagicLink(email, url);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req: Request) {
    const u = req.user as { userId: string };
    return this.prisma.user.findUnique({
      where: { id: u.userId },
      select: {
        name: true,
        plan: true,
        trialEndsAt: true,
        isAdmin: true,
        cancelAt: true,
        createdAt: true,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(@Req() req: RequestWithUser) {
    await this.auth.deleteAccount(req.user.userId);
  }

  @UseGuards(AuthGuard('google')) @Get('google') googleAuth() {}
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  googleCb(@Req() req: Request, @Res() res: Response) {
    const { token } = req.user as { token: string };
    res.redirect(`${process.env.FRONT_URL}/auth/callback?token=${token}`);
  }

  @UseGuards(AuthGuard('github')) @Get('github') githubAuth() {}
  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  githubCb(@Req() req: Request, @Res() res: Response) {
    const { token } = req.user as { token: string };
    res.redirect(`${process.env.FRONT_URL}/auth/callback?token=${token}`);
  }
}
