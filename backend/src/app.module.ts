import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from 'src/event/event.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { StripeModule } from './stripe/stripe.module';
import { ResendModule } from './resend/resend.module';

@Module({
  imports: [
    PrismaModule,
    EventModule,
    AuthModule,
    AdminModule,
    StripeModule,
    ResendModule,
  ],
})
export class AppModule {}
