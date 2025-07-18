import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from 'src/event/event.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { StripeModule } from './stripe/stripe.module';
import { ChatModule } from './chat/chat.module';
import { WaitlistModule } from './waitlist/waitlist.module';

@Module({
  imports: [
    PrismaModule,
    EventModule,
    AuthModule,
    AdminModule,
    StripeModule,
    ChatModule,
    WaitlistModule,
  ],
})
export class AppModule {}
