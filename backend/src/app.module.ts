import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from 'src/event/event.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, EventModule, AuthModule],
})
export class AppModule {}
