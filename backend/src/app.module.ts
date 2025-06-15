import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from 'src/event/event.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [PrismaModule, EventModule, AuthModule, MailModule],
})
export class AppModule {}
