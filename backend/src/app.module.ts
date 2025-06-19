import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from 'src/event/event.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BillingController } from './billing/billing.controller';

@Module({
  imports: [PrismaModule, EventModule, AuthModule, AdminModule],
  controllers: [BillingController],
})
export class AppModule {}
