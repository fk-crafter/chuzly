import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.API_URL}/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      id: string;
      username: string;
      displayName: string;
      emails?: Array<{ value: string }>;
    },
  ) {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || profile.username;

    if (!email) {
      throw new Error('No email found from GitHub profile');
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          password: '',
          name,
          plan: 'TRIAL',
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    const token = this.jwt.sign({
      userId: user.id,
      name: user.name,
      plan: user.plan,
    });

    return { token };
  }
}
