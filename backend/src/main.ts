import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  await app.listen(process.env.PORT ?? 5001);
}
void bootstrap();
